import type { UserModel } from '../models/user.js';
import type { UserProfileDto, LoginResponseDataDto } from '../validators/auth.js';

export class AuthSerializer {
  serializeUserProfile(user: UserModel): UserProfileDto {
    return {
      userId: user.userId,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  serializeLoginResponse(user: UserModel, accessToken: string, expiresIn: number): LoginResponseDataDto {
    return {
      user: this.serializeUserProfile(user),
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
    };
  }

  serializeRefreshResponse(accessToken: string, expiresIn: number) {
    return {
      accessToken,
      tokenType: 'Bearer' as const,
      expiresIn,
    };
  }
}

export const authSerializer = new AuthSerializer();
