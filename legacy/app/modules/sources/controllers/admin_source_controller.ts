import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { SourceService, sourceService } from '../services/source_service.js';
import { SourceSerializer, sourceSerializer } from '../serializers/source_serializer.js';
import { type CreateSourceRequestDto, type UpdateSourceRequestDto, type LinkSourceDto } from '../validators/source.js';

export class AdminSourceController {
  constructor(
    private readonly service: SourceService = sourceService,
    private readonly serializer: SourceSerializer = sourceSerializer
  ) {}

  store = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as CreateSourceRequestDto;

    const createdItem = await this.service.create(body);
    const serialized = this.serializer.serializeSource(createdItem);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized, `/api/v1/sources/${createdItem.sourceId}`)
      : c.json({ success: true, data: serialized }, 201);
  };

  create = this.store;

  update = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as UpdateSourceRequestDto;

    const updated = await this.service.update(id, body);
    const serialized = this.serializer.serializeSource(updated);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  destroy = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';

    await this.service.delete(id);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Source deleted successfully.' })
      : c.json({ success: true, data: { message: 'Source deleted successfully.' } }, 200);
  };

  delete = this.destroy;

  // Equipment links
  linkEquipment = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const equipmentId = (('params' in ctxOrC && ctxOrC.params['equipmentId']) || c.req.param('equipmentId')) ?? '';
    const paramSourceId = (('params' in ctxOrC && ctxOrC.params['sourceId']) || c.req.param('sourceId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkSourceDto;
    if (paramSourceId && !body.sourceId) {
      body.sourceId = paramSourceId;
    }

    const link = await this.service.linkEquipment(equipmentId, body);
    const serialized = this.serializer.serializeSourceLink(link);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  unlinkEquipment = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const equipmentId = (('params' in ctxOrC && ctxOrC.params['equipmentId']) || c.req.param('equipmentId')) ?? '';
    const sourceId = (('params' in ctxOrC && ctxOrC.params['sourceId']) || c.req.param('sourceId')) ?? '';

    await this.service.unlinkEquipment(equipmentId, sourceId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Equipment source unlinked successfully.' })
      : c.json({ success: true, data: { message: 'Equipment source unlinked successfully.' } }, 200);
  };

  // Mission links
  linkMission = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const missionId = (('params' in ctxOrC && ctxOrC.params['missionId']) || c.req.param('missionId')) ?? '';
    const paramSourceId = (('params' in ctxOrC && ctxOrC.params['sourceId']) || c.req.param('sourceId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkSourceDto;
    if (paramSourceId && !body.sourceId) {
      body.sourceId = paramSourceId;
    }

    const link = await this.service.linkMission(missionId, body);
    const serialized = this.serializer.serializeSourceLink(link);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  unlinkMission = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const missionId = (('params' in ctxOrC && ctxOrC.params['missionId']) || c.req.param('missionId')) ?? '';
    const sourceId = (('params' in ctxOrC && ctxOrC.params['sourceId']) || c.req.param('sourceId')) ?? '';

    await this.service.unlinkMission(missionId, sourceId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Mission source unlinked successfully.' })
      : c.json({ success: true, data: { message: 'Mission source unlinked successfully.' } }, 200);
  };

  // Event links
  linkEvent = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const eventId = (('params' in ctxOrC && ctxOrC.params['eventId']) || c.req.param('eventId')) ?? '';
    const paramSourceId = (('params' in ctxOrC && ctxOrC.params['sourceId']) || c.req.param('sourceId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkSourceDto;
    if (paramSourceId && !body.sourceId) {
      body.sourceId = paramSourceId;
    }

    const link = await this.service.linkEvent(eventId, body);
    const serialized = this.serializer.serializeSourceLink(link);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  unlinkEvent = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const eventId = (('params' in ctxOrC && ctxOrC.params['eventId']) || c.req.param('eventId')) ?? '';
    const sourceId = (('params' in ctxOrC && ctxOrC.params['sourceId']) || c.req.param('sourceId')) ?? '';

    await this.service.unlinkEvent(eventId, sourceId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Event source unlinked successfully.' })
      : c.json({ success: true, data: { message: 'Event source unlinked successfully.' } }, 200);
  };
}

export const adminSourceController = new AdminSourceController();
