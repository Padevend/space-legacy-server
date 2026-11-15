import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { PersonService, personService } from '../services/person_service.js';
import { PersonSerializer, personSerializer } from '../serializers/person_serializer.js';
import { listPeopleQuerySchema } from '../validators/person.js';

export class PersonController {
  constructor(
    private readonly service: PersonService = personService,
    private readonly serializer: PersonSerializer = personSerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listPeopleQuerySchema.parse(rawQuery);

    const result = await this.service.list(query);
    const serialized = this.serializer.serializePersonList(result.items);

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
    const person = await this.service.getById(id);
    const serialized = this.serializer.serializePerson(person);
    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  get = this.show;
}

export const personController = new PersonController();
