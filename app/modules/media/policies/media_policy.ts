import type { UserRole } from '#shared/enums';

export class MediaPolicy {
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

export const mediaPolicy = new MediaPolicy();
