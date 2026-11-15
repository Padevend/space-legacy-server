import type { User } from '@prisma/client';
import type { UserProfileDto } from '../auth/auth.schemas.js';

export class UsersSerializer {
  serializeUser(user: User): UserProfileDto {
    return {
      userId: user.userId,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  serializeUserList(users: User[]): UserProfileDto[] {
    return users.map((user) => this.serializeUser(user));
  }
}

export const usersSerializer = new UsersSerializer();
