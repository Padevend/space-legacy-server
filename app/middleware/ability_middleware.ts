import type { MiddlewareHandler } from 'hono';
import { AppException } from '#exceptions/app_exception';
import { hasPermission, type Permission } from '#config/permissions';
import { auth } from './auth_middleware.js';
import type { AuthenticatedUser } from '#contracts/auth_contract';
import type { UserRole } from '#shared/enums';

export function ability(permission: Permission): MiddlewareHandler {
  const authHandler = auth();

  return async (c, next) => {
    if (!c.get('user')) {
      await authHandler(c, async () => {});
    }

    const user = c.get('user') as AuthenticatedUser | undefined;

    if (!user) {
      throw AppException.unauthenticated('Authentication required.');
    }

    if (!hasPermission(user.role, permission)) {
      throw AppException.forbidden(`Forbidden: Insufficient permissions for '${permission}'.`);
    }

    await next();
  };
}

export function requireRole(role: UserRole): MiddlewareHandler {
  const authHandler = auth();

  return async (c, next) => {
    if (!c.get('user')) {
      await authHandler(c, async () => {});
    }

    const user = c.get('user') as AuthenticatedUser | undefined;

    if (!user) {
      throw AppException.unauthenticated('Authentication required.');
    }

    if (role === 'ADMIN' && user.role !== 'ADMIN') {
      throw AppException.forbidden('Admin role required to perform this action.');
    }

    await next();
  };
}

export const abilityMiddleware = {
  can: ability,
  requireRole,
};
