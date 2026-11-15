import type { Router } from '#infrastructure/http/router';
import { SourceController } from '../controllers/source_controller.js';
import { listSourcesQuerySchema, sourceSchema } from '../validators/source.js';

export function registerSourcesPublicRoutes(router: Router): void {
  const r = router.forModule('sources');

  r.get('/sources', [SourceController, 'index'])
    .as('sources.index')
    .validate({ query: listSourcesQuerySchema })
    .docs({
      summary: 'List bibliographic reference sources',
      tags: ['Sources'],
      responses: { 200: 'List of sources' },
    });

  r.get('/sources/:id', [SourceController, 'show'])
    .as('sources.show')
    .docs({
      summary: 'Get a source by UUID',
      tags: ['Sources'],
      responses: { 200: sourceSchema, 404: 'NOT_FOUND' },
    });
}
