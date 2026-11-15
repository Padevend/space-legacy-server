import type { Router } from '#infrastructure/http/router';
import { DashboardController } from '../controllers/dashboard_controller.js';

export function registerDashboardUiRoute(router: Router): void {
  const r = router.forModule('dashboard');

  r.get('/admin', [DashboardController, 'serveUi'])
    .as('admin.ui')
    .docs({
      summary: 'Admin mission control back-office frontend single-page application',
      tags: ['Admin', 'Dashboard'],
    });
}

export function registerDashboardAdminRoutes(router: Router): void {
  const r = router.forModule('dashboard');

  r.get('/overview', [DashboardController, 'overview'])
    .as('admin.overview')
    .docs({
      summary: 'Back-office administration overview counters and metrics',
      tags: ['Admin', 'Dashboard'],
    });
}
