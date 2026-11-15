import type { UserRole } from '#shared/enums';

export class StoryPolicy {
  canViewPublic(): boolean {
    return true;
  }

  canManage(role?: UserRole): boolean {
    return role === 'ADMIN' || role === 'EDITOR';
  }

  canPublish(role?: UserRole): boolean {
    return role === 'ADMIN' || role === 'EDITOR';
  }

  canDelete(role?: UserRole): boolean {
    return role === 'ADMIN';
  }
}

export const storyPolicy = new StoryPolicy();
