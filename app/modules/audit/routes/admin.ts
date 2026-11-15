import type { Router } from '#infrastructure/http/router';
import { AdminAuditController } from '../controllers/admin_audit_controller.js';
import { listAuditLogsQuerySchema } from '../validators/audit_log.js';
import { middleware } from '#start/kernel';

export function registerAuditAdminRoutes(router: Router): void {
  const r = router.forModule('audit');

  r.get('/admin/audit-logs', [AdminAuditController, 'index'])
    .as('admin.auditLogs.index')
    .use(middleware.ability('audit:read'))
    .validate({ query: listAuditLogsQuerySchema })
    .docs({
      summary: 'List system audit logs',
      tags: ['Audit'],
      responses: { 200: 'Paginated audit logs', 403: 'FORBIDDEN' },
    });
}
