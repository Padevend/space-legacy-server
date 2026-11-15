import type { Router } from '#infrastructure/http/router';
import { LocationController } from '../controllers/location_controller.js';
import { listLocationsQuerySchema, locationSchema } from '../validators/location.js';

export function registerLocationsPublicRoutes(router: Router): void {
  const r = router.forModule('locations');

  r.get('/locations', [LocationController, 'index'])
    .as('locations.index')
    .validate({ query: listLocationsQuerySchema })
    .docs({
      summary: 'List geographic locations with pagination and filtering',
      tags: ['Locations'],
      responses: { 200: 'List of locations' },
    });

  r.get('/locations/:id', [LocationController, 'show'])
    .as('locations.show')
    .docs({
      summary: 'Get a location by UUID',
      tags: ['Locations'],
      responses: { 200: locationSchema, 404: 'NOT_FOUND' },
    });

  r.get('/equipment/:idOrSlug/locations', [LocationController, 'equipmentLocations'])
    .as('locations.equipmentLocations')
    .where('idOrSlug', r.matchers.idOrSlug())
    .docs({
      summary: 'Get equipment locations',
      tags: ['Locations'],
      responses: { 200: 'Equipment locations list' },
    });
}
