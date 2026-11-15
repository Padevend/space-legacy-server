import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { ArchiveService, archiveService } from '../services/archive_service.js';
import { ArchiveSerializer, archiveSerializer } from '../serializers/archive_serializer.js';
import {
  listArchivesQuerySchema,
  type CreateArchiveRequestDto,
  type LinkArchiveMissionRequestDto,
  type LinkArchiveEquipmentRequestDto,
  type LinkArchiveEventRequestDto,
  type LinkArchiveSourceRequestDto,
} from '../validators/archive.js';

export class AdminArchiveController {
  constructor(
    private readonly service: ArchiveService = archiveService,
    private readonly serializer: ArchiveSerializer = archiveSerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listArchivesQuerySchema.parse(rawQuery);

    const { archives, total } = await this.service.list(query);
    const data = archives.map((a) => this.serializer.serializeArchive(a));

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
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';

    const item = await this.service.getById(id);
    const serialized = this.serializer.serializeArchive(item);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  get = this.show;

  store = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as CreateArchiveRequestDto;

    const archive = await this.service.create(body);
    const serialized = this.serializer.serializeArchive(archive);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized, `/api/v1/admin/archives/${archive.archiveId}`)
      : c.json({ success: true, data: serialized }, 201);
  };

  create = this.store;

  destroy = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';

    await this.service.delete(id);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Archive record deleted successfully.' })
      : c.json({ success: true, data: { message: 'Archive record deleted successfully.' } }, 200);
  };

  delete = this.destroy;

  // Relations
  linkMission = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const archiveId = (('params' in ctxOrC && ctxOrC.params['archiveId']) || c.req.param('archiveId')) ?? '';
    const missionId = (('params' in ctxOrC && ctxOrC.params['missionId']) || c.req.param('missionId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkArchiveMissionRequestDto;

    const link = await this.service.linkMission(archiveId, missionId, body);
    const serialized = this.serializer.serializeArchiveMission(link);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized)
      : c.json({ success: true, data: serialized }, 201);
  };

  unlinkMission = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const archiveId = (('params' in ctxOrC && ctxOrC.params['archiveId']) || c.req.param('archiveId')) ?? '';
    const missionId = (('params' in ctxOrC && ctxOrC.params['missionId']) || c.req.param('missionId')) ?? '';

    await this.service.unlinkMission(archiveId, missionId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Mission unlinked from archive successfully.' })
      : c.json({ success: true, data: { message: 'Mission unlinked from archive successfully.' } }, 200);
  };

  linkEquipment = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const archiveId = (('params' in ctxOrC && ctxOrC.params['archiveId']) || c.req.param('archiveId')) ?? '';
    const equipmentId = (('params' in ctxOrC && ctxOrC.params['equipmentId']) || c.req.param('equipmentId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkArchiveEquipmentRequestDto;

    const link = await this.service.linkEquipment(archiveId, equipmentId, body);
    const serialized = this.serializer.serializeArchiveEquipment(link);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized)
      : c.json({ success: true, data: serialized }, 201);
  };

  unlinkEquipment = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const archiveId = (('params' in ctxOrC && ctxOrC.params['archiveId']) || c.req.param('archiveId')) ?? '';
    const equipmentId = (('params' in ctxOrC && ctxOrC.params['equipmentId']) || c.req.param('equipmentId')) ?? '';

    await this.service.unlinkEquipment(archiveId, equipmentId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Equipment unlinked from archive successfully.' })
      : c.json({ success: true, data: { message: 'Equipment unlinked from archive successfully.' } }, 200);
  };

  linkEvent = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const archiveId = (('params' in ctxOrC && ctxOrC.params['archiveId']) || c.req.param('archiveId')) ?? '';
    const eventId = (('params' in ctxOrC && ctxOrC.params['eventId']) || c.req.param('eventId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkArchiveEventRequestDto;

    const link = await this.service.linkEvent(archiveId, eventId, body);
    const serialized = this.serializer.serializeArchiveEvent(link);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized)
      : c.json({ success: true, data: serialized }, 201);
  };

  unlinkEvent = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const archiveId = (('params' in ctxOrC && ctxOrC.params['archiveId']) || c.req.param('archiveId')) ?? '';
    const eventId = (('params' in ctxOrC && ctxOrC.params['eventId']) || c.req.param('eventId')) ?? '';

    await this.service.unlinkEvent(archiveId, eventId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Event unlinked from archive successfully.' })
      : c.json({ success: true, data: { message: 'Event unlinked from archive successfully.' } }, 200);
  };

  linkSource = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const archiveId = (('params' in ctxOrC && ctxOrC.params['archiveId']) || c.req.param('archiveId')) ?? '';
    const sourceId = (('params' in ctxOrC && ctxOrC.params['sourceId']) || c.req.param('sourceId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkArchiveSourceRequestDto;

    const link = await this.service.linkSource(archiveId, sourceId, body);
    const serialized = this.serializer.serializeArchiveSource(link);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized)
      : c.json({ success: true, data: serialized }, 201);
  };

  unlinkSource = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const archiveId = (('params' in ctxOrC && ctxOrC.params['archiveId']) || c.req.param('archiveId')) ?? '';
    const sourceId = (('params' in ctxOrC && ctxOrC.params['sourceId']) || c.req.param('sourceId')) ?? '';

    await this.service.unlinkSource(archiveId, sourceId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Source unlinked from archive successfully.' })
      : c.json({ success: true, data: { message: 'Source unlinked from archive successfully.' } }, 200);
  };
}

export const adminArchiveController = new AdminArchiveController();
