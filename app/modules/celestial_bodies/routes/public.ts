import type { Router } from '#infrastructure/http/router';
import { CelestialBodyController } from '../controllers/celestial_body_controller.js';

export function registerCelestialBodiesPublicRoutes(router: Router): void {
  const r = router.forModule('celestial_bodies');

  r.get('/bodies', [CelestialBodyController, 'index']).as('celestial_bodies.public_list');
}
