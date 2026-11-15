import type { UserRole } from '#shared/enums';

export interface UserModel {
  userId: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  failedLoginCount: number;
  lockedUntil: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
