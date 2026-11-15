import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { IngestionService, ingestionService } from '../services/ingestion_service.js';
import { IngestionSerializer, ingestionSerializer } from '../serializers/ingestion_serializer.js';
import { listIngestionRunsQuerySchema, type TriggerIngestRequestDto } from '../validators/ingestion.js';

export class AdminIngestionController {
  constructor(
    private readonly service: IngestionService = ingestionService,
    private readonly serializer: IngestionSerializer = ingestionSerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listIngestionRunsQuerySchema.parse(rawQuery);

    const { runs, total } = await this.service.list(query);
    const data = runs.map((r) => this.serializer.serializeIngestionRun(r));

    return 'response' in ctxOrC
      ? ctxOrC.response.paginated(c, data, {
          page: query.page ?? 1,
          pageSize: query.pageSize ?? 20,
          total,
        })
      : c.json(
          {
            success: true,
            data,
            meta: { page: query.page ?? 1, pageSize: query.pageSize ?? 20, total },
          },
          200
        );
  };

  list = this.index;

  show = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';

    const item = await this.service.getById(id);
    const serialized = this.serializer.serializeIngestionRun(item);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  get = this.show;

  trigger = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = (
      'body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json().catch(() => ({}))
    ) as TriggerIngestRequestDto;

    const run = await this.service.trigger(body);
    const serialized = this.serializer.serializeIngestionRun(run);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized, `/api/v1/admin/ingest/runs/${run.ingestionRunId}`)
      : c.json({ success: true, data: serialized }, 201);
  };
}

export const adminIngestionController = new AdminIngestionController();
