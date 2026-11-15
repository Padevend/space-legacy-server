import type { Router } from '#infrastructure/http/router';
import { CatalogController } from '../controllers/catalog_controller.js';
import { catalogFeedSchema, catalogDestinationSchema, catalogEquipmentDetailSchema } from '../validators/catalog.js';

export function registerCatalogPublicRoutes(router: Router): void {
  const r = router.forModule('catalog');

  r.get('/catalog/feed', [CatalogController, 'feed'])
    .as('catalog.feed')
    .docs({
      summary: 'Composed educational home feed with featured stories, events and highlight equipment',
      tags: ['Catalog'],
      responses: { 200: catalogFeedSchema },
    });

  r.get('/catalog/destinations', [CatalogController, 'destinations'])
    .as('catalog.destinations')
    .docs({
      summary: 'Explore destinations across celestial bodies with equipment and mission counters',
      tags: ['Catalog'],
      responses: { 200: 'List of destinations' },
    });

  r.get('/catalog/equipment/:idOrSlug', [CatalogController, 'equipmentDetail'])
    .as('catalog.equipment.detail')
    .where('idOrSlug', r.matchers.idOrSlug())
    .docs({
      summary: 'Full composite view of a space equipment item with coordinates, events and media',
      tags: ['Catalog'],
      responses: { 200: catalogEquipmentDetailSchema, 404: 'NOT_FOUND' },
    });
}
