import type { Context } from 'hono';
import { peopleService, type PeopleService } from './people.service.js';
import { peopleSerializer, type PeopleSerializer } from './people.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import { listPeopleQuerySchema, type CreatePersonRequestDto, type UpdatePersonRequestDto } from './people.schemas.js';

export class PeopleController {
  constructor(
    private readonly service: PeopleService = peopleService,
    private readonly serializer: PeopleSerializer = peopleSerializer
  ) {}

  list = async (c: Context): Promise<Response> => {
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

  get = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const person = await this.service.getById(id);
    const serialized = this.serializer.serializePerson(person);
    return ok(c, serialized);
  };

  create = async (c: Context): Promise<Response> => {
    const body = (await c.req.json()) as CreatePersonRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const result = await this.service.create(body, { actorId, requestId });
    const serialized = this.serializer.serializePerson(result);

    return created(c, serialized, `/api/v1/people/${result.personId}`);
  };

  update = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const body = (await c.req.json()) as UpdatePersonRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const updated = await this.service.update(id, body, { actorId, requestId });
    const serialized = this.serializer.serializePerson(updated);

    return ok(c, serialized);
  };

  delete = async (c: Context): Promise<Response> => {
    const user = c.get('user');
    if (!user || user.role !== 'ADMIN') {
      throw AppException.forbidden('Admin role required to delete a person.');
    }
    const id = c.req.param('id') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.delete(id, { actorId, requestId });
    return ok(c, { message: 'Person deleted successfully.' });
  };
}

export const peopleController = new PeopleController();
