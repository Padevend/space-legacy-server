import type { Router } from '#infrastructure/http/router';
import { EquipmentController } from '../controllers/equipment_controller.js';
import { listEquipmentQuerySchema, getEquipmentQuerySchema, equipmentSchema } from '../validators/equipment.js';

export function registerEquipmentPublicRoutes(router: Router): void {
  const r = router.forModule('equipment');

  r.get('/equipment', [EquipmentController, 'index'])
    .as('equipment.index')
    .validate({ query: listEquipmentQuerySchema })
    .docs({
      summary: 'List NASA equipment left in space with pagination and filtering',
      tags: ['Equipment'],
      responses: { 200: 'List of equipment' },
    });

  r.get('/equipment/:idOrSlug', [EquipmentController, 'show'])
    .as('equipment.show')
    .where('idOrSlug', r.matchers.idOrSlug())
    .validate({ query: getEquipmentQuerySchema })
    .docs({
      summary: 'Get single equipment by UUID or slug with optional includes (parent, children, people)',
      tags: ['Equipment'],
      responses: { 200: equipmentSchema, 404: 'NOT_FOUND' },
    });

  r.get('/equipment/:idOrSlug/children', [EquipmentController, 'children'])
    .as('equipment.children')
    .where('idOrSlug', r.matchers.idOrSlug())
    .docs({
      summary: 'Get equipment children (sub-assemblies)',
      tags: ['Equipment'],
      responses: { 200: 'Children equipment list', 404: 'NOT_FOUND' },
    });
}
