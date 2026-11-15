import type { Router } from '#infrastructure/http/router';
import { AdminLocationController } from '../controllers/admin_location_controller.js';
import {
  createLocationRequestSchema,
  updateLocationRequestSchema,
  linkEquipmentLocationSchema,
} from '../validators/location.js';
import { middleware } from '#start/kernel';

export function registerLocationsAdminRoutes(router: Router): void {
  const r = router.forModule('locations');

  r.post('/admin/locations', [AdminLocationController, 'store'])
    .as('admin.locations.store')
    .use(middleware.ability('locations:write'))
    .validate({ body: createLocationRequestSchema })
    .docs({
      summary: 'Create a new location',
      tags: ['Locations'],
      responses: { 201: 'Created location', 409: 'CONFLICT' },
    });

  r.put('/admin/locations/:id', [AdminLocationController, 'update'])
    .as('admin.locations.update')
    .use(middleware.ability('locations:write'))
    .validate({ body: updateLocationRequestSchema })
    .docs({
      summary: 'Update an existing location',
      tags: ['Locations'],
      responses: { 200: 'Updated location', 404: 'NOT_FOUND' },
    });

  r.patch('/admin/locations/:id', [AdminLocationController, 'update'])
    .as('admin.locations.patch')
    .use(middleware.ability('locations:write'))
    .validate({ body: updateLocationRequestSchema })
    .docs({
      summary: 'Update an existing location',
      tags: ['Locations'],
      responses: { 200: 'Updated location', 404: 'NOT_FOUND' },
    });

  r.delete('/admin/locations/:id', [AdminLocationController, 'destroy'])
    .as('admin.locations.destroy')
    .use(middleware.ability('locations:delete'))
    .docs({
      summary: 'Delete a location',
      tags: ['Locations'],
      responses: { 200: 'Deleted location', 404: 'NOT_FOUND' },
    });

  // Relation: equipment locations (owned by locations module)
  r.post('/admin/equipment/:equipmentId/locations', [AdminLocationController, 'linkEquipment'])
    .as('admin.locations.linkEquipment')
    .use(middleware.ability('locations:write'))
    .validate({ body: linkEquipmentLocationSchema })
    .docs({
      summary: 'Link equipment to a surface or orbital location',
      tags: ['Locations'],
      responses: { 201: 'Linked equipment location', 400: 'BAD_REQUEST' },
    });

  r.put('/admin/equipment/:equipmentId/locations/:locationId', [AdminLocationController, 'linkEquipment'])
    .as('admin.locations.linkEquipmentPut')
    .use(middleware.ability('locations:write'))
    .docs({
      summary: 'Link equipment to a surface or orbital location',
      tags: ['Locations'],
      responses: { 200: 'Linked equipment location', 400: 'BAD_REQUEST' },
    });

  r.delete('/admin/equipment/:equipmentId/locations/:locationId', [AdminLocationController, 'unlinkEquipment'])
    .as('admin.locations.unlinkEquipment')
    .use(middleware.ability('locations:write'))
    .docs({
      summary: 'Unlink equipment from a location',
      tags: ['Locations'],
      responses: { 200: 'Unlinked equipment location', 404: 'NOT_FOUND' },
    });
}
