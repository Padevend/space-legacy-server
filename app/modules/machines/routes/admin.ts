import type { Router } from '#infrastructure/http/router';
import { AdminMachineController } from '../controllers/admin_machine_controller.js';
import {
  machineIdParamSchema,
  machineSubResourceParamSchema,
  listAdminMachinesQuerySchema,
  createMachineSchema,
  updateMachineSchema,
  createSourceSchema,
  updateSourceSchema,
  createFactSchema,
  updateFactSchema,
  createEventSchema,
  updateEventSchema,
  createImageSchema,
  updateImageSchema,
} from '../validators/machine.js';

export function registerMachinesAdminRoutes(router: Router): void {
  const r = router.forModule('machines');

  // Machines CRUD
  r.get('/machines', [AdminMachineController, 'index'])
    .as('admin.machines.index')
    .validate({ query: listAdminMachinesQuerySchema })
    .docs({ summary: 'List all machines including draft/unpublished', tags: ['Admin', 'Machines'] });

  r.post('/machines', [AdminMachineController, 'store'])
    .as('admin.machines.store')
    .validate({ body: createMachineSchema })
    .docs({ summary: 'Create new machine draft', tags: ['Admin', 'Machines'] });

  r.get('/machines/:id', [AdminMachineController, 'show'])
    .as('admin.machines.show')
    .validate({ params: machineIdParamSchema })
    .docs({ summary: 'Get full machine details by UUID for administration', tags: ['Admin', 'Machines'] });

  r.patch('/machines/:id', [AdminMachineController, 'update'])
    .as('admin.machines.update')
    .validate({ params: machineIdParamSchema, body: updateMachineSchema })
    .docs({ summary: 'Targeted partial PATCH update of a machine', tags: ['Admin', 'Machines'] });

  r.delete('/machines/:id', [AdminMachineController, 'destroy'])
    .as('admin.machines.destroy')
    .validate({ params: machineIdParamSchema })
    .docs({ summary: 'Delete machine and cascade to sub-resources', tags: ['Admin', 'Machines'] });

  // Sources Sub-Resource
  r.post('/machines/:id/sources', [AdminMachineController, 'storeSource'])
    .as('admin.machines.sources.store')
    .validate({ params: machineIdParamSchema, body: createSourceSchema })
    .docs({ summary: 'Add a verified source to a machine', tags: ['Admin', 'Sources'] });

  r.patch('/machines/:id/sources/:subId', [AdminMachineController, 'updateSource'])
    .as('admin.machines.sources.update')
    .validate({ params: machineSubResourceParamSchema, body: updateSourceSchema })
    .docs({ summary: 'Targeted partial PATCH update of a machine source', tags: ['Admin', 'Sources'] });

  r.delete('/machines/:id/sources/:subId', [AdminMachineController, 'destroySource'])
    .as('admin.machines.sources.destroy')
    .validate({ params: machineSubResourceParamSchema })
    .docs({ summary: 'Delete a machine source', tags: ['Admin', 'Sources'] });

  // Facts Sub-Resource
  r.post('/machines/:id/facts', [AdminMachineController, 'storeFact'])
    .as('admin.machines.facts.store')
    .validate({ params: machineIdParamSchema, body: createFactSchema })
    .docs({ summary: 'Add a key fact to a machine', tags: ['Admin', 'Facts'] });

  r.patch('/machines/:id/facts/:subId', [AdminMachineController, 'updateFact'])
    .as('admin.machines.facts.update')
    .validate({ params: machineSubResourceParamSchema, body: updateFactSchema })
    .docs({ summary: 'Targeted partial PATCH update of a key fact', tags: ['Admin', 'Facts'] });

  r.delete('/machines/:id/facts/:subId', [AdminMachineController, 'destroyFact'])
    .as('admin.machines.facts.destroy')
    .validate({ params: machineSubResourceParamSchema })
    .docs({ summary: 'Delete a key fact', tags: ['Admin', 'Facts'] });

  // Events Sub-Resource
  r.post('/machines/:id/events', [AdminMachineController, 'storeEvent'])
    .as('admin.machines.events.store')
    .validate({ params: machineIdParamSchema, body: createEventSchema })
    .docs({ summary: 'Add a timeline event to a machine', tags: ['Admin', 'Events'] });

  r.patch('/machines/:id/events/:subId', [AdminMachineController, 'updateEvent'])
    .as('admin.machines.events.update')
    .validate({ params: machineSubResourceParamSchema, body: updateEventSchema })
    .docs({ summary: 'Targeted partial PATCH update of a timeline event', tags: ['Admin', 'Events'] });

  r.delete('/machines/:id/events/:subId', [AdminMachineController, 'destroyEvent'])
    .as('admin.machines.events.destroy')
    .validate({ params: machineSubResourceParamSchema })
    .docs({ summary: 'Delete a timeline event', tags: ['Admin', 'Events'] });

  // Images Sub-Resource
  r.post('/machines/:id/images', [AdminMachineController, 'storeImage'])
    .as('admin.machines.images.store')
    .validate({ params: machineIdParamSchema, body: createImageSchema })
    .docs({ summary: 'Add an image to a machine', tags: ['Admin', 'Images'] });

  r.patch('/machines/:id/images/:subId', [AdminMachineController, 'updateImage'])
    .as('admin.machines.images.update')
    .validate({ params: machineSubResourceParamSchema, body: updateImageSchema })
    .docs({ summary: 'Targeted partial PATCH update of an image', tags: ['Admin', 'Images'] });

  r.delete('/machines/:id/images/:subId', [AdminMachineController, 'destroyImage'])
    .as('admin.machines.images.destroy')
    .validate({ params: machineSubResourceParamSchema })
    .docs({ summary: 'Delete an image', tags: ['Admin', 'Images'] });
}
