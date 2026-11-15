import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { StoryService, storyService } from '../services/story_service.js';
import { StorySerializer, storySerializer } from '../serializers/story_serializer.js';
import {
  listAdminStoriesQuerySchema,
  getStoryQuerySchema,
  type CreateStoryRequestDto,
  type UpdateStoryRequestDto,
  type StoryTransitionRequestDto,
  type LinkStoryMissionRequestDto,
  type LinkStoryEquipmentRequestDto,
  type LinkStoryEventRequestDto,
  type LinkStorySourceRequestDto,
} from '../validators/story.js';

export class AdminStoryController {
  constructor(
    private readonly service: StoryService = storyService,
    private readonly serializer: StorySerializer = storySerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listAdminStoriesQuerySchema.parse(rawQuery);

    const { stories, total } = await this.service.listAdmin(query);
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

    const item = await this.service.getAdminByIdOrSlug(idOrSlug, query.include);
    const serialized = this.serializer.serializeStoryDetail(item);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  get = this.show;

  store = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as CreateStoryRequestDto;

    const story = await this.service.create(body);
    const serialized = this.serializer.serializeStory(story);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized, `/api/v1/stories/${story.slug}`)
      : c.json({ success: true, data: serialized }, 201);
  };

  create = this.store;

  update = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as UpdateStoryRequestDto;

    const updated = await this.service.update(id, body);
    const serialized = this.serializer.serializeStory(updated);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  transition = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as StoryTransitionRequestDto;

    const updated = await this.service.transition(id, body);
    const serialized = this.serializer.serializeStory(updated);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  destroy = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';

    await this.service.delete(id);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Story deleted successfully.' })
      : c.json({ success: true, data: { message: 'Story deleted successfully.' } }, 200);
  };

  delete = this.destroy;

  // Relations
  linkMission = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const storyId = (('params' in ctxOrC && ctxOrC.params['storyId']) || c.req.param('storyId')) ?? '';
    const missionId = (('params' in ctxOrC && ctxOrC.params['missionId']) || c.req.param('missionId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkStoryMissionRequestDto;

    const link = await this.service.linkMission(storyId, missionId, body);
    const serialized = this.serializer.serializeStoryMission(link);
    const status = c.req.method === 'PUT' ? 200 : 201;

    return 'response' in ctxOrC
      ? status === 200
        ? ctxOrC.response.ok(c, serialized)
        : ctxOrC.response.created(c, serialized)
      : c.json({ success: true, data: serialized }, status as any);
  };

  unlinkMission = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const storyId = (('params' in ctxOrC && ctxOrC.params['storyId']) || c.req.param('storyId')) ?? '';
    const missionId = (('params' in ctxOrC && ctxOrC.params['missionId']) || c.req.param('missionId')) ?? '';

    await this.service.unlinkMission(storyId, missionId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Mission unlinked from story successfully.' })
      : c.json({ success: true, data: { message: 'Mission unlinked from story successfully.' } }, 200);
  };

  linkEquipment = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const storyId = (('params' in ctxOrC && ctxOrC.params['storyId']) || c.req.param('storyId')) ?? '';
    const equipmentId = (('params' in ctxOrC && ctxOrC.params['equipmentId']) || c.req.param('equipmentId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkStoryEquipmentRequestDto;

    const link = await this.service.linkEquipment(storyId, equipmentId, body);
    const serialized = this.serializer.serializeStoryEquipment(link);
    const status = c.req.method === 'PUT' ? 200 : 201;

    return 'response' in ctxOrC
      ? status === 200
        ? ctxOrC.response.ok(c, serialized)
        : ctxOrC.response.created(c, serialized)
      : c.json({ success: true, data: serialized }, status as any);
  };

  unlinkEquipment = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const storyId = (('params' in ctxOrC && ctxOrC.params['storyId']) || c.req.param('storyId')) ?? '';
    const equipmentId = (('params' in ctxOrC && ctxOrC.params['equipmentId']) || c.req.param('equipmentId')) ?? '';

    await this.service.unlinkEquipment(storyId, equipmentId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Equipment unlinked from story successfully.' })
      : c.json({ success: true, data: { message: 'Equipment unlinked from story successfully.' } }, 200);
  };

  linkEvent = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const storyId = (('params' in ctxOrC && ctxOrC.params['storyId']) || c.req.param('storyId')) ?? '';
    const eventId = (('params' in ctxOrC && ctxOrC.params['eventId']) || c.req.param('eventId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkStoryEventRequestDto;

    const link = await this.service.linkEvent(storyId, eventId, body);
    const serialized = this.serializer.serializeStoryEvent(link);
    const status = c.req.method === 'PUT' ? 200 : 201;

    return 'response' in ctxOrC
      ? status === 200
        ? ctxOrC.response.ok(c, serialized)
        : ctxOrC.response.created(c, serialized)
      : c.json({ success: true, data: serialized }, status as any);
  };

  unlinkEvent = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const storyId = (('params' in ctxOrC && ctxOrC.params['storyId']) || c.req.param('storyId')) ?? '';
    const eventId = (('params' in ctxOrC && ctxOrC.params['eventId']) || c.req.param('eventId')) ?? '';

    await this.service.unlinkEvent(storyId, eventId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Event unlinked from story successfully.' })
      : c.json({ success: true, data: { message: 'Event unlinked from story successfully.' } }, 200);
  };

  linkSource = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const storyId = (('params' in ctxOrC && ctxOrC.params['storyId']) || c.req.param('storyId')) ?? '';
    const sourceId = (('params' in ctxOrC && ctxOrC.params['sourceId']) || c.req.param('sourceId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkStorySourceRequestDto;

    const link = await this.service.linkSource(storyId, sourceId, body);
    const serialized = this.serializer.serializeStorySource(link);
    const status = c.req.method === 'PUT' ? 200 : 201;

    return 'response' in ctxOrC
      ? status === 200
        ? ctxOrC.response.ok(c, serialized)
        : ctxOrC.response.created(c, serialized)
      : c.json({ success: true, data: serialized }, status as any);
  };

  unlinkSource = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const storyId = (('params' in ctxOrC && ctxOrC.params['storyId']) || c.req.param('storyId')) ?? '';
    const sourceId = (('params' in ctxOrC && ctxOrC.params['sourceId']) || c.req.param('sourceId')) ?? '';

    await this.service.unlinkSource(storyId, sourceId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Source unlinked from story successfully.' })
      : c.json({ success: true, data: { message: 'Source unlinked from story successfully.' } }, 200);
  };
}

export const adminStoryController = new AdminStoryController();
