import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { CelestialBodyService, celestialBodyService } from '../services/celestial_body_service.js';
import { CelestialBodySerializer, celestialBodySerializer } from '../serializers/celestial_body_serializer.js';
import {
  type CreateCelestialBodyRequestDto,
  type UpdateCelestialBodyRequestDto,
} from '../validators/celestial_body.js';

export class AdminCelestialBodyController {
  constructor(
    private readonly service: CelestialBodyService = celestialBodyService,
    private readonly serializer: CelestialBodySerializer = celestialBodySerializer
  ) {}

  store = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as CreateCelestialBodyRequestDto;

    const createdItem = await this.service.create(body);
    const serialized = this.serializer.serializeCelestialBody(createdItem);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized, `/api/v1/celestial-bodies/${createdItem.celestialBodyId}`)
      : c.json({ success: true, data: serialized }, 201);
  };

  create = this.store;

  update = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as UpdateCelestialBodyRequestDto;

    const updated = await this.service.update(id, body);
    const serialized = this.serializer.serializeCelestialBody(updated);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  destroy = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';

    await this.service.delete(id);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Celestial body deleted successfully.' })
      : c.json({ success: true, data: { message: 'Celestial body deleted successfully.' } }, 200);
  };

  delete = this.destroy;
}

export const adminCelestialBodyController = new AdminCelestialBodyController();
