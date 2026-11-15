import type { Router } from '#infrastructure/http/router';
import { AdminIngestionController } from '../controllers/admin_ingestion_controller.js';
import { ingestionBatchIdParamSchema } from '../validators/ingestion.js';
import { bodyLimitMiddleware } from '#middleware/body_limit_middleware';
import { ingestionConfig } from '#config/ingestion';

export function registerIngestionAdminRoutes(router: Router): void {
  const r = router.forModule('ingestion');

  r.get('/ingestion/spec', [AdminIngestionController, 'spec'])
    .as('admin.ingestion.spec')
    .docs({ summary: 'Get ingestion bundle specification and limits', tags: ['Admin', 'Ingestion'] });

  r.get('/ingestion/template.zip', [AdminIngestionController, 'template'])
    .as('admin.ingestion.template')
    .docs({ summary: 'Download valid template ZIP bundle', tags: ['Admin', 'Ingestion'] });

  r.post('/ingestion/validate', [AdminIngestionController, 'validate'])
    .as('admin.ingestion.validate')
    .use(bodyLimitMiddleware(ingestionConfig.maxArchiveBytes))
    .docs({ summary: 'Dry-run validation of a ZIP bundle without database mutation', tags: ['Admin', 'Ingestion'] });

  r.post('/ingestion', [AdminIngestionController, 'importBundle'])
    .as('admin.ingestion.import')
    .use(bodyLimitMiddleware(ingestionConfig.maxArchiveBytes))
    .docs({ summary: 'Validate and import a ZIP bundle atomically into database', tags: ['Admin', 'Ingestion'] });

  r.get('/ingestion/:id', [AdminIngestionController, 'show'])
    .as('admin.ingestion.show')
    .validate({ params: ingestionBatchIdParamSchema })
    .docs({ summary: 'Get ingestion batch status and report', tags: ['Admin', 'Ingestion'] });
}
