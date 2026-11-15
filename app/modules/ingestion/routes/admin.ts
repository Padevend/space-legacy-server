import type { Router } from '#infrastructure/http/router';
import { AdminIngestionController } from '../controllers/admin_ingestion_controller.js';
import { listIngestionRunsQuerySchema, triggerIngestRequestSchema } from '../validators/ingestion.js';
import { middleware } from '#start/kernel';

export function registerIngestionAdminRoutes(router: Router): void {
  const r = router.forModule('ingestion');

  r.get('/admin/ingest/runs', [AdminIngestionController, 'index'])
    .as('admin.ingest.runs.index')
    .use(middleware.ability('admin:access'))
    .validate({ query: listIngestionRunsQuerySchema })
    .docs({ summary: 'List data ingestion runs', tags: ['Ingestion'] });

  r.get('/admin/ingest/runs/:id', [AdminIngestionController, 'show'])
    .as('admin.ingest.runs.show')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('admin:access'))
    .docs({ summary: 'Get single data ingestion run details', tags: ['Ingestion'] });

  r.post('/admin/ingest', [AdminIngestionController, 'trigger'])
    .as('admin.ingest.trigger')
    .use(middleware.ability('ingestion:run'))
    .validate({ body: triggerIngestRequestSchema })
    .docs({ summary: 'Trigger bulk bundle ingestion into PostgreSQL', tags: ['Ingestion'] });
}
