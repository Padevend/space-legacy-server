import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { LocationService, locationService } from '../services/location_service.js';
import { LocationSerializer, locationSerializer } from '../serializers/location_serializer.js';
import { listLocationsQuerySchema } from '../validators/location.js';

export class LocationController {
  constructor(
    private readonly service: LocationService = locationService,
    private readonly serializer: LocationSerializer = locationSerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listLocationsQuerySchema.parse(rawQuery);

    const result = await this.service.list(query);
    const serialized = this.serializer.serializeLocationList(result.items);

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
    const location = await this.service.getById(id);
    const serialized = this.serializer.serializeLocation(location);
    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  get = this.show;

  equipmentLocations = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const idOrSlug =
      (('params' in ctxOrC && ctxOrC.params['idOrSlug']) || c.req.param('idOrSlug') || c.req.param('id')) ?? '';
    const items = await this.service.getEquipmentLocations(idOrSlug);
    const data = items.map((l) => this.serializer.serializeEquipmentLocation(l));
    return 'response' in ctxOrC ? ctxOrC.response.ok(c, data) : c.json({ success: true, data }, 200);
  };
}

export const locationController = new LocationController();
