import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { generationService, GenerationService } from '../services/generation_service.js';
import {
  createGenerationJobSchema,
  generationJobIdParamSchema,
  listGenerationJobsQuerySchema,
} from '../validators/generation.js';
import { jsonSuccess } from '#shared/http';

export class AdminGenerationController {
  private service: GenerationService;

  constructor(service?: GenerationService) {
    this.service = service instanceof GenerationService ? service : generationService;
  }

  create = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const user = c.get('user') as any;
    const body = await c.req.json();
    const input = createGenerationJobSchema.parse(body);

    const options: { simulateFailure?: boolean; simulateUntrustedHost?: boolean } = {};
    if (input.simulateFailure !== undefined) options.simulateFailure = input.simulateFailure;
    if (input.simulateUntrustedHost !== undefined) options.simulateUntrustedHost = input.simulateUntrustedHost;

    const job = await this.service.submitJob(input, user?.userId, options);

    return jsonSuccess(c, { job }, 201);
  };

  index = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && ctxOrC.query ? ctxOrC.query : c.req.query();
    const query = listGenerationJobsQuerySchema.parse(rawQuery);

    const filter: {
      status?: any;
      kind?: any;
      logbookEntryId?: string;
      page: number;
      limit: number;
    } = {
      page: query.page,
      limit: query.limit,
    };
    if (query.status !== undefined) filter.status = query.status;
    if (query.kind !== undefined) filter.kind = query.kind;
    if (query.logbookEntryId !== undefined) filter.logbookEntryId = query.logbookEntryId;

    const result = await this.service.listJobs(filter);
    return jsonSuccess(c, result);
  };

  show = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const id = (params['id'] || c.req.param('id')) as string;
    const { id: cleanId } = generationJobIdParamSchema.parse({ id });

    const job = await this.service.getJobById(cleanId);
    return jsonSuccess(c, { job });
  };

  poll = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const id = (params['id'] || c.req.param('id')) as string;
    const { id: cleanId } = generationJobIdParamSchema.parse({ id });

    const job = await this.service.pollJob(cleanId);
    return jsonSuccess(c, { job });
  };

  cancel = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const id = (params['id'] || c.req.param('id')) as string;
    const { id: cleanId } = generationJobIdParamSchema.parse({ id });

    const job = await this.service.cancelJob(cleanId);
    return jsonSuccess(c, { job });
  };
}

export const adminGenerationController = new AdminGenerationController();
