import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { machineService, MachineService } from '../services/machine_service.js';
import { machineFilterQuerySchema } from '../validators/machine.js';
import { jsonSuccess } from '#shared/http';

export class MachineController {
  private service: MachineService;

  constructor(service?: MachineService) {
    this.service = service instanceof MachineService ? service : machineService;
  }

  index = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && ctxOrC.query ? ctxOrC.query : c.req.query();
    const query = machineFilterQuerySchema.parse(rawQuery);
    const result = await this.service.listMachines(query);
    return jsonSuccess(c, result);
  };

  show = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const slug = (('params' in ctxOrC && ctxOrC.params?.['slug']) || c.req.param('slug')) ?? '';
    const machine = await this.service.getMachineBySlug(slug);
    return jsonSuccess(c, { machine });
  };
}

export const machineController = new MachineController();
