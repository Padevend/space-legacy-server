import type { Router } from '#infrastructure/http/router';
import { DashboardController } from '../controllers/dashboard_controller.js';
import { dashboardStatsSchema } from '../validators/dashboard.js';
import { middleware } from '#start/kernel';

export function registerDashboardAdminRoutes(router: Router): void {
  const r = router.forModule('dashboard');

  r.get('/admin/dashboard', [DashboardController, 'stats'])
    .as('admin.dashboard.stats')
    .use(middleware.ability('admin:access'))
    .docs({
      summary: 'Back-office dashboard aggregate counters and editorial metrics',
      tags: ['Dashboard'],
      responses: { 200: dashboardStatsSchema },
    });
}
