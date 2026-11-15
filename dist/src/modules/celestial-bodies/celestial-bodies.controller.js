import { celestialBodiesService } from './celestial-bodies.service.js';
import { celestialBodiesSerializer } from './celestial-bodies.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import { listCelestialBodiesQuerySchema, } from './celestial-bodies.schemas.js';
export class CelestialBodiesController {
    service;
    serializer;
    constructor(service = celestialBodiesService, serializer = celestialBodiesSerializer) {
        this.service = service;
        this.serializer = serializer;
    }
    list = async (c) => {
        const rawQuery = c.req.query();
        const query = listCelestialBodiesQuerySchema.parse(rawQuery);
        const result = await this.service.list(query);
        const serialized = this.serializer.serializeCelestialBodyList(result.items);
        return paginated(c, serialized, {
            page: result.page,
            pageSize: result.pageSize,
            total: result.total,
        });
    };
    get = async (c) => {
        const id = c.req.param('id');
        const body = await this.service.getById(id);
        const serialized = this.serializer.serializeCelestialBody(body);
        return ok(c, serialized);
    };
    create = async (c) => {
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const result = await this.service.create(body, { actorId, requestId });
        const serialized = this.serializer.serializeCelestialBody(result);
        return created(c, serialized, `/api/v1/celestial-bodies/${result.celestialBodyId}`);
    };
    update = async (c) => {
        const id = c.req.param('id');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const updated = await this.service.update(id, body, { actorId, requestId });
        const serialized = this.serializer.serializeCelestialBody(updated);
        return ok(c, serialized);
    };
    delete = async (c) => {
        const user = c.get('user');
        if (!user || user.role !== 'ADMIN') {
            throw AppException.forbidden('Admin role required to delete a celestial body.');
        }
        const id = c.req.param('id');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.delete(id, { actorId, requestId });
        return ok(c, { message: 'Celestial body deleted successfully.' });
    };
}
export const celestialBodiesController = new CelestialBodiesController();
