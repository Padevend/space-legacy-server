import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { EventService, eventService } from '../services/event_service.js';
import { EventSerializer, eventSerializer } from '../serializers/event_serializer.js';
import { listEventsQuerySchema, getEventQuerySchema } from '../validators/event.js';

export class EventController {
  constructor(
    private readonly service: EventService = eventService,
    private readonly serializer: EventSerializer = eventSerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listEventsQuerySchema.parse(rawQuery);

    const { events, total } = await this.service.list(query);
    const data = events.map((e) => this.serializer.serializeEvent(e));

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
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = getEventQuerySchema.parse(rawQuery);

    const item = await this.service.getByIdWithIncludes(id, query.include);
    const serialized = this.serializer.serializeEventDetail(item);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  get = this.show;
}

export const eventController = new EventController();
