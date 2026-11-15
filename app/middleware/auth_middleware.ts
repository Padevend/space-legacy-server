import type { MiddlewareHandler } from 'hono';
import { verifyAccessToken } from '#infrastructure/security/token_service';
import { AppException } from '#exceptions/app_exception';
import { container } from '#infrastructure/container/container';
import { USER_RESOLVER_TOKEN, type UserResolver } from '#contracts/auth_contract';

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
      const payload = await verifyAccessToken(token);

      if (container.has(USER_RESOLVER_TOKEN)) {
        const resolver = container.make<UserResolver>(USER_RESOLVER_TOKEN);
        const resolved = await resolver.resolveUser(payload.userId);
        if (!resolved) {
          throw AppException.unauthenticated('User account no longer exists.');
        }
        if (resolved.status === 'SUSPENDED') {
          throw AppException.unauthenticated('User account is suspended.');
        }
        c.set('user', resolved);
        c.set('userId', resolved.userId);
      } else {
        c.set('user', payload);
        c.set('userId', payload.userId);
      }
    } catch (err) {
      if (optional) {
        await next();
        return;
      }
      throw err;
    }

    await next();
  };
}

export const authMiddleware = auth;
