import type { Router } from '#infrastructure/http/router';
import { MachineController } from '../controllers/machine_controller.js';

export function registerMachinesPublicRoutes(router: Router): void {
  const r = router.forModule('machines');

  r.get('/machines', [MachineController, 'index']).as('machines.public_list');
  r.get('/machines/:slug', [MachineController, 'show']).as('machines.public_show');
}
