import crypto from 'node:crypto';
import type { UserModel } from '../models/user.js';
import { AuthRepository, authRepository } from '../repositories/auth_repository.js';
import { hashPassword, verifyPassword } from '#infrastructure/security/password_hasher';
import { signAccessToken, generateOpaqueToken, hashOpaqueToken } from '#infrastructure/security/token_service';
import { authConfig } from '#config/auth';
import { AppException } from '#exceptions/app_exception';
import type { LoginRequestDto, ChangePasswordRequestDto } from '../validators/auth.js';

const DUMMY_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$dHVtbXlzYWx0dmFsdWUxMjM0$9qGvGv58R6V1WwWwWwWwWwWwWwWwWwWwWwWwWwWwWwU';

export interface RequestContext {
  clientIp: string;
  userAgent?: string | undefined;
  requestId: string;
}

export class AuthService {
  constructor(private readonly repo: AuthRepository = authRepository) {}

  async login(
    dto: LoginRequestDto,
    context: RequestContext
  ): Promise<{ user: UserModel; accessToken: string; rawRefreshToken: string; expiresIn: number }> {
    const user = await this.repo.findUserByEmail(dto.email);

    if (!user) {
      await verifyPassword(dto.password, DUMMY_HASH);
      throw AppException.unauthenticated('Invalid email or password.');
    }

    if (!user.isActive) {
      await verifyPassword(dto.password, DUMMY_HASH);
      throw AppException.unauthenticated('Account is inactive or disabled.');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await verifyPassword(dto.password, DUMMY_HASH);
      throw AppException.unauthenticated('Invalid email or password.');
    }

    const isPasswordValid = await verifyPassword(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      await this.repo.recordFailedLogin(user.userId, 15);
      throw AppException.unauthenticated('Invalid email or password.');
    }

    const updatedUser = await this.repo.resetFailedLogin(user.userId);

    const accessToken = await signAccessToken({
      userId: updatedUser.userId,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    const rawRefreshToken = generateOpaqueToken();
    const tokenHash = hashOpaqueToken(rawRefreshToken);
    const familyId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + authConfig.refreshToken.expiresInDays * 24 * 60 * 60 * 1000);
    const userAgentHash = context.userAgent ? hashOpaqueToken(context.userAgent) : undefined;

    await this.repo.createRefreshToken({
      tokenHash,
      userId: updatedUser.userId,
      familyId,
      expiresAt,
      userAgentHash,
    });

    return {
      user: updatedUser,
      accessToken,
      rawRefreshToken,
      expiresIn: authConfig.jwt.expiresInSeconds,
    };
  }

  async refresh(
    rawRefreshToken: string | undefined,
    context: RequestContext
  ): Promise<{ accessToken: string; newRawRefreshToken: string; expiresIn: number }> {
    if (!rawRefreshToken) {
      throw AppException.unauthenticated('Missing refresh token cookie.');
    }

    const tokenHash = hashOpaqueToken(rawRefreshToken);
    const record = await this.repo.findRefreshTokenByHash(tokenHash);

    if (!record) {
      throw AppException.unauthenticated('Invalid or expired refresh token.');
    }

    if (record.revokedAt !== null) {
      await this.repo.revokeFamily(record.familyId);
      throw AppException.unauthenticated(
        'Refresh token reuse detected. All sessions in this family have been terminated.'
      );
    }

    if (record.expiresAt < new Date()) {
      await this.repo.revokeFamily(record.familyId);
      throw AppException.unauthenticated('Refresh token has expired.');
    }

    if (!record.user.isActive) {
      throw AppException.unauthenticated('User account is inactive or disabled.');
    }

    const newRawRefreshToken = generateOpaqueToken();
    const newTokenHash = hashOpaqueToken(newRawRefreshToken);
    const newExpiresAt = new Date(Date.now() + authConfig.refreshToken.expiresInDays * 24 * 60 * 60 * 1000);
    const userAgentHash = context.userAgent ? hashOpaqueToken(context.userAgent) : undefined;

    await this.repo.rotateRefreshToken(record.refreshTokenId, {
      tokenHash: newTokenHash,
      userId: record.userId,
      familyId: record.familyId,
      expiresAt: newExpiresAt,
      userAgentHash,
    });

    const accessToken = await signAccessToken({
      userId: record.user.userId,
      email: record.user.email,
      role: record.user.role,
    });

    return {
      accessToken,
      newRawRefreshToken,
      expiresIn: authConfig.jwt.expiresInSeconds,
    };
  }

  async logout(rawRefreshToken: string | undefined): Promise<void> {
    if (rawRefreshToken) {
      const tokenHash = hashOpaqueToken(rawRefreshToken);
      const record = await this.repo.findRefreshTokenByHash(tokenHash);
      if (record) {
        await this.repo.revokeFamily(record.familyId);
      }
    }
  }

  async getProfile(userId: string): Promise<UserModel> {
    const user = await this.repo.findUserById(userId);
    if (!user || !user.isActive) {
      throw AppException.unauthenticated('Authenticated user not found or disabled.');
    }
    return user;
  }

  async changePassword(userId: string, dto: ChangePasswordRequestDto): Promise<void> {
    const user = await this.repo.findUserById(userId);
    if (!user || !user.isActive) {
      throw AppException.unauthenticated('Authenticated user not found or disabled.');
    }

    const isCurrentValid = await verifyPassword(dto.currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      throw AppException.badRequest('Current password is incorrect.');
    }

    const newPasswordHash = await hashPassword(dto.newPassword);
    await this.repo.updatePassword(userId, newPasswordHash);
    await this.repo.revokeAllUserTokens(userId);
  }
}

export const authService = new AuthService();
