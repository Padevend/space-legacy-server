import type { UserRole } from '#shared/enums';

export class MeasurementPolicy {
  canView(): boolean {
    return true;
  }

  canManage(role?: UserRole): boolean {
    return role === 'ADMIN' || role === 'EDITOR';
  }

  canDelete(role?: UserRole): boolean {
    return role === 'ADMIN';
  }
}

export const measurementPolicy = new MeasurementPolicy();
