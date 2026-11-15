import type { UserRole } from '#shared/enums';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
  status?: string;
}

export interface UserResolver {
  resolveUser(userId: string): Promise<AuthenticatedUser | null>;
}

export const USER_RESOLVER_TOKEN = Symbol('UserResolver');
