import type { Router } from '#infrastructure/http/router';
import { DashboardController } from '../controllers/dashboard_controller.js';

export function registerDashboardAdminRoutes(router: Router): void {
  const r = router.forModule('dashboard');

  r.get('/overview', [DashboardController, 'overview'])
    .as('admin.overview')
    .docs({
      summary: 'Back-office administration overview counters and metrics',
      tags: ['Admin', 'Dashboard'],
    });
}
