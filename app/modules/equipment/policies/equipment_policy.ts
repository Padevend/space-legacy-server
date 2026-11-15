import type { AuthenticatedUser } from '#contracts/auth_contract';

export class EquipmentPolicy {
  canWrite(actor: AuthenticatedUser): boolean {
    return actor.role === 'ADMIN' || actor.role === 'EDITOR';
  }

  canDelete(actor: AuthenticatedUser): boolean {
    return actor.role === 'ADMIN';
  }
}

export const equipmentPolicy = new EquipmentPolicy();
