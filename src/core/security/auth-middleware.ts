import type { MiddlewareHandler } from 'hono';
import type { AppEnv } from '../http/context.js';
import { verifyAccessToken } from './tokens.js';
import { AppException } from '../exceptions/AppException.js';

export function authenticate(optional = false): MiddlewareHandler<AppEnv> {
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
      c.set('user', payload);
      c.set('userId', payload.userId);
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

export function requireRole(role: 'ADMIN' | 'EDITOR'): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const user = c.get('user');

    if (!user) {
      throw AppException.unauthenticated('Authentication required.');
    }

    if (role === 'ADMIN' && user.role !== 'ADMIN') {
      throw AppException.forbidden('Admin role required to perform this action.');
    }

    await next();
  };
}
