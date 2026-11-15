import type { Router } from '#infrastructure/http/router';
import { AdminStoryController } from '../controllers/admin_story_controller.js';
import {
  listAdminStoriesQuerySchema,
  getStoryQuerySchema,
  createStoryRequestSchema,
  updateStoryRequestSchema,
  storyTransitionRequestSchema,
  linkStoryMissionSchema,
  linkStoryEquipmentSchema,
  linkStoryEventSchema,
  linkStorySourceSchema,
} from '../validators/story.js';
import { middleware } from '#start/kernel';

export function registerStoriesAdminRoutes(router: Router): void {
  const r = router.forModule('stories');

  r.get('/admin/stories', [AdminStoryController, 'index'])
    .as('admin.stories.index')
    .use(middleware.ability('stories:write'))
    .validate({ query: listAdminStoriesQuerySchema })
    .docs({ summary: 'List all stories across all publication states', tags: ['Stories'] });

  r.get('/admin/stories/:idOrSlug', [AdminStoryController, 'show'])
    .as('admin.stories.show')
    .where('idOrSlug', r.matchers.idOrSlug())
    .use(middleware.ability('stories:write'))
    .validate({ query: getStoryQuerySchema })
    .docs({ summary: 'Get single story by UUID or slug regardless of publication state', tags: ['Stories'] });

  r.post('/admin/stories', [AdminStoryController, 'store'])
    .as('admin.stories.store')
    .use(middleware.ability('stories:write'))
    .validate({ body: createStoryRequestSchema })
    .docs({
      summary: 'Create a new draft story',
      tags: ['Stories'],
      responses: { 201: 'Created story', 409: 'CONFLICT' },
    });

  r.put('/admin/stories/:id', [AdminStoryController, 'update'])
    .as('admin.stories.update')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('stories:write'))
    .validate({ body: updateStoryRequestSchema })
    .docs({
      summary: 'Update an existing story',
      tags: ['Stories'],
      responses: { 200: 'Updated story', 404: 'NOT_FOUND' },
    });

  r.post('/admin/stories/:id/transition', [AdminStoryController, 'transition'])
    .as('admin.stories.transition')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('stories:publish'))
    .validate({ body: storyTransitionRequestSchema })
    .docs({
      summary: 'Transition story publication state (DRAFT -> REVIEW -> PUBLISHED / ARCHIVED)',
      tags: ['Stories'],
      responses: { 200: 'Transitioned story', 409: 'CONFLICT' },
    });

  r.post('/admin/stories/:id/transitions', [AdminStoryController, 'transition'])
    .as('admin.stories.transitions')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('stories:publish'))
    .validate({ body: storyTransitionRequestSchema })
    .docs({
      summary: 'Transition story publication state (DRAFT -> REVIEW -> PUBLISHED / ARCHIVED)',
      tags: ['Stories'],
      responses: { 200: 'Transitioned story', 409: 'CONFLICT' },
    });

  r.delete('/admin/stories/:id', [AdminStoryController, 'destroy'])
    .as('admin.stories.destroy')
    .where('id', r.matchers.uuid())
    .use(middleware.ability('stories:delete'))
    .docs({
      summary: 'Delete a story',
      tags: ['Stories'],
      responses: { 200: 'Deleted story', 404: 'NOT_FOUND' },
    });

  // Relations
  r.post('/admin/stories/:storyId/missions/:missionId', [AdminStoryController, 'linkMission'])
    .as('admin.stories.linkMission')
    .where('storyId', r.matchers.uuid())
    .where('missionId', r.matchers.uuid())
    .use(middleware.ability('stories:write'))
    .validate({ body: linkStoryMissionSchema })
    .docs({ summary: 'Link mission to story', tags: ['Stories'] });

  r.put('/admin/stories/:storyId/missions/:missionId', [AdminStoryController, 'linkMission'])
    .as('admin.stories.linkMissionPut')
    .where('storyId', r.matchers.uuid())
    .where('missionId', r.matchers.uuid())
    .use(middleware.ability('stories:write'))
    .validate({ body: linkStoryMissionSchema })
    .docs({ summary: 'Link mission to story', tags: ['Stories'] });

  r.delete('/admin/stories/:storyId/missions/:missionId', [AdminStoryController, 'unlinkMission'])
    .as('admin.stories.unlinkMission')
    .where('storyId', r.matchers.uuid())
    .where('missionId', r.matchers.uuid())
    .use(middleware.ability('stories:write'))
    .docs({ summary: 'Unlink mission from story', tags: ['Stories'] });

  r.post('/admin/stories/:storyId/equipment/:equipmentId', [AdminStoryController, 'linkEquipment'])
    .as('admin.stories.linkEquipment')
    .where('storyId', r.matchers.uuid())
    .where('equipmentId', r.matchers.uuid())
    .use(middleware.ability('stories:write'))
    .validate({ body: linkStoryEquipmentSchema })
    .docs({ summary: 'Link equipment to story with narrative role', tags: ['Stories'] });

  r.put('/admin/stories/:storyId/equipment/:equipmentId', [AdminStoryController, 'linkEquipment'])
    .as('admin.stories.linkEquipmentPut')
    .where('storyId', r.matchers.uuid())
    .where('equipmentId', r.matchers.uuid())
    .use(middleware.ability('stories:write'))
    .validate({ body: linkStoryEquipmentSchema })
    .docs({ summary: 'Link equipment to story with narrative role', tags: ['Stories'] });

  r.delete('/admin/stories/:storyId/equipment/:equipmentId', [AdminStoryController, 'unlinkEquipment'])
    .as('admin.stories.unlinkEquipment')
    .where('storyId', r.matchers.uuid())
    .where('equipmentId', r.matchers.uuid())
    .use(middleware.ability('stories:write'))
    .docs({ summary: 'Unlink equipment from story', tags: ['Stories'] });

  r.post('/admin/stories/:storyId/events/:eventId', [AdminStoryController, 'linkEvent'])
    .as('admin.stories.linkEvent')
    .where('storyId', r.matchers.uuid())
    .where('eventId', r.matchers.uuid())
    .use(middleware.ability('stories:write'))
    .validate({ body: linkStoryEventSchema })
    .docs({ summary: 'Link event to story', tags: ['Stories'] });

  r.put('/admin/stories/:storyId/events/:eventId', [AdminStoryController, 'linkEvent'])
    .as('admin.stories.linkEventPut')
    .where('storyId', r.matchers.uuid())
    .where('eventId', r.matchers.uuid())
    .use(middleware.ability('stories:write'))
    .validate({ body: linkStoryEventSchema })
    .docs({ summary: 'Link event to story', tags: ['Stories'] });

  r.delete('/admin/stories/:storyId/events/:eventId', [AdminStoryController, 'unlinkEvent'])
    .as('admin.stories.unlinkEvent')
    .where('storyId', r.matchers.uuid())
    .where('eventId', r.matchers.uuid())
    .use(middleware.ability('stories:write'))
    .docs({ summary: 'Unlink event from story', tags: ['Stories'] });

  r.post('/admin/stories/:storyId/sources/:sourceId', [AdminStoryController, 'linkSource'])
    .as('admin.stories.linkSource')
    .where('storyId', r.matchers.uuid())
    .where('sourceId', r.matchers.uuid())
    .use(middleware.ability('stories:write'))
    .validate({ body: linkStorySourceSchema })
    .docs({ summary: 'Link source to story with claim citation', tags: ['Stories'] });

  r.put('/admin/stories/:storyId/sources/:sourceId', [AdminStoryController, 'linkSource'])
    .as('admin.stories.linkSourcePut')
    .where('storyId', r.matchers.uuid())
    .where('sourceId', r.matchers.uuid())
    .use(middleware.ability('stories:write'))
    .validate({ body: linkStorySourceSchema })
    .docs({ summary: 'Link source to story with claim citation', tags: ['Stories'] });

  r.delete('/admin/stories/:storyId/sources/:sourceId', [AdminStoryController, 'unlinkSource'])
    .as('admin.stories.unlinkSource')
    .where('storyId', r.matchers.uuid())
    .where('sourceId', r.matchers.uuid())
    .use(middleware.ability('stories:write'))
    .docs({ summary: 'Unlink source from story', tags: ['Stories'] });
}
