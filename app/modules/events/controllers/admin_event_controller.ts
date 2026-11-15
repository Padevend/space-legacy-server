import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { EventService, eventService } from '../services/event_service.js';
import { EventSerializer, eventSerializer } from '../serializers/event_serializer.js';
import {
  type CreateEventRequestDto,
  type UpdateEventRequestDto,
  type LinkEventEquipmentRequestDto,
  type LinkEventLocationRequestDto,
} from '../validators/event.js';

export class AdminEventController {
  constructor(
    private readonly service: EventService = eventService,
    private readonly serializer: EventSerializer = eventSerializer
  ) {}

  store = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as CreateEventRequestDto;

    const event = await this.service.create(body);
    const serialized = this.serializer.serializeEvent(event);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized, `/api/v1/events/${event.eventId}`)
      : c.json({ success: true, data: serialized }, 201);
  };

  create = this.store;

  update = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as UpdateEventRequestDto;

    const updated = await this.service.update(id, body);
    const serialized = this.serializer.serializeEvent(updated);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  destroy = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';

    await this.service.delete(id);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Event deleted successfully.' })
      : c.json({ success: true, data: { message: 'Event deleted successfully.' } }, 200);
  };

  delete = this.destroy;

  // Equipment links
  linkEquipment = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const eventId = (('params' in ctxOrC && ctxOrC.params['eventId']) || c.req.param('eventId')) ?? '';
    const equipmentId = (('params' in ctxOrC && ctxOrC.params['equipmentId']) || c.req.param('equipmentId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkEventEquipmentRequestDto;

    const link = await this.service.linkEquipment(eventId, equipmentId, body);
    const serialized = this.serializer.serializeEventEquipment(link);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  unlinkEquipment = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const eventId = (('params' in ctxOrC && ctxOrC.params['eventId']) || c.req.param('eventId')) ?? '';
    const equipmentId = (('params' in ctxOrC && ctxOrC.params['equipmentId']) || c.req.param('equipmentId')) ?? '';

    await this.service.unlinkEquipment(eventId, equipmentId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Equipment unlinked from event successfully.' })
      : c.json({ success: true, data: { message: 'Equipment unlinked from event successfully.' } }, 200);
  };

  // Location links
  linkLocation = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const eventId = (('params' in ctxOrC && ctxOrC.params['eventId']) || c.req.param('eventId')) ?? '';
    const locationId = (('params' in ctxOrC && ctxOrC.params['locationId']) || c.req.param('locationId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkEventLocationRequestDto;

    const link = await this.service.linkLocation(eventId, locationId, body);
    const serialized = this.serializer.serializeEventLocation(link);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  unlinkLocation = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const eventId = (('params' in ctxOrC && ctxOrC.params['eventId']) || c.req.param('eventId')) ?? '';
    const locationId = (('params' in ctxOrC && ctxOrC.params['locationId']) || c.req.param('locationId')) ?? '';

    await this.service.unlinkLocation(eventId, locationId);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Location unlinked from event successfully.' })
      : c.json({ success: true, data: { message: 'Location unlinked from event successfully.' } }, 200);
  };
}

export const adminEventController = new AdminEventController();
