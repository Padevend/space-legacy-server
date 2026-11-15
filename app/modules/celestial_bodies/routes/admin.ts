import type { Router } from '#infrastructure/http/router';
import { AdminCelestialBodyController } from '../controllers/admin_celestial_body_controller.js';
import { celestialBodyIdParamSchema, updateCelestialBodySchema } from '../validators/celestial_body.js';

export function registerCelestialBodiesAdminRoutes(router: Router): void {
  const r = router.forModule('celestial_bodies');

  r.patch('/bodies/:id', [AdminCelestialBodyController, 'update'])
    .as('admin.bodies.update')
    .validate({
      params: celestialBodyIdParamSchema,
      body: updateCelestialBodySchema,
    })
    .docs({
      summary: 'Targeted partial PATCH update of a celestial body',
      tags: ['Admin', 'CelestialBodies'],
    });
}
