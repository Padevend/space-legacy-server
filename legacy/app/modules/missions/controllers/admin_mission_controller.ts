import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { MissionService, missionService } from '../services/mission_service.js';
import { MissionSerializer, missionSerializer } from '../serializers/mission_serializer.js';
import {
  type CreateMissionRequestDto,
  type UpdateMissionRequestDto,
  type LinkMissionEquipmentDto,
} from '../validators/mission.js';

export class AdminMissionController {
  constructor(
    private readonly service: MissionService = missionService,
    private readonly serializer: MissionSerializer = missionSerializer
  ) {}

  store = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as CreateMissionRequestDto;

    const mission = await this.service.create(body);
    const serialized = this.serializer.serializeMission(mission);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized, `/api/v1/missions/${mission.slug}`)
      : c.json({ success: true, data: serialized }, 201);
  };

  create = this.store;

  update = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as UpdateMissionRequestDto;

    const updated = await this.service.update(id, body);
    const serialized = this.serializer.serializeMission(updated);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  destroy = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';

    await this.service.delete(id);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Mission deleted successfully.' })
      : c.json({ success: true, data: { message: 'Mission deleted successfully.' } }, 200);
  };

  delete = this.destroy;

  // Equipment links
  linkEquipment = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const missionId = (('params' in ctxOrC && ctxOrC.params['missionId']) || c.req.param('missionId')) ?? '';
    const equipmentId = (('params' in ctxOrC && ctxOrC.params['equipmentId']) || c.req.param('equipmentId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkMissionEquipmentDto;

    const link = await this.service.linkEquipment(missionId, equipmentId, body);
    const serialized = this.serializer.serializeMissionEquipment(link);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  unlinkEquipment = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const missionId = (('params' in ctxOrC && ctxOrC.params['missionId']) || c.req.param('missionId')) ?? '';
    const equipmentId = (('params' in ctxOrC && ctxOrC.params['equipmentId']) || c.req.param('equipmentId')) ?? '';

    await this.service.unlinkEquipment(missionId, equipmentId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Mission equipment unlinked successfully.' })
      : c.json({ success: true, data: { message: 'Mission equipment unlinked successfully.' } }, 200);
  };
}

export const adminMissionController = new AdminMissionController();
