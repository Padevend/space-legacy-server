import type { UserModel } from '../models/user.js';
import type { UserProfileDto } from '../validators/auth.js';

export class UserSerializer {
  serializeUser(user: UserModel): UserProfileDto {
    return {
      userId: user.userId,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  serializeUserList(users: UserModel[]): UserProfileDto[] {
    return users.map((user) => this.serializeUser(user));
  }
}

export const userSerializer = new UserSerializer();
