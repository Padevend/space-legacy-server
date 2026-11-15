import type { UserRole } from '#shared/enums';

export class IngestionPolicy {
  canRun(role?: UserRole): boolean {
    return role === 'ADMIN';
  }

  canView(role?: UserRole): boolean {
    return role === 'ADMIN' || role === 'EDITOR';
  }
}

export const ingestionPolicy = new IngestionPolicy();
