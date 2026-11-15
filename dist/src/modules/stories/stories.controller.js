import { storiesService } from './stories.service.js';
import { storiesSerializer } from './stories.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import { listPublicStoriesQuerySchema, listAdminStoriesQuerySchema, getStoryQuerySchema, } from './stories.schemas.js';
export class StoriesController {
    service;
    serializer;
    constructor(service = storiesService, serializer = storiesSerializer) {
        this.service = service;
        this.serializer = serializer;
    }
    listPublic = async (c) => {
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
    getPublic = async (c) => {
        const idOrSlug = c.req.param('idOrSlug');
        const rawQuery = c.req.query();
        const query = getStoryQuerySchema.parse(rawQuery);
        const story = await this.service.getPublicByIdOrSlug(idOrSlug, query.include);
        const serialized = this.serializer.serializeStoryDetail(story);
        return ok(c, serialized);
    };
    listAdmin = async (c) => {
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
    getAdmin = async (c) => {
        const id = c.req.param('id');
        const rawQuery = c.req.query();
        const query = getStoryQuerySchema.parse(rawQuery);
        const story = await this.service.getAdminByIdOrSlug(id, query.include);
        const serialized = this.serializer.serializeStoryDetail(story);
        return ok(c, serialized);
    };
    create = async (c) => {
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const story = await this.service.create(body, { actorId, requestId });
        const serialized = this.serializer.serializeStory(story);
        return created(c, serialized, `/api/v1/stories/${story.slug}`);
    };
    update = async (c) => {
        const id = c.req.param('id');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const story = await this.service.update(id, body, { actorId, requestId });
        const serialized = this.serializer.serializeStory(story);
        return ok(c, serialized);
    };
    transition = async (c) => {
        const id = c.req.param('id');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const story = await this.service.transition(id, body, { actorId, requestId });
        const serialized = this.serializer.serializeStory(story);
        return ok(c, serialized);
    };
    delete = async (c) => {
        const user = c.get('user');
        if (user && user.role !== 'ADMIN') {
            throw AppException.forbidden('Only administrators can delete editorial stories.');
        }
        const id = c.req.param('id');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.delete(id, { actorId, requestId });
        return ok(c, { message: `Story '${id}' successfully deleted.` });
    };
    // Relations
    linkMission = async (c) => {
        const storyId = c.req.param('id');
        const missionId = c.req.param('missionId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkMission(storyId, missionId, body, { actorId, requestId });
        return ok(c, { message: `Mission '${missionId}' linked to story '${storyId}'.` });
    };
    unlinkMission = async (c) => {
        const storyId = c.req.param('id');
        const missionId = c.req.param('missionId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkMission(storyId, missionId, { actorId, requestId });
        return ok(c, { message: `Mission '${missionId}' unlinked from story '${storyId}'.` });
    };
    linkEquipment = async (c) => {
        const storyId = c.req.param('id');
        const equipmentId = c.req.param('equipmentId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkEquipment(storyId, equipmentId, body, { actorId, requestId });
        return ok(c, { message: `Equipment '${equipmentId}' linked to story '${storyId}'.` });
    };
    unlinkEquipment = async (c) => {
        const storyId = c.req.param('id');
        const equipmentId = c.req.param('equipmentId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkEquipment(storyId, equipmentId, { actorId, requestId });
        return ok(c, { message: `Equipment '${equipmentId}' unlinked from story '${storyId}'.` });
    };
    linkEvent = async (c) => {
        const storyId = c.req.param('id');
        const eventId = c.req.param('eventId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkEvent(storyId, eventId, body, { actorId, requestId });
        return ok(c, { message: `Event '${eventId}' linked to story '${storyId}'.` });
    };
    unlinkEvent = async (c) => {
        const storyId = c.req.param('id');
        const eventId = c.req.param('eventId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkEvent(storyId, eventId, { actorId, requestId });
        return ok(c, { message: `Event '${eventId}' unlinked from story '${storyId}'.` });
    };
    linkMedia = async (c) => {
        const storyId = c.req.param('id');
        const mediaId = c.req.param('mediaId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkMedia(storyId, mediaId, body, { actorId, requestId });
        return ok(c, { message: `Media '${mediaId}' linked to story '${storyId}'.` });
    };
    unlinkMedia = async (c) => {
        const storyId = c.req.param('id');
        const mediaId = c.req.param('mediaId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkMedia(storyId, mediaId, { actorId, requestId });
        return ok(c, { message: `Media '${mediaId}' unlinked from story '${storyId}'.` });
    };
    linkSource = async (c) => {
        const storyId = c.req.param('id');
        const sourceId = c.req.param('sourceId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkSource(storyId, sourceId, body, { actorId, requestId });
        return ok(c, { message: `Source '${sourceId}' linked to story '${storyId}'.` });
    };
    unlinkSource = async (c) => {
        const storyId = c.req.param('id');
        const sourceId = c.req.param('sourceId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkSource(storyId, sourceId, { actorId, requestId });
        return ok(c, { message: `Source '${sourceId}' unlinked from story '${storyId}'.` });
    };
}
export const storiesController = new StoriesController();
