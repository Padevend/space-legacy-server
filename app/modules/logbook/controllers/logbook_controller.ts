import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { logbookService, LogbookService } from '../services/logbook_service.js';
import { machineLogbookParamsSchema, machineLogbookEntryParamsSchema } from '../validators/logbook_entry.js';
import { jsonSuccess } from '#shared/http';

export class LogbookController {
  private service: LogbookService;

  constructor(service?: LogbookService) {
    this.service = service instanceof LogbookService ? service : logbookService;
  }

  index = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const slug = (('params' in ctxOrC && ctxOrC.params?.['slug']) || c.req.param('slug')) ?? '';
    const params = machineLogbookParamsSchema.parse({ slug });

    const result = await this.service.listMachineEntries(params.slug);
    return jsonSuccess(c, result);
  };

  show = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const slug = (('params' in ctxOrC && ctxOrC.params?.['slug']) || c.req.param('slug')) ?? '';
    const entrySlug = (('params' in ctxOrC && ctxOrC.params?.['entry']) || c.req.param('entry')) ?? '';
    const params = machineLogbookEntryParamsSchema.parse({ slug, entry: entrySlug });

    const entry = await this.service.getMachineEntry(params.slug, params.entry);
    return jsonSuccess(c, { entry });
  };
}

export const logbookController = new LogbookController();
