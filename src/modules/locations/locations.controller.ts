import type { Context } from 'hono';
import { locationsService, type LocationsService } from './locations.service.js';
import { locationsSerializer, type LocationsSerializer } from './locations.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import {
  listLocationsQuerySchema,
  type CreateLocationRequestDto,
  type UpdateLocationRequestDto,
} from './locations.schemas.js';

export class LocationsController {
  constructor(
    private readonly service: LocationsService = locationsService,
    private readonly serializer: LocationsSerializer = locationsSerializer
  ) {}

  list = async (c: Context): Promise<Response> => {
    const rawQuery = c.req.query();
    const query = listLocationsQuerySchema.parse(rawQuery);

    const result = await this.service.list(query);
    const serialized = this.serializer.serializeLocationList(result.items);

    return paginated(c, serialized, {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
    });
  };

  get = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const location = await this.service.getById(id);
    const serialized = this.serializer.serializeLocation(location);
    return ok(c, serialized);
  };

  create = async (c: Context): Promise<Response> => {
    const body = (await c.req.json()) as CreateLocationRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const result = await this.service.create(body, { actorId, requestId });
    const serialized = this.serializer.serializeLocation(result);

    return created(c, serialized, `/api/v1/locations/${result.locationId}`);
  };

  update = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const body = (await c.req.json()) as UpdateLocationRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const updated = await this.service.update(id, body, { actorId, requestId });
    const serialized = this.serializer.serializeLocation(updated);

    return ok(c, serialized);
  };

  delete = async (c: Context): Promise<Response> => {
    const user = c.get('user');
    if (!user || user.role !== 'ADMIN') {
      throw AppException.forbidden('Admin role required to delete a location.');
    }
    const id = c.req.param('id') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.delete(id, { actorId, requestId });
    return ok(c, { message: 'Location deleted successfully.' });
  };
}

export const locationsController = new LocationsController();
