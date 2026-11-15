import type { AccountRole } from '#shared/enums';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: AccountRole;
  displayName?: string;
  status?: string;
}

export interface SessionContext {
  sessionId: string;
  visitorId: string;
  isAnonymous: boolean;
  account: {
    id: string;
    email: string;
    displayName: string;
    role: AccountRole;
  } | null;
  rawToken: string;
}

export interface UserResolver {
  resolveUser(userId: string): Promise<AuthenticatedUser | null>;
}

export interface SessionResolver {
  resolveSession(rawToken: string): Promise<SessionContext | null>;
}

export const USER_RESOLVER_TOKEN = Symbol('UserResolver');
export const SESSION_RESOLVER_TOKEN = Symbol('SessionResolver');
