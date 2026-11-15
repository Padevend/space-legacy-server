import type { User } from '@prisma/client';
import type { UserProfileDto, LoginResponseDataDto, RefreshResponseDataDto } from './auth.schemas.js';

export class AuthSerializer {
  serializeUserProfile(user: User): UserProfileDto {
    return {
      userId: user.userId,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  serializeLoginResponse(user: User, accessToken: string, expiresIn: number): LoginResponseDataDto {
    return {
      user: this.serializeUserProfile(user),
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
    };
  }

  serializeRefreshResponse(accessToken: string, expiresIn: number): RefreshResponseDataDto {
    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
    };
  }
}

export const authSerializer = new AuthSerializer();
