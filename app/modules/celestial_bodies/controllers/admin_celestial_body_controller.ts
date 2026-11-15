import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { celestialBodyService, CelestialBodyService } from '../services/celestial_body_service.js';
import { jsonSuccess } from '#shared/http';

export class AdminCelestialBodyController {
  private service: CelestialBodyService;

  constructor(service?: CelestialBodyService) {
    this.service = service instanceof CelestialBodyService ? service : celestialBodyService;
  }

  update = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const body = 'body' in ctxOrC ? ctxOrC.body : await c.req.json();
    const id = (params['id'] || c.req.param('id')) as string;

    const updated = await this.service.updateBody(id, body);
    return jsonSuccess(c, { celestialBody: updated });
  };
}

export const adminCelestialBodyController = new AdminCelestialBodyController();
