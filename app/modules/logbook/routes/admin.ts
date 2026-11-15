import type { Router } from '#infrastructure/http/router';
import { AdminLogbookController } from '../controllers/admin_logbook_controller.js';
import {
  logbookIdParamSchema,
  listAdminLogbookQuerySchema,
  createLogbookEntrySchema,
  updateLogbookEntrySchema,
} from '../validators/logbook_entry.js';

export function registerLogbookAdminRoutes(router: Router): void {
  const r = router.forModule('logbook');

  r.get('/logbook', [AdminLogbookController, 'index'])
    .as('admin.logbook.index')
    .validate({ query: listAdminLogbookQuerySchema })
    .docs({ summary: 'List all logbook entries for administration', tags: ['Admin', 'Logbook'] });

  r.post('/logbook', [AdminLogbookController, 'store'])
    .as('admin.logbook.store')
    .validate({ body: createLogbookEntrySchema })
    .docs({ summary: 'Create new logbook entry for a machine', tags: ['Admin', 'Logbook'] });

  r.get('/logbook/:id', [AdminLogbookController, 'show'])
    .as('admin.logbook.show')
    .validate({ params: logbookIdParamSchema })
    .docs({ summary: 'Get single logbook entry by UUID', tags: ['Admin', 'Logbook'] });

  r.patch('/logbook/:id', [AdminLogbookController, 'update'])
    .as('admin.logbook.update')
    .validate({ params: logbookIdParamSchema, body: updateLogbookEntrySchema })
    .docs({ summary: 'Targeted partial PATCH update of a logbook entry', tags: ['Admin', 'Logbook'] });

  r.delete('/logbook/:id', [AdminLogbookController, 'destroy'])
    .as('admin.logbook.destroy')
    .validate({ params: logbookIdParamSchema })
    .docs({ summary: 'Delete a logbook entry', tags: ['Admin', 'Logbook'] });
}
