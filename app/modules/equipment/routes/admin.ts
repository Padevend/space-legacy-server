import type { Router } from '#infrastructure/http/router';
import { AdminEquipmentController } from '../controllers/admin_equipment_controller.js';
import {
  createEquipmentRequestSchema,
  updateEquipmentRequestSchema,
  linkEquipmentPersonSchema,
} from '../validators/equipment.js';
import { middleware } from '#start/kernel';

export function registerEquipmentAdminRoutes(router: Router): void {
  const r = router.forModule('equipment');

  r.post('/admin/equipment', [AdminEquipmentController, 'store'])
    .as('admin.equipment.store')
    .use(middleware.ability('equipment:write'))
    .validate({ body: createEquipmentRequestSchema })
    .docs({
      summary: 'Create a new equipment item',
      tags: ['Equipment'],
      responses: { 201: 'Created equipment', 409: 'CONFLICT' },
    });

  r.put('/admin/equipment/:id', [AdminEquipmentController, 'update'])
    .as('admin.equipment.update')
    .use(middleware.ability('equipment:write'))
    .validate({ body: updateEquipmentRequestSchema })
    .docs({
      summary: 'Update an existing equipment item',
      tags: ['Equipment'],
      responses: { 200: 'Updated equipment', 404: 'NOT_FOUND' },
    });

  r.patch('/admin/equipment/:id', [AdminEquipmentController, 'update'])
    .as('admin.equipment.patch')
    .use(middleware.ability('equipment:write'))
    .validate({ body: updateEquipmentRequestSchema })
    .docs({
      summary: 'Update an existing equipment item',
      tags: ['Equipment'],
      responses: { 200: 'Updated equipment', 404: 'NOT_FOUND' },
    });

  r.delete('/admin/equipment/:id', [AdminEquipmentController, 'destroy'])
    .as('admin.equipment.destroy')
    .use(middleware.ability('equipment:delete'))
    .docs({
      summary: 'Delete an equipment item',
      tags: ['Equipment'],
      responses: { 200: 'Deleted equipment', 404: 'NOT_FOUND' },
    });

  // Equipment person relation
  r.post('/admin/equipment/:equipmentId/people/:personId', [AdminEquipmentController, 'linkPerson'])
    .as('admin.equipment.linkPerson')
    .use(middleware.ability('equipment:write'))
    .validate({ body: linkEquipmentPersonSchema })
    .docs({ summary: 'Link person to equipment with optional role', tags: ['Equipment'] });

  r.put('/admin/equipment/:equipmentId/people/:personId', [AdminEquipmentController, 'linkPerson'])
    .as('admin.equipment.linkPersonPut')
    .use(middleware.ability('equipment:write'))
    .validate({ body: linkEquipmentPersonSchema })
    .docs({ summary: 'Link person to equipment with optional role', tags: ['Equipment'] });

  r.delete('/admin/equipment/:equipmentId/people/:personId', [AdminEquipmentController, 'unlinkPerson'])
    .as('admin.equipment.unlinkPerson')
    .use(middleware.ability('equipment:delete'))
    .docs({ summary: 'Unlink person from equipment', tags: ['Equipment'] });
}
