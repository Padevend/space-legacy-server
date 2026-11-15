import type { Router } from '#infrastructure/http/router';
import { AdminSourceController } from '../controllers/admin_source_controller.js';
import { createSourceRequestSchema, updateSourceRequestSchema, linkSourceSchema } from '../validators/source.js';
import { middleware } from '#start/kernel';

export function registerSourcesAdminRoutes(router: Router): void {
  const r = router.forModule('sources');

  r.post('/admin/sources', [AdminSourceController, 'store'])
    .as('admin.sources.store')
    .use(middleware.ability('sources:write'))
    .validate({ body: createSourceRequestSchema })
    .docs({
      summary: 'Create a new bibliographic source',
      tags: ['Sources'],
      responses: { 201: 'Created source', 400: 'BAD_REQUEST' },
    });

  r.put('/admin/sources/:id', [AdminSourceController, 'update'])
    .as('admin.sources.update')
    .use(middleware.ability('sources:write'))
    .validate({ body: updateSourceRequestSchema })
    .docs({
      summary: 'Update an existing source',
      tags: ['Sources'],
      responses: { 200: 'Updated source', 404: 'NOT_FOUND' },
    });

  r.patch('/admin/sources/:id', [AdminSourceController, 'update'])
    .as('admin.sources.patch')
    .use(middleware.ability('sources:write'))
    .validate({ body: updateSourceRequestSchema })
    .docs({
      summary: 'Update an existing source',
      tags: ['Sources'],
      responses: { 200: 'Updated source', 404: 'NOT_FOUND' },
    });

  r.delete('/admin/sources/:id', [AdminSourceController, 'destroy'])
    .as('admin.sources.destroy')
    .use(middleware.ability('sources:delete'))
    .docs({
      summary: 'Delete a source',
      tags: ['Sources'],
      responses: { 200: 'Deleted source', 404: 'NOT_FOUND' },
    });

  // Equipment source relation
  r.post('/admin/equipment/:equipmentId/sources', [AdminSourceController, 'linkEquipment'])
    .as('admin.sources.linkEquipment')
    .use(middleware.ability('sources:write'))
    .validate({ body: linkSourceSchema })
    .docs({ summary: 'Link equipment to source with claim description', tags: ['Sources'] });

  r.put('/admin/equipment/:equipmentId/sources/:sourceId', [AdminSourceController, 'linkEquipment'])
    .as('admin.sources.linkEquipmentPut')
    .use(middleware.ability('sources:write'))
    .docs({ summary: 'Link equipment to source with claim description', tags: ['Sources'] });

  r.delete('/admin/equipment/:equipmentId/sources/:sourceId', [AdminSourceController, 'unlinkEquipment'])
    .as('admin.sources.unlinkEquipment')
    .use(middleware.ability('sources:write'))
    .docs({ summary: 'Unlink equipment from source', tags: ['Sources'] });

  // Mission source relation
  r.post('/admin/missions/:missionId/sources', [AdminSourceController, 'linkMission'])
    .as('admin.sources.linkMission')
    .use(middleware.ability('sources:write'))
    .validate({ body: linkSourceSchema })
    .docs({ summary: 'Link mission to source with claim description', tags: ['Sources'] });

  r.put('/admin/missions/:missionId/sources/:sourceId', [AdminSourceController, 'linkMission'])
    .as('admin.sources.linkMissionPut')
    .use(middleware.ability('sources:write'))
    .docs({ summary: 'Link mission to source with claim description', tags: ['Sources'] });

  r.delete('/admin/missions/:missionId/sources/:sourceId', [AdminSourceController, 'unlinkMission'])
    .as('admin.sources.unlinkMission')
    .use(middleware.ability('sources:write'))
    .docs({ summary: 'Unlink mission from source', tags: ['Sources'] });

  // Event source relation
  r.post('/admin/events/:eventId/sources', [AdminSourceController, 'linkEvent'])
    .as('admin.sources.linkEvent')
    .use(middleware.ability('sources:write'))
    .validate({ body: linkSourceSchema })
    .docs({ summary: 'Link event to source with claim description', tags: ['Sources'] });

  r.put('/admin/events/:eventId/sources/:sourceId', [AdminSourceController, 'linkEvent'])
    .as('admin.sources.linkEventPut')
    .use(middleware.ability('sources:write'))
    .docs({ summary: 'Link event to source with claim description', tags: ['Sources'] });

  r.delete('/admin/events/:eventId/sources/:sourceId', [AdminSourceController, 'unlinkEvent'])
    .as('admin.sources.unlinkEvent')
    .use(middleware.ability('sources:write'))
    .docs({ summary: 'Unlink event from source', tags: ['Sources'] });
}
