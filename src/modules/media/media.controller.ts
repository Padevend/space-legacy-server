import type { Context } from 'hono';
import { mediaService, type MediaService } from './media.service.js';
import { mediaSerializer, type MediaSerializer } from './media.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import {
  listMediaQuerySchema,
  getMediaQuerySchema,
  type CreateMediaRequestDto,
  type UpdateMediaRequestDto,
  type LinkMediaEquipmentRequestDto,
} from './media.schemas.js';

export class MediaController {
  constructor(
    private readonly service: MediaService = mediaService,
    private readonly serializer: MediaSerializer = mediaSerializer
  ) {}

  list = async (c: Context): Promise<Response> => {
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

  get = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const rawQuery = c.req.query();
    const query = getMediaQuerySchema.parse(rawQuery);

    const media = await this.service.getById(id, query.include);
    const serialized = this.serializer.serializeMediaDetail(media);

    return ok(c, serialized);
  };

  create = async (c: Context): Promise<Response> => {
    const body = (await c.req.json()) as CreateMediaRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const media = await this.service.create(body, { actorId, requestId });
    const serialized = this.serializer.serializeMedia(media);

    return created(c, serialized, `/api/v1/media/${media.mediaId}`);
  };

  update = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const body = (await c.req.json()) as UpdateMediaRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const media = await this.service.update(id, body, { actorId, requestId });
    const serialized = this.serializer.serializeMedia(media);

    return ok(c, serialized);
  };

  delete = async (c: Context): Promise<Response> => {
    const user = c.get('user');
    if (user && user.role !== 'ADMIN') {
      throw AppException.forbidden('Only administrators can delete media assets.');
    }

    const id = c.req.param('id') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.delete(id, { actorId, requestId });

    return ok(c, { message: `Media '${id}' successfully deleted.` });
  };

  linkEquipment = async (c: Context): Promise<Response> => {
    const mediaId = c.req.param('id') as string;
    const equipmentId = c.req.param('equipmentId') as string;
    const body = (await c.req.json()) as LinkMediaEquipmentRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.linkEquipment(mediaId, equipmentId, body, { actorId, requestId });

    return ok(c, { message: `Equipment '${equipmentId}' linked to media '${mediaId}'.` });
  };

  unlinkEquipment = async (c: Context): Promise<Response> => {
    const mediaId = c.req.param('id') as string;
    const equipmentId = c.req.param('equipmentId') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.unlinkEquipment(mediaId, equipmentId, { actorId, requestId });

    return ok(c, { message: `Equipment '${equipmentId}' unlinked from media '${mediaId}'.` });
  };
}

export const mediaController = new MediaController();
