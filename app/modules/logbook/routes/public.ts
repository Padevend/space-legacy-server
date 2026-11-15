import type { Router } from '#infrastructure/http/router';
import { LogbookController } from '../controllers/logbook_controller.js';

export function registerLogbookPublicRoutes(router: Router): void {
  const r = router.forModule('logbook');

  r.get('/machines/:slug/logbook', [LogbookController, 'index']).as('logbook.public_list');
  r.get('/machines/:slug/logbook/:entry', [LogbookController, 'show']).as('logbook.public_show');
}
