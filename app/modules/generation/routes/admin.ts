import type { Router } from '#infrastructure/http/router';
import { AdminGenerationController } from '../controllers/admin_generation_controller.js';
import {
  createGenerationJobSchema,
  generationJobIdParamSchema,
  listGenerationJobsQuerySchema,
} from '../validators/generation.js';

export function registerGenerationAdminRoutes(router: Router): void {
  const r = router.forModule('generation');

  r.get('/generation/jobs', [AdminGenerationController, 'index'])
    .as('admin.generation.jobs.index')
    .validate({ query: listGenerationJobsQuerySchema })
    .docs({ summary: 'List asynchronous generation jobs', tags: ['Admin', 'Generation'] });

  r.post('/generation/jobs', [AdminGenerationController, 'create'])
    .as('admin.generation.jobs.create')
    .validate({ body: createGenerationJobSchema })
    .docs({ summary: 'Submit an article or video generation job', tags: ['Admin', 'Generation'] });

  r.get('/generation/jobs/:id', [AdminGenerationController, 'show'])
    .as('admin.generation.jobs.show')
    .validate({ params: generationJobIdParamSchema })
    .docs({ summary: 'Get generation job status and result', tags: ['Admin', 'Generation'] });

  r.post('/generation/jobs/:id/poll', [AdminGenerationController, 'poll'])
    .as('admin.generation.jobs.poll')
    .validate({ params: generationJobIdParamSchema })
    .docs({ summary: 'Poll and synchronize external generation job status', tags: ['Admin', 'Generation'] });

  r.post('/generation/jobs/:id/cancel', [AdminGenerationController, 'cancel'])
    .as('admin.generation.jobs.cancel')
    .validate({ params: generationJobIdParamSchema })
    .docs({ summary: 'Cancel a pending or running generation job', tags: ['Admin', 'Generation'] });
}
