import type { MiddlewareHandler } from 'hono';
import { AppException } from '#exceptions/app_exception';
import { container } from '#infrastructure/container/container';
import {
  USER_RESOLVER_TOKEN,
  SESSION_RESOLVER_TOKEN,
  type UserResolver,
  type SessionResolver,
} from '#contracts/auth_contract';

export interface AuthOptions {
  optional?: boolean;
}

export function auth(options: AuthOptions = {}): MiddlewareHandler {
  const optional = options.optional ?? false;

  return async (c, next) => {
    const authHeader = c.req.header('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (optional) {
        await next();
        return;
      }
      throw AppException.unauthenticated('Missing or invalid Authorization header. Bearer token required.');
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      if (optional) {
        await next();
        return;
      }
      throw AppException.unauthenticated('Empty Bearer token provided.');
    }

    try {
      // 1. Primary: Opaque Session Token via SessionResolver
      if (container.has(SESSION_RESOLVER_TOKEN)) {
        const resolver = container.make<SessionResolver>(SESSION_RESOLVER_TOKEN);
        const session = await resolver.resolveSession(token);

        if (!session) {
          if (optional) {
            await next();
            return;
          }
          throw AppException.unauthenticated('Invalid or expired session token.');
        }

        c.set('session', session);
        c.set('visitorId', session.visitorId);
        c.set('isAnonymous', session.isAnonymous);

        if (session.account) {
          const user = {
            userId: session.account.id,
            email: session.account.email,
            role: session.account.role,
            displayName: session.account.displayName,
          };
          c.set('user', user);
          c.set('account', session.account);
          c.set('userId', session.account.id);
        }

        await next();
        return;
      }

      // 2. Fallback: UserResolver (legacy / test mocks)
      if (container.has(USER_RESOLVER_TOKEN)) {
        const resolver = container.make<UserResolver>(USER_RESOLVER_TOKEN);
        const resolved = await resolver.resolveUser(token);
        if (!resolved) {
          if (optional) {
            await next();
            return;
          }
          throw AppException.unauthenticated('User account no longer exists.');
        }
        c.set('user', resolved);
        c.set('userId', resolved.userId);
        await next();
        return;
      }

      if (optional) {
        await next();
        return;
      }
      throw AppException.unauthenticated('Session resolution unavailable.');
    } catch (err) {
      if (optional) {
        await next();
        return;
      }
      throw err;
    }
  };
}

export const authMiddleware = auth;
