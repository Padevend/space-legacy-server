import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { MediaService, mediaService } from '../services/media_service.js';
import { MediaSerializer, mediaSerializer } from '../serializers/media_serializer.js';
import {
  type CreateMediaRequestDto,
  type UpdateMediaRequestDto,
  type LinkMediaEquipmentRequestDto,
} from '../validators/media.js';

export class AdminMediaController {
  constructor(
    private readonly service: MediaService = mediaService,
    private readonly serializer: MediaSerializer = mediaSerializer
  ) {}

  store = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as CreateMediaRequestDto;

    const media = await this.service.create(body);
    const serialized = this.serializer.serializeMedia(media);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized, `/api/v1/media/${media.mediaId}`)
      : c.json({ success: true, data: serialized }, 201);
  };

  create = this.store;

  update = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as UpdateMediaRequestDto;

    const updated = await this.service.update(id, body);
    const serialized = this.serializer.serializeMedia(updated);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  destroy = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';

    await this.service.delete(id);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Media deleted successfully.' })
      : c.json({ success: true, data: { message: 'Media deleted successfully.' } }, 200);
  };

  delete = this.destroy;

  // Equipment link
  linkEquipment = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const mediaId = (('params' in ctxOrC && ctxOrC.params['mediaId']) || c.req.param('mediaId')) ?? '';
    const equipmentId = (('params' in ctxOrC && ctxOrC.params['equipmentId']) || c.req.param('equipmentId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkMediaEquipmentRequestDto;

    const link = await this.service.linkEquipment(mediaId, equipmentId, body);
    const serialized = this.serializer.serializeEquipmentMedia(link);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  unlinkEquipment = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const mediaId = (('params' in ctxOrC && ctxOrC.params['mediaId']) || c.req.param('mediaId')) ?? '';
    const equipmentId = (('params' in ctxOrC && ctxOrC.params['equipmentId']) || c.req.param('equipmentId')) ?? '';

    await this.service.unlinkEquipment(mediaId, equipmentId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Equipment unlinked from media successfully.' })
      : c.json({ success: true, data: { message: 'Equipment unlinked from media successfully.' } }, 200);
  };
}

export const adminMediaController = new AdminMediaController();
