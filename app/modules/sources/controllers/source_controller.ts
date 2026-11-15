import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { SourceService, sourceService } from '../services/source_service.js';
import { SourceSerializer, sourceSerializer } from '../serializers/source_serializer.js';
import { listSourcesQuerySchema } from '../validators/source.js';

export class SourceController {
  constructor(
    private readonly service: SourceService = sourceService,
    private readonly serializer: SourceSerializer = sourceSerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listSourcesQuerySchema.parse(rawQuery);

    const result = await this.service.list(query);
    const serialized = this.serializer.serializeSourceList(result.items);

    return 'response' in ctxOrC
      ? ctxOrC.response.paginated(c, serialized, {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
        })
      : c.json(
          {
            success: true,
            data: serialized,
            meta: { page: result.page, pageSize: result.pageSize, total: result.total },
          },
          200
        );
  };

  list = this.index;

  show = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const source = await this.service.getById(id);
    const serialized = this.serializer.serializeSource(source);
    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  get = this.show;
}

export const sourceController = new SourceController();
