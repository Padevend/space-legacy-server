import type { Router } from '#infrastructure/http/router';
import { MediaController } from '../controllers/media_controller.js';
import { listMediaQuerySchema, getMediaQuerySchema, mediaSchema } from '../validators/media.js';

export function registerMediaPublicRoutes(router: Router): void {
  const r = router.forModule('media');

  r.get('/media', [MediaController, 'index'])
    .as('media.index')
    .validate({ query: listMediaQuerySchema })
    .docs({
      summary: 'List visual and audio media assets with filtering and pagination',
      tags: ['Media'],
      responses: { 200: 'List of media' },
    });

  r.get('/media/:id', [MediaController, 'show'])
    .as('media.show')
    .where('id', r.matchers.uuid())
    .validate({ query: getMediaQuerySchema })
    .docs({
      summary: 'Get single media asset by UUID with optional includes (equipments, stories)',
      tags: ['Media'],
      responses: { 200: mediaSchema, 404: 'NOT_FOUND' },
    });
}
