import crypto from 'node:crypto';
import { authRepository } from './auth.repository.js';
import { hashPassword, verifyPassword, signAccessToken, generateOpaqueToken, hashOpaqueToken, } from '../../core/security/index.js';
import { authConfig } from '../../../config/auth.js';
import { AppException } from '../../core/exceptions/AppException.js';
// Precomputed Argon2id hash for constant-time dummy verification on unknown emails
// Argon2id with m=65536, t=3, p=4
const DUMMY_HASH = '$argon2id$v=19$m=65536,t=3,p=4$dHVtbXlzYWx0dmFsdWUxMjM0$9qGvGv58R6V1WwWwWwWwWwWwWwWwWwWwWwWwWwWwWwU';
export class AuthService {
    repo;
    constructor(repo = authRepository) {
        this.repo = repo;
    }
    async login(dto, context) {
        const user = await this.repo.findUserByEmail(dto.email);
        // If user does not exist, compute dummy verify to prevent timing enumeration
        if (!user) {
            await verifyPassword(dto.password, DUMMY_HASH);
            throw AppException.unauthenticated('Invalid email or password.');
        }
        if (!user.isActive) {
            await verifyPassword(dto.password, DUMMY_HASH);
            throw AppException.unauthenticated('Account is inactive or disabled.');
        }
        // Check account lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            await verifyPassword(dto.password, DUMMY_HASH);
            // Return identical error response as wrong password / unknown email per Section 9.3
            throw AppException.unauthenticated('Invalid email or password.');
        }
        const isPasswordValid = await verifyPassword(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            await this.repo.recordFailedLogin(user.userId, 15);
            throw AppException.unauthenticated('Invalid email or password.');
        }
        // Successful login: reset failed login count
        const updatedUser = await this.repo.resetFailedLogin(user.userId);
        // Issue short-lived JWT access token
        const accessToken = await signAccessToken({
            userId: updatedUser.userId,
            email: updatedUser.email,
            role: updatedUser.role,
        });
        // Generate opaque refresh token and family
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
        // Record login audit log
        await this.repo.createAuditLog({
            actorId: updatedUser.userId,
            action: 'AUTH_LOGIN',
            entity: 'User',
            entityId: updatedUser.userId,
            requestId: context.requestId,
            diffSummary: { clientIp: context.clientIp },
        });
        return {
            user: updatedUser,
            accessToken,
            rawRefreshToken,
            expiresIn: authConfig.jwt.expiresInSeconds,
        };
    }
    async refresh(rawRefreshToken, context) {
        if (!rawRefreshToken) {
            throw AppException.unauthenticated('Missing refresh token cookie.');
        }
        const tokenHash = hashOpaqueToken(rawRefreshToken);
        const record = await this.repo.findRefreshTokenByHash(tokenHash);
        if (!record) {
            throw AppException.unauthenticated('Invalid or expired refresh token.');
        }
        // Token reuse detection: if token is already revoked, revoke the entire family!
        if (record.revokedAt !== null) {
            await this.repo.revokeFamily(record.familyId);
            await this.repo.createAuditLog({
                actorId: record.userId,
                action: 'AUTH_TOKEN_REUSE_DETECTED',
                entity: 'RefreshToken',
                entityId: record.refreshTokenId,
                requestId: context.requestId,
                diffSummary: {
                    familyId: record.familyId,
                    incident: 'Revoked refresh token presented. Terminated token family.',
                    clientIp: context.clientIp,
                },
            });
            throw AppException.unauthenticated('Refresh token reuse detected. All sessions in this family have been terminated.');
        }
        // Check expiration
        if (record.expiresAt < new Date()) {
            await this.repo.revokeFamily(record.familyId);
            throw AppException.unauthenticated('Refresh token has expired.');
        }
        // Check user active status
        if (!record.user.isActive) {
            throw AppException.unauthenticated('User account is inactive or disabled.');
        }
        // Rotate refresh token
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
        // Issue new JWT access token
        const accessToken = await signAccessToken({
            userId: record.user.userId,
            email: record.user.email,
            role: record.user.role,
        });
        await this.repo.createAuditLog({
            actorId: record.user.userId,
            action: 'AUTH_REFRESH',
            entity: 'RefreshToken',
            entityId: record.refreshTokenId,
            requestId: context.requestId,
            diffSummary: { familyId: record.familyId },
        });
        return {
            accessToken,
            newRawRefreshToken,
            expiresIn: authConfig.jwt.expiresInSeconds,
        };
    }
    async logout(rawRefreshToken, userId, context) {
        if (rawRefreshToken) {
            const tokenHash = hashOpaqueToken(rawRefreshToken);
            const record = await this.repo.findRefreshTokenByHash(tokenHash);
            if (record) {
                await this.repo.revokeFamily(record.familyId);
            }
        }
        if (userId) {
            await this.repo.createAuditLog({
                actorId: userId,
                action: 'AUTH_LOGOUT',
                entity: 'User',
                entityId: userId,
                requestId: context.requestId,
            });
        }
    }
    async getProfile(userId) {
        const user = await this.repo.findUserById(userId);
        if (!user || !user.isActive) {
            throw AppException.unauthenticated('Authenticated user not found or disabled.');
        }
        return user;
    }
    async changePassword(userId, dto, context) {
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
        // Revoke all existing refresh token sessions for this user
        await this.repo.revokeAllUserTokens(userId);
        await this.repo.createAuditLog({
            actorId: userId,
            action: 'AUTH_PASSWORD_CHANGED',
            entity: 'User',
            entityId: userId,
            requestId: context.requestId,
            diffSummary: { revokedSessions: true },
        });
    }
}
export const authService = new AuthService();
