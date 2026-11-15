import type { AuthenticatedUser } from '#contracts/auth_contract';

export class AuditPolicy {
  canView(actor: AuthenticatedUser): boolean {
    return actor.role === 'ADMIN';
  }
}

export const auditPolicy = new AuditPolicy();
