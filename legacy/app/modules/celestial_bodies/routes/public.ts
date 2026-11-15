import type { Router } from '#infrastructure/http/router';
import { CelestialBodyController } from '../controllers/celestial_body_controller.js';
import { listCelestialBodiesQuerySchema, celestialBodySchema } from '../validators/celestial_body.js';

export function registerCelestialBodiesPublicRoutes(router: Router): void {
  const r = router.forModule('celestial_bodies');

  r.get('/celestial-bodies', [CelestialBodyController, 'index'])
    .as('celestialBodies.index')
    .validate({ query: listCelestialBodiesQuerySchema })
    .docs({
      summary: 'List celestial bodies with pagination and filtering',
      tags: ['Celestial Bodies'],
      responses: { 200: 'List of celestial bodies' },
    });

  r.get('/celestial-bodies/:id', [CelestialBodyController, 'show'])
    .as('celestialBodies.show')
    .docs({
      summary: 'Get a celestial body by UUID',
      tags: ['Celestial Bodies'],
      responses: { 200: celestialBodySchema, 404: 'NOT_FOUND' },
    });
}
