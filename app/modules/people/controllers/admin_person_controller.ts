import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { PersonService, personService } from '../services/person_service.js';
import { PersonSerializer, personSerializer } from '../serializers/person_serializer.js';
import { type CreatePersonRequestDto, type UpdatePersonRequestDto } from '../validators/person.js';

export class AdminPersonController {
  constructor(
    private readonly service: PersonService = personService,
    private readonly serializer: PersonSerializer = personSerializer
  ) {}

  store = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as CreatePersonRequestDto;

    const createdItem = await this.service.create(body);
    const serialized = this.serializer.serializePerson(createdItem);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized, `/api/v1/people/${createdItem.personId}`)
      : c.json({ success: true, data: serialized }, 201);
  };

  create = this.store;

  update = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as UpdatePersonRequestDto;

    const updated = await this.service.update(id, body);
    const serialized = this.serializer.serializePerson(updated);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  destroy = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';

    await this.service.delete(id);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Person deleted successfully.' })
      : c.json({ success: true, data: { message: 'Person deleted successfully.' } }, 200);
  };

  delete = this.destroy;
}

export const adminPersonController = new AdminPersonController();
