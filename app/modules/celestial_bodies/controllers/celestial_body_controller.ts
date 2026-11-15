import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { celestialBodyService, CelestialBodyService } from '../services/celestial_body_service.js';
import { jsonSuccess } from '#shared/http';

export class CelestialBodyController {
  private service: CelestialBodyService;

  constructor(service?: CelestialBodyService) {
    this.service = service instanceof CelestialBodyService ? service : celestialBodyService;
  }

  index = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const bodies = await this.service.getPublishedBodies();
    return jsonSuccess(c, { bodies });
  };
}

export const celestialBodyController = new CelestialBodyController();
