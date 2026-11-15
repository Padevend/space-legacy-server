import type { AuthenticatedUser } from '#contracts/auth_contract';

export class PersonPolicy {
  canWrite(actor: AuthenticatedUser): boolean {
    return actor.role === 'ADMIN' || actor.role === 'EDITOR';
  }

  canDelete(actor: AuthenticatedUser): boolean {
    return actor.role === 'ADMIN';
  }
}

export const personPolicy = new PersonPolicy();
