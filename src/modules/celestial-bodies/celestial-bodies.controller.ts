import type { Context } from 'hono';
import { celestialBodiesService, type CelestialBodiesService } from './celestial-bodies.service.js';
import { celestialBodiesSerializer, type CelestialBodiesSerializer } from './celestial-bodies.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import {
  listCelestialBodiesQuerySchema,
  type CreateCelestialBodyRequestDto,
  type UpdateCelestialBodyRequestDto,
} from './celestial-bodies.schemas.js';

export class CelestialBodiesController {
  constructor(
    private readonly service: CelestialBodiesService = celestialBodiesService,
    private readonly serializer: CelestialBodiesSerializer = celestialBodiesSerializer
  ) {}

  list = async (c: Context): Promise<Response> => {
    const rawQuery = c.req.query();
    const query = listCelestialBodiesQuerySchema.parse(rawQuery);

    const result = await this.service.list(query);
    const serialized = this.serializer.serializeCelestialBodyList(result.items);

    return paginated(c, serialized, {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
    });
  };

  get = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const body = await this.service.getById(id);
    const serialized = this.serializer.serializeCelestialBody(body);
    return ok(c, serialized);
  };

  create = async (c: Context): Promise<Response> => {
    const body = (await c.req.json()) as CreateCelestialBodyRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const result = await this.service.create(body, { actorId, requestId });
    const serialized = this.serializer.serializeCelestialBody(result);

    return created(c, serialized, `/api/v1/celestial-bodies/${result.celestialBodyId}`);
  };

  update = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const body = (await c.req.json()) as UpdateCelestialBodyRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const updated = await this.service.update(id, body, { actorId, requestId });
    const serialized = this.serializer.serializeCelestialBody(updated);

    return ok(c, serialized);
  };

  delete = async (c: Context): Promise<Response> => {
    const user = c.get('user');
    if (!user || user.role !== 'ADMIN') {
      throw AppException.forbidden('Admin role required to delete a celestial body.');
    }
    const id = c.req.param('id') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.delete(id, { actorId, requestId });
    return ok(c, { message: 'Celestial body deleted successfully.' });
  };
}

export const celestialBodiesController = new CelestialBodiesController();
