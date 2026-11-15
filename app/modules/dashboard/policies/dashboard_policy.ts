import type { UserRole } from '#shared/enums';

export class DashboardPolicy {
  canView(role?: UserRole): boolean {
    return role === 'ADMIN' || role === 'EDITOR';
  }
}

export const dashboardPolicy = new DashboardPolicy();
