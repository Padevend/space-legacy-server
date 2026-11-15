import { sourcesService } from './sources.service.js';
import { sourcesSerializer } from './sources.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import { listSourcesQuerySchema } from './sources.schemas.js';
export class SourcesController {
    service;
    serializer;
    constructor(service = sourcesService, serializer = sourcesSerializer) {
        this.service = service;
        this.serializer = serializer;
    }
    list = async (c) => {
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
    get = async (c) => {
        const id = c.req.param('id');
        const source = await this.service.getById(id);
        const serialized = this.serializer.serializeSource(source);
        return ok(c, serialized);
    };
    create = async (c) => {
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const result = await this.service.create(body, { actorId, requestId });
        const serialized = this.serializer.serializeSource(result);
        return created(c, serialized, `/api/v1/sources/${result.sourceId}`);
    };
    update = async (c) => {
        const id = c.req.param('id');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const updated = await this.service.update(id, body, { actorId, requestId });
        const serialized = this.serializer.serializeSource(updated);
        return ok(c, serialized);
    };
    delete = async (c) => {
        const user = c.get('user');
        if (!user || user.role !== 'ADMIN') {
            throw AppException.forbidden('Admin role required to delete a source.');
        }
        const id = c.req.param('id');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.delete(id, { actorId, requestId });
        return ok(c, { message: 'Source deleted successfully.' });
    };
}
export const sourcesController = new SourcesController();
