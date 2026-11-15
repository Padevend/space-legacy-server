import type { AuthenticatedUser } from '#contracts/auth_contract';

export class LocationPolicy {
  canWrite(actor: AuthenticatedUser): boolean {
    return actor.role === 'ADMIN' || actor.role === 'EDITOR';
  }

  canDelete(actor: AuthenticatedUser): boolean {
    return actor.role === 'ADMIN';
  }
}

export const locationPolicy = new LocationPolicy();
