import { mediaService } from './media.service.js';
import { mediaSerializer } from './media.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import { listMediaQuerySchema, getMediaQuerySchema, } from './media.schemas.js';
export class MediaController {
    service;
    serializer;
    constructor(service = mediaService, serializer = mediaSerializer) {
        this.service = service;
        this.serializer = serializer;
    }
    list = async (c) => {
        const rawQuery = c.req.query();
        const query = listMediaQuerySchema.parse(rawQuery);
        const { media, total } = await this.service.list(query);
        const data = media.map((m) => this.serializer.serializeMedia(m));
        return paginated(c, data, {
            page: query.page ?? 1,
            pageSize: query.pageSize ?? 20,
            total,
        });
    };
    get = async (c) => {
        const id = c.req.param('id');
        const rawQuery = c.req.query();
        const query = getMediaQuerySchema.parse(rawQuery);
        const media = await this.service.getById(id, query.include);
        const serialized = this.serializer.serializeMediaDetail(media);
        return ok(c, serialized);
    };
    create = async (c) => {
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const media = await this.service.create(body, { actorId, requestId });
        const serialized = this.serializer.serializeMedia(media);
        return created(c, serialized, `/api/v1/media/${media.mediaId}`);
    };
    update = async (c) => {
        const id = c.req.param('id');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const media = await this.service.update(id, body, { actorId, requestId });
        const serialized = this.serializer.serializeMedia(media);
        return ok(c, serialized);
    };
    delete = async (c) => {
        const user = c.get('user');
        if (user && user.role !== 'ADMIN') {
            throw AppException.forbidden('Only administrators can delete media assets.');
        }
        const id = c.req.param('id');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.delete(id, { actorId, requestId });
        return ok(c, { message: `Media '${id}' successfully deleted.` });
    };
    linkEquipment = async (c) => {
        const mediaId = c.req.param('id');
        const equipmentId = c.req.param('equipmentId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkEquipment(mediaId, equipmentId, body, { actorId, requestId });
        return ok(c, { message: `Equipment '${equipmentId}' linked to media '${mediaId}'.` });
    };
    unlinkEquipment = async (c) => {
        const mediaId = c.req.param('id');
        const equipmentId = c.req.param('equipmentId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkEquipment(mediaId, equipmentId, { actorId, requestId });
        return ok(c, { message: `Equipment '${equipmentId}' unlinked from media '${mediaId}'.` });
    };
}
export const mediaController = new MediaController();
