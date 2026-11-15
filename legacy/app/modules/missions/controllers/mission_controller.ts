import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { MissionService, missionService } from '../services/mission_service.js';
import { MissionSerializer, missionSerializer } from '../serializers/mission_serializer.js';
import { listMissionsQuerySchema, getMissionQuerySchema } from '../validators/mission.js';

export class MissionController {
  constructor(
    private readonly service: MissionService = missionService,
    private readonly serializer: MissionSerializer = missionSerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listMissionsQuerySchema.parse(rawQuery);

    const { missions, total } = await this.service.list(query);
    const data = missions.map((m) => this.serializer.serializeMission(m));

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
    const query = getMissionQuerySchema.parse(rawQuery);

    const item = await this.service.getByIdOrSlug(idOrSlug, query.include);
    const serialized = this.serializer.serializeMissionDetail(item);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  get = this.show;
}

export const missionController = new MissionController();
