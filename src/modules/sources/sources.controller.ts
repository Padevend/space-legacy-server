import type { Context } from 'hono';
import { sourcesService, type SourcesService } from './sources.service.js';
import { sourcesSerializer, type SourcesSerializer } from './sources.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import { listSourcesQuerySchema, type CreateSourceRequestDto, type UpdateSourceRequestDto } from './sources.schemas.js';

export class SourcesController {
  constructor(
    private readonly service: SourcesService = sourcesService,
    private readonly serializer: SourcesSerializer = sourcesSerializer
  ) {}

  list = async (c: Context): Promise<Response> => {
    const rawQuery = c.req.query();
    const query = listSourcesQuerySchema.parse(rawQuery);

    const result = await this.service.list(query);
    const serialized = this.serializer.serializeSourceList(result.items);

    return paginated(c, serialized, {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
    });
  };

  get = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const source = await this.service.getById(id);
    const serialized = this.serializer.serializeSource(source);
    return ok(c, serialized);
  };

  create = async (c: Context): Promise<Response> => {
    const body = (await c.req.json()) as CreateSourceRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const result = await this.service.create(body, { actorId, requestId });
    const serialized = this.serializer.serializeSource(result);

    return created(c, serialized, `/api/v1/sources/${result.sourceId}`);
  };

  update = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const body = (await c.req.json()) as UpdateSourceRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const updated = await this.service.update(id, body, { actorId, requestId });
    const serialized = this.serializer.serializeSource(updated);

    return ok(c, serialized);
  };

  delete = async (c: Context): Promise<Response> => {
    const user = c.get('user');
    if (!user || user.role !== 'ADMIN') {
      throw AppException.forbidden('Admin role required to delete a source.');
    }
    const id = c.req.param('id') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.delete(id, { actorId, requestId });
    return ok(c, { message: 'Source deleted successfully.' });
  };
}

export const sourcesController = new SourcesController();
