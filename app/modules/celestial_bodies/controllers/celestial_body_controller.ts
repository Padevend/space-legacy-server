import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { CelestialBodyService, celestialBodyService } from '../services/celestial_body_service.js';
import { CelestialBodySerializer, celestialBodySerializer } from '../serializers/celestial_body_serializer.js';
import { listCelestialBodiesQuerySchema } from '../validators/celestial_body.js';

export class CelestialBodyController {
  constructor(
    private readonly service: CelestialBodyService = celestialBodyService,
    private readonly serializer: CelestialBodySerializer = celestialBodySerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listCelestialBodiesQuerySchema.parse(rawQuery);

    const result = await this.service.list(query);
    const serialized = this.serializer.serializeCelestialBodyList(result.items);

    return 'response' in ctxOrC
      ? ctxOrC.response.paginated(c, serialized, {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
        })
      : c.json(
          {
            success: true,
            data: serialized,
            meta: { page: result.page, pageSize: result.pageSize, total: result.total },
          },
          200
        );
  };

  list = this.index;

  show = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const body = await this.service.getById(id);
    const serialized = this.serializer.serializeCelestialBody(body);
    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  get = this.show;
}

export const celestialBodyController = new CelestialBodyController();
