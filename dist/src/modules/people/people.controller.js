import { peopleService } from './people.service.js';
import { peopleSerializer } from './people.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import { listPeopleQuerySchema } from './people.schemas.js';
export class PeopleController {
    service;
    serializer;
    constructor(service = peopleService, serializer = peopleSerializer) {
        this.service = service;
        this.serializer = serializer;
    }
    list = async (c) => {
        const rawQuery = c.req.query();
        const query = listPeopleQuerySchema.parse(rawQuery);
        const result = await this.service.list(query);
        const serialized = this.serializer.serializePersonList(result.items);
        return paginated(c, serialized, {
            page: result.page,
            pageSize: result.pageSize,
            total: result.total,
        });
    };
    get = async (c) => {
        const id = c.req.param('id');
        const person = await this.service.getById(id);
        const serialized = this.serializer.serializePerson(person);
        return ok(c, serialized);
    };
    create = async (c) => {
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const result = await this.service.create(body, { actorId, requestId });
        const serialized = this.serializer.serializePerson(result);
        return created(c, serialized, `/api/v1/people/${result.personId}`);
    };
    update = async (c) => {
        const id = c.req.param('id');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const updated = await this.service.update(id, body, { actorId, requestId });
        const serialized = this.serializer.serializePerson(updated);
        return ok(c, serialized);
    };
    delete = async (c) => {
        const user = c.get('user');
        if (!user || user.role !== 'ADMIN') {
            throw AppException.forbidden('Admin role required to delete a person.');
        }
        const id = c.req.param('id');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.delete(id, { actorId, requestId });
        return ok(c, { message: 'Person deleted successfully.' });
    };
}
export const peopleController = new PeopleController();
