import type { Router } from '#infrastructure/http/router';
import { StoryController } from '../controllers/story_controller.js';
import { listPublicStoriesQuerySchema, getStoryQuerySchema, storySchema } from '../validators/story.js';

export function registerStoriesPublicRoutes(router: Router): void {
  const r = router.forModule('stories');

  r.get('/stories', [StoryController, 'index'])
    .as('stories.index')
    .validate({ query: listPublicStoriesQuerySchema })
    .docs({
      summary: 'List published educational stories and articles',
      tags: ['Stories'],
      responses: { 200: 'List of stories' },
    });

  r.get('/stories/:idOrSlug', [StoryController, 'show'])
    .as('stories.show')
    .where('idOrSlug', r.matchers.idOrSlug())
    .validate({ query: getStoryQuerySchema })
    .docs({
      summary:
        'Get single published story by UUID or slug with optional includes (missions, equipments, events, media, sources)',
      tags: ['Stories'],
      responses: { 200: storySchema, 404: 'NOT_FOUND' },
    });
}
