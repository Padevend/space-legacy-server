import type { UserRole } from '#shared/enums';

export type Permission =
  | 'admin:access'
  | 'users:manage'
  | 'audit:read'
  | 'ingestion:run'
  | 'equipment:write'
  | 'equipment:delete'
  | 'missions:write'
  | 'missions:delete'
  | 'events:write'
  | 'events:delete'
  | 'stories:write'
  | 'stories:publish'
  | 'stories:delete'
  | 'media:write'
  | 'media:delete'
  | 'sources:write'
  | 'sources:delete'
  | 'locations:write'
  | 'locations:delete'
  | 'people:write'
  | 'people:delete'
  | 'celestial_bodies:write'
  | 'celestial_bodies:delete'
  | 'measurements:write'
  | 'measurements:delete';

export const rolePermissions: Record<UserRole, readonly Permission[]> = {
  ADMIN: [
    'admin:access',
    'users:manage',
    'audit:read',
    'ingestion:run',
    'equipment:write',
    'equipment:delete',
    'missions:write',
    'missions:delete',
    'events:write',
    'events:delete',
    'stories:write',
    'stories:publish',
    'stories:delete',
    'media:write',
    'media:delete',
    'sources:write',
    'sources:delete',
    'locations:write',
    'locations:delete',
    'people:write',
    'people:delete',
    'celestial_bodies:write',
    'celestial_bodies:delete',
    'measurements:write',
    'measurements:delete',
  ],
  USER: [],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowed = rolePermissions[role];
  return allowed ? allowed.includes(permission) : false;
}
