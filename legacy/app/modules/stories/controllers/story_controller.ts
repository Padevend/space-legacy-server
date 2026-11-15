import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { StoryService, storyService } from '../services/story_service.js';
import { StorySerializer, storySerializer } from '../serializers/story_serializer.js';
import { listPublicStoriesQuerySchema, getStoryQuerySchema } from '../validators/story.js';

export class StoryController {
  constructor(
    private readonly service: StoryService = storyService,
    private readonly serializer: StorySerializer = storySerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listPublicStoriesQuerySchema.parse(rawQuery);

    const { stories, total } = await this.service.listPublic(query);
    const data = stories.map((s) => this.serializer.serializeStory(s));

    return 'response' in ctxOrC
      ? ctxOrC.response.paginated(c, data, {
          page: query.page ?? 1,
          pageSize: query.pageSize ?? 20,
          total,
        })
      : c.json(
          {
            success: true,
            data,
            meta: { page: query.page ?? 1, pageSize: query.pageSize ?? 20, total },
          },
          200
        );
  };

  list = this.index;

  show = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const idOrSlug =
      (('params' in ctxOrC && ctxOrC.params['idOrSlug']) || c.req.param('idOrSlug') || c.req.param('id')) ?? '';
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = getStoryQuerySchema.parse(rawQuery);

    const item = await this.service.getPublicByIdOrSlug(idOrSlug, query.include);
    const serialized = this.serializer.serializeStoryDetail(item);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  get = this.show;
}

export const storyController = new StoryController();
