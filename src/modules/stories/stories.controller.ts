import type { Context } from 'hono';
import { storiesService, type StoriesService } from './stories.service.js';
import { storiesSerializer, type StoriesSerializer } from './stories.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import {
  listPublicStoriesQuerySchema,
  listAdminStoriesQuerySchema,
  getStoryQuerySchema,
  type CreateStoryRequestDto,
  type UpdateStoryRequestDto,
  type StoryTransitionRequestDto,
  type LinkStoryMissionRequestDto,
  type LinkStoryEquipmentRequestDto,
  type LinkStoryEventRequestDto,
  type LinkStoryMediaRequestDto,
  type LinkStorySourceRequestDto,
} from './stories.schemas.js';

export class StoriesController {
  constructor(
    private readonly service: StoriesService = storiesService,
    private readonly serializer: StoriesSerializer = storiesSerializer
  ) {}

  listPublic = async (c: Context): Promise<Response> => {
    const rawQuery = c.req.query();
    const query = listPublicStoriesQuerySchema.parse(rawQuery);

    const { stories, total } = await this.service.listPublic(query);
    const data = stories.map((s) => this.serializer.serializeStory(s));

    return paginated(c, data, {
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
      total,
    });
  };

  getPublic = async (c: Context): Promise<Response> => {
    const idOrSlug = c.req.param('idOrSlug') as string;
    const rawQuery = c.req.query();
    const query = getStoryQuerySchema.parse(rawQuery);

    const story = await this.service.getPublicByIdOrSlug(idOrSlug, query.include);
    const serialized = this.serializer.serializeStoryDetail(story);

    return ok(c, serialized);
  };

  listAdmin = async (c: Context): Promise<Response> => {
    const rawQuery = c.req.query();
    const query = listAdminStoriesQuerySchema.parse(rawQuery);

    const { stories, total } = await this.service.listAdmin(query);
    const data = stories.map((s) => this.serializer.serializeStory(s));

    return paginated(c, data, {
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
      total,
    });
  };

  getAdmin = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const rawQuery = c.req.query();
    const query = getStoryQuerySchema.parse(rawQuery);

    const story = await this.service.getAdminByIdOrSlug(id, query.include);
    const serialized = this.serializer.serializeStoryDetail(story);

    return ok(c, serialized);
  };

  create = async (c: Context): Promise<Response> => {
    const body = (await c.req.json()) as CreateStoryRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const story = await this.service.create(body, { actorId, requestId });
    const serialized = this.serializer.serializeStory(story);

    return created(c, serialized, `/api/v1/stories/${story.slug}`);
  };

  update = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const body = (await c.req.json()) as UpdateStoryRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const story = await this.service.update(id, body, { actorId, requestId });
    const serialized = this.serializer.serializeStory(story);

    return ok(c, serialized);
  };

  transition = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const body = (await c.req.json()) as StoryTransitionRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const story = await this.service.transition(id, body, { actorId, requestId });
    const serialized = this.serializer.serializeStory(story);

    return ok(c, serialized);
  };

  delete = async (c: Context): Promise<Response> => {
    const user = c.get('user');
    if (user && user.role !== 'ADMIN') {
      throw AppException.forbidden('Only administrators can delete editorial stories.');
    }

    const id = c.req.param('id') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.delete(id, { actorId, requestId });

    return ok(c, { message: `Story '${id}' successfully deleted.` });
  };

  // Relations
  linkMission = async (c: Context): Promise<Response> => {
    const storyId = c.req.param('id') as string;
    const missionId = c.req.param('missionId') as string;
    const body = (await c.req.json()) as LinkStoryMissionRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.linkMission(storyId, missionId, body, { actorId, requestId });
    return ok(c, { message: `Mission '${missionId}' linked to story '${storyId}'.` });
  };

  unlinkMission = async (c: Context): Promise<Response> => {
    const storyId = c.req.param('id') as string;
    const missionId = c.req.param('missionId') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.unlinkMission(storyId, missionId, { actorId, requestId });
    return ok(c, { message: `Mission '${missionId}' unlinked from story '${storyId}'.` });
  };

  linkEquipment = async (c: Context): Promise<Response> => {
    const storyId = c.req.param('id') as string;
    const equipmentId = c.req.param('equipmentId') as string;
    const body = (await c.req.json()) as LinkStoryEquipmentRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.linkEquipment(storyId, equipmentId, body, { actorId, requestId });
    return ok(c, { message: `Equipment '${equipmentId}' linked to story '${storyId}'.` });
  };

  unlinkEquipment = async (c: Context): Promise<Response> => {
    const storyId = c.req.param('id') as string;
    const equipmentId = c.req.param('equipmentId') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.unlinkEquipment(storyId, equipmentId, { actorId, requestId });
    return ok(c, { message: `Equipment '${equipmentId}' unlinked from story '${storyId}'.` });
  };

  linkEvent = async (c: Context): Promise<Response> => {
    const storyId = c.req.param('id') as string;
    const eventId = c.req.param('eventId') as string;
    const body = (await c.req.json()) as LinkStoryEventRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.linkEvent(storyId, eventId, body, { actorId, requestId });
    return ok(c, { message: `Event '${eventId}' linked to story '${storyId}'.` });
  };

  unlinkEvent = async (c: Context): Promise<Response> => {
    const storyId = c.req.param('id') as string;
    const eventId = c.req.param('eventId') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.unlinkEvent(storyId, eventId, { actorId, requestId });
    return ok(c, { message: `Event '${eventId}' unlinked from story '${storyId}'.` });
  };

  linkMedia = async (c: Context): Promise<Response> => {
    const storyId = c.req.param('id') as string;
    const mediaId = c.req.param('mediaId') as string;
    const body = (await c.req.json()) as LinkStoryMediaRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.linkMedia(storyId, mediaId, body, { actorId, requestId });
    return ok(c, { message: `Media '${mediaId}' linked to story '${storyId}'.` });
  };

  unlinkMedia = async (c: Context): Promise<Response> => {
    const storyId = c.req.param('id') as string;
    const mediaId = c.req.param('mediaId') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.unlinkMedia(storyId, mediaId, { actorId, requestId });
    return ok(c, { message: `Media '${mediaId}' unlinked from story '${storyId}'.` });
  };

  linkSource = async (c: Context): Promise<Response> => {
    const storyId = c.req.param('id') as string;
    const sourceId = c.req.param('sourceId') as string;
    const body = (await c.req.json()) as LinkStorySourceRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.linkSource(storyId, sourceId, body, { actorId, requestId });
    return ok(c, { message: `Source '${sourceId}' linked to story '${storyId}'.` });
  };

  unlinkSource = async (c: Context): Promise<Response> => {
    const storyId = c.req.param('id') as string;
    const sourceId = c.req.param('sourceId') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.unlinkSource(storyId, sourceId, { actorId, requestId });
    return ok(c, { message: `Source '${sourceId}' unlinked from story '${storyId}'.` });
  };
}

export const storiesController = new StoriesController();
