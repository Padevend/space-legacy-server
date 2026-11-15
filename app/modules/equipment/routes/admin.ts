import type { Router } from '#infrastructure/http/router';
import { AdminEquipmentController } from '../controllers/admin_equipment_controller.js';
import { createEquipmentRequestSchema, updateEquipmentRequestSchema } from '../validators/equipment.js';
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
}
