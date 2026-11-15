import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { EquipmentService, equipmentService } from '../services/equipment_service.js';
import { EquipmentSerializer, equipmentSerializer } from '../serializers/equipment_serializer.js';
import { type CreateEquipmentRequestDto, type UpdateEquipmentRequestDto } from '../validators/equipment.js';

export class AdminEquipmentController {
  constructor(
    private readonly service: EquipmentService = equipmentService,
    private readonly serializer: EquipmentSerializer = equipmentSerializer
  ) {}

  store = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as CreateEquipmentRequestDto;

    const equipment = await this.service.create(body);
    const serialized = this.serializer.serializeEquipment(equipment);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized, `/api/v1/equipment/${equipment.slug}`)
      : c.json({ success: true, data: serialized }, 201);
  };

  create = this.store;

  update = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as UpdateEquipmentRequestDto;

    const updated = await this.service.update(id, body);
    const serialized = this.serializer.serializeEquipment(updated);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  destroy = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';

    await this.service.delete(id);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Equipment deleted successfully.' })
      : c.json({ success: true, data: { message: 'Equipment deleted successfully.' } }, 200);
  };

  delete = this.destroy;
}

export const adminEquipmentController = new AdminEquipmentController();
