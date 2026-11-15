import type { UserRole } from '#shared/enums';

export class ArchivePolicy {
  canView(role?: UserRole): boolean {
    return role === 'ADMIN' || role === 'EDITOR';
  }

  canManage(role?: UserRole): boolean {
    return role === 'ADMIN';
  }
}

export const archivePolicy = new ArchivePolicy();
