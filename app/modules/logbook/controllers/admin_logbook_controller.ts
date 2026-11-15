import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { logbookService, LogbookService } from '../services/logbook_service.js';
import { jsonSuccess } from '#shared/http';

export class AdminLogbookController {
  private service: LogbookService;

  constructor(service?: LogbookService) {
    this.service = service instanceof LogbookService ? service : logbookService;
  }

  index = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const query = 'query' in ctxOrC ? ctxOrC.query : c.req.query();

    const result = await this.service.listAdminEntries({
      machineId: query.machineId,
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

    const logbookEntry = await this.service.getAdminEntryById(id);
    return jsonSuccess(c, { logbookEntry });
  };

  store = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = 'body' in ctxOrC ? ctxOrC.body : await c.req.json();

    const logbookEntry = await this.service.createEntry(body);
    return jsonSuccess(c, { logbookEntry }, 201);
  };

  update = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const body = 'body' in ctxOrC ? ctxOrC.body : await c.req.json();
    const id = (params['id'] || c.req.param('id')) as string;

    const logbookEntry = await this.service.patchEntry(id, body);
    return jsonSuccess(c, { logbookEntry });
  };

  destroy = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const id = (params['id'] || c.req.param('id')) as string;

    await this.service.deleteEntry(id);
    return jsonSuccess(c, { deleted: true });
  };
}

export const adminLogbookController = new AdminLogbookController();
