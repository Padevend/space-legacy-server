import type { Router } from '#infrastructure/http/router';
import { AdminMediaController } from '../controllers/admin_media_controller.js';
import { createMediaRequestSchema, updateMediaRequestSchema, linkMediaEquipmentSchema } from '../validators/media.js';
import { middleware } from '#start/kernel';

export function registerMediaAdminRoutes(router: Router): void {
  const r = router.forModule('media');

  r.post('/admin/media', [AdminMediaController, 'store'])
    .as('admin.media.store')
    .use(middleware.ability('media:write'))
    .validate({ body: createMediaRequestSchema })
    .docs({
      summary: 'Create a new media asset with provenance metadata',
      tags: ['Media'],
      responses: { 201: 'Created media', 400: 'BAD_REQUEST' },
    });

  r.put('/admin/media/:id', [AdminMediaController, 'update'])
    .as('admin.media.update')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('media:write'))
    .validate({ body: updateMediaRequestSchema })
    .docs({
      summary: 'Update an existing media asset',
      tags: ['Media'],
      responses: { 200: 'Updated media', 404: 'NOT_FOUND' },
    });

  r.patch('/admin/media/:id', [AdminMediaController, 'update'])
    .as('admin.media.patch')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('media:write'))
    .validate({ body: updateMediaRequestSchema })
    .docs({
      summary: 'Update an existing media asset',
      tags: ['Media'],
      responses: { 200: 'Updated media', 404: 'NOT_FOUND' },
    });

  r.delete('/admin/media/:id', [AdminMediaController, 'destroy'])
    .as('admin.media.destroy')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('media:delete'))
    .docs({
      summary: 'Delete a media asset',
      tags: ['Media'],
      responses: { 200: 'Deleted media', 404: 'NOT_FOUND' },
    });

  // Equipment link
  r.post('/admin/media/:mediaId/equipment/:equipmentId', [AdminMediaController, 'linkEquipment'])
    .as('admin.media.linkEquipment')
    .where('mediaId', r.matchers.uuid())
    .where('equipmentId', r.matchers.uuid())
    .use(middleware.ability('media:write'))
    .validate({ body: linkMediaEquipmentSchema })
    .docs({ summary: 'Link equipment to media with representation type', tags: ['Media'] });

  r.put('/admin/media/:mediaId/equipment/:equipmentId', [AdminMediaController, 'linkEquipment'])
    .as('admin.media.linkEquipmentPut')
    .where('mediaId', r.matchers.uuid())
    .where('equipmentId', r.matchers.uuid())
    .use(middleware.ability('media:write'))
    .validate({ body: linkMediaEquipmentSchema })
    .docs({ summary: 'Link equipment to media with representation type', tags: ['Media'] });

  r.delete('/admin/media/:mediaId/equipment/:equipmentId', [AdminMediaController, 'unlinkEquipment'])
    .as('admin.media.unlinkEquipment')
    .where('mediaId', r.matchers.uuid())
    .where('equipmentId', r.matchers.uuid())
    .use(middleware.ability('media:write'))
    .docs({ summary: 'Unlink equipment from media', tags: ['Media'] });
}
