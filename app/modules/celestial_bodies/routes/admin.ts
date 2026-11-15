import type { Router } from '#infrastructure/http/router';
import { AdminCelestialBodyController } from '../controllers/admin_celestial_body_controller.js';
import { createCelestialBodyRequestSchema, updateCelestialBodyRequestSchema } from '../validators/celestial_body.js';
import { middleware } from '#start/kernel';

export function registerCelestialBodiesAdminRoutes(router: Router): void {
  const r = router.forModule('celestial_bodies');

  r.post('/admin/celestial-bodies', [AdminCelestialBodyController, 'store'])
    .as('admin.celestialBodies.store')
    .use(middleware.ability('celestial_bodies:write'))
    .validate({ body: createCelestialBodyRequestSchema })
    .docs({
      summary: 'Create a new celestial body',
      tags: ['Celestial Bodies'],
      responses: { 201: 'Created celestial body', 409: 'CONFLICT' },
    });

  r.put('/admin/celestial-bodies/:id', [AdminCelestialBodyController, 'update'])
    .as('admin.celestialBodies.update')
    .use(middleware.ability('celestial_bodies:write'))
    .validate({ body: updateCelestialBodyRequestSchema })
    .docs({
      summary: 'Update an existing celestial body',
      tags: ['Celestial Bodies'],
      responses: { 200: 'Updated celestial body', 404: 'NOT_FOUND' },
    });

  r.patch('/admin/celestial-bodies/:id', [AdminCelestialBodyController, 'update'])
    .as('admin.celestialBodies.patch')
    .use(middleware.ability('celestial_bodies:write'))
    .validate({ body: updateCelestialBodyRequestSchema })
    .docs({
      summary: 'Update an existing celestial body',
      tags: ['Celestial Bodies'],
      responses: { 200: 'Updated celestial body', 404: 'NOT_FOUND' },
    });

  r.delete('/admin/celestial-bodies/:id', [AdminCelestialBodyController, 'destroy'])
    .as('admin.celestialBodies.destroy')
    .use(middleware.ability('celestial_bodies:delete'))
    .docs({
      summary: 'Delete a celestial body',
      tags: ['Celestial Bodies'],
      responses: { 200: 'Deleted celestial body', 404: 'NOT_FOUND' },
    });
}
