import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { EquipmentService, equipmentService } from '../services/equipment_service.js';
import { EquipmentSerializer, equipmentSerializer } from '../serializers/equipment_serializer.js';
import { listEquipmentQuerySchema, getEquipmentQuerySchema } from '../validators/equipment.js';

export class EquipmentController {
  constructor(
    private readonly service: EquipmentService = equipmentService,
    private readonly serializer: EquipmentSerializer = equipmentSerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listEquipmentQuerySchema.parse(rawQuery);

    const { equipment, total } = await this.service.list(query);
    const data = equipment.map((e) => this.serializer.serializeEquipment(e));

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
    const query = getEquipmentQuerySchema.parse(rawQuery);

    const item = await this.service.getByIdOrSlug(idOrSlug, query.include);
    const serialized = this.serializer.serializeEquipmentDetail(item);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  children = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const idOrSlug =
      (('params' in ctxOrC && ctxOrC.params['idOrSlug']) || c.req.param('idOrSlug') || c.req.param('id')) ?? '';
    const items = await this.service.getChildren(idOrSlug);
    const data = items.map((e) => this.serializer.serializeEquipment(e));
    return 'response' in ctxOrC ? ctxOrC.response.ok(c, data) : c.json({ success: true, data }, 200);
  };

  get = this.show;
}

export const equipmentController = new EquipmentController();
