import type { UserRole } from './model.js';

export interface LoginBody {
  /** Valid email format */
  email: string;
  /** Plain text password */
  password: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  /** Minimum 12 characters, uppercase, lowercase, number, special character */
  newPassword: string;
}

export interface ListUsersQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sort?: 'email' | 'role' | 'createdAt' | 'lastLoginAt';
  order?: 'asc' | 'desc';
}

export interface CreateUserBody {
  email: string;
  role: UserRole;
  /** Minimum 12 characters, uppercase, lowercase, number, special character */
  password: string;
}

export interface UpdateUserBody {
  role?: UserRole;
  isActive?: boolean;
  /** If provided, sets a new password (min 12 chars) */
  password?: string;
}

export interface UserIdParams {
  id: string; // UUID v4
}
