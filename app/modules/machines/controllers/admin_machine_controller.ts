import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { machineService, MachineService } from '../services/machine_service.js';
import { jsonSuccess } from '#shared/http';

export class AdminMachineController {
  private service: MachineService;

  constructor(service?: MachineService) {
    this.service = service instanceof MachineService ? service : machineService;
  }

  // Machine CRUD
  index = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const query = 'query' in ctxOrC ? ctxOrC.query : c.req.query();

    const result = await this.service.listAdminMachines({
      bodyId: query.bodyId,
      kind: query.kind,
      state: query.state,
      isPublished: query.isPublished,
      q: query.q,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });

    return jsonSuccess(c, result);
  };

  show = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const id = (params['id'] || c.req.param('id')) as string;

    const machine = await this.service.getAdminMachineById(id);
    return jsonSuccess(c, { machine });
  };

  store = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = 'body' in ctxOrC ? ctxOrC.body : await c.req.json();

    const machine = await this.service.createMachine(body);
    return jsonSuccess(c, { machine }, 201);
  };

  update = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const body = 'body' in ctxOrC ? ctxOrC.body : await c.req.json();
    const id = (params['id'] || c.req.param('id')) as string;

    const machine = await this.service.patchMachine(id, body);
    return jsonSuccess(c, { machine });
  };

  destroy = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const id = (params['id'] || c.req.param('id')) as string;

    await this.service.deleteMachine(id);
    return jsonSuccess(c, { deleted: true });
  };

  // Sources
  storeSource = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const body = 'body' in ctxOrC ? ctxOrC.body : await c.req.json();
    const id = (params['id'] || c.req.param('id')) as string;

    const source = await this.service.createSource(id, body);
    return jsonSuccess(c, { source }, 201);
  };

  updateSource = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const body = 'body' in ctxOrC ? ctxOrC.body : await c.req.json();
    const id = (params['id'] || c.req.param('id')) as string;
    const subId = (params['subId'] || c.req.param('subId')) as string;

    const source = await this.service.patchSource(id, subId, body);
    return jsonSuccess(c, { source });
  };

  destroySource = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const id = (params['id'] || c.req.param('id')) as string;
    const subId = (params['subId'] || c.req.param('subId')) as string;

    await this.service.deleteSource(id, subId);
    return jsonSuccess(c, { deleted: true });
  };

  // Facts
  storeFact = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const body = 'body' in ctxOrC ? ctxOrC.body : await c.req.json();
    const id = (params['id'] || c.req.param('id')) as string;

    const fact = await this.service.createFact(id, body);
    return jsonSuccess(c, { fact }, 201);
  };

  updateFact = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const body = 'body' in ctxOrC ? ctxOrC.body : await c.req.json();
    const id = (params['id'] || c.req.param('id')) as string;
    const subId = (params['subId'] || c.req.param('subId')) as string;

    const fact = await this.service.patchFact(id, subId, body);
    return jsonSuccess(c, { fact });
  };

  destroyFact = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const id = (params['id'] || c.req.param('id')) as string;
    const subId = (params['subId'] || c.req.param('subId')) as string;

    await this.service.deleteFact(id, subId);
    return jsonSuccess(c, { deleted: true });
  };

  // Events
  storeEvent = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const body = 'body' in ctxOrC ? ctxOrC.body : await c.req.json();
    const id = (params['id'] || c.req.param('id')) as string;

    const event = await this.service.createEvent(id, body);
    return jsonSuccess(c, { event }, 201);
  };

  updateEvent = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const body = 'body' in ctxOrC ? ctxOrC.body : await c.req.json();
    const id = (params['id'] || c.req.param('id')) as string;
    const subId = (params['subId'] || c.req.param('subId')) as string;

    const event = await this.service.patchEvent(id, subId, body);
    return jsonSuccess(c, { event });
  };

  destroyEvent = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const id = (params['id'] || c.req.param('id')) as string;
    const subId = (params['subId'] || c.req.param('subId')) as string;

    await this.service.deleteEvent(id, subId);
    return jsonSuccess(c, { deleted: true });
  };

  // Images
  storeImage = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const body = 'body' in ctxOrC ? ctxOrC.body : await c.req.json();
    const id = (params['id'] || c.req.param('id')) as string;

    const image = await this.service.createImage(id, body);
    return jsonSuccess(c, { image }, 201);
  };

  updateImage = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const body = 'body' in ctxOrC ? ctxOrC.body : await c.req.json();
    const id = (params['id'] || c.req.param('id')) as string;
    const subId = (params['subId'] || c.req.param('subId')) as string;

    const image = await this.service.patchImage(id, subId, body);
    return jsonSuccess(c, { image });
  };

  destroyImage = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const id = (params['id'] || c.req.param('id')) as string;
    const subId = (params['subId'] || c.req.param('subId')) as string;

    await this.service.deleteImage(id, subId);
    return jsonSuccess(c, { deleted: true });
  };
}

export const adminMachineController = new AdminMachineController();
