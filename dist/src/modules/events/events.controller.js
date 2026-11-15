import { eventsService } from './events.service.js';
import { eventsSerializer } from './events.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import { listEventsQuerySchema, getEventQuerySchema, } from './events.schemas.js';
export class EventsController {
    service;
    serializer;
    constructor(service = eventsService, serializer = eventsSerializer) {
        this.service = service;
        this.serializer = serializer;
    }
    list = async (c) => {
        const rawQuery = c.req.query();
        const query = listEventsQuerySchema.parse(rawQuery);
        const { events, total } = await this.service.list(query);
        const data = events.map((ev) => this.serializer.serializeEvent(ev));
        return paginated(c, data, {
            page: query.page ?? 1,
            pageSize: query.pageSize ?? 20,
            total,
        });
    };
    get = async (c) => {
        const id = c.req.param('id');
        const rawQuery = c.req.query();
        const query = getEventQuerySchema.parse(rawQuery);
        const event = await this.service.getByIdWithIncludes(id, query.include);
        const serialized = this.serializer.serializeEventDetail(event);
        return ok(c, serialized);
    };
    create = async (c) => {
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const event = await this.service.create(body, { actorId, requestId });
        const serialized = this.serializer.serializeEvent(event);
        return created(c, serialized, `/api/v1/events/${event.eventId}`);
    };
    update = async (c) => {
        const id = c.req.param('id');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const updated = await this.service.update(id, body, { actorId, requestId });
        const serialized = this.serializer.serializeEvent(updated);
        return ok(c, serialized);
    };
    delete = async (c) => {
        const user = c.get('user');
        if (!user || user.role !== 'ADMIN') {
            throw AppException.forbidden('Admin role required to delete an event.');
        }
        const id = c.req.param('id');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.delete(id, { actorId, requestId });
        return ok(c, { message: 'Event deleted successfully.' });
    };
    // Relations
    linkEquipment = async (c) => {
        const id = c.req.param('id');
        const equipmentId = c.req.param('equipmentId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkEquipment(id, equipmentId, body.roleInEvent, body.description, {
            actorId,
            requestId,
        });
        return ok(c, { message: 'Equipment linked to event successfully.' });
    };
    unlinkEquipment = async (c) => {
        const id = c.req.param('id');
        const equipmentId = c.req.param('equipmentId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkEquipment(id, equipmentId, { actorId, requestId });
        return ok(c, { message: 'Equipment unlinked from event successfully.' });
    };
    linkLocation = async (c) => {
        const id = c.req.param('id');
        const locationId = c.req.param('locationId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkLocation(id, locationId, body.locationRole, { actorId, requestId });
        return ok(c, { message: 'Location linked to event successfully.' });
    };
    unlinkLocation = async (c) => {
        const id = c.req.param('id');
        const locationId = c.req.param('locationId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkLocation(id, locationId, { actorId, requestId });
        return ok(c, { message: 'Location unlinked from event successfully.' });
    };
    linkPerson = async (c) => {
        const id = c.req.param('id');
        const personId = c.req.param('personId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkPerson(id, personId, body.roleInEvent ?? 'Participant', { actorId, requestId });
        return ok(c, { message: 'Person linked to event successfully.' });
    };
    unlinkPerson = async (c) => {
        const id = c.req.param('id');
        const personId = c.req.param('personId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkPerson(id, personId, { actorId, requestId });
        return ok(c, { message: 'Person unlinked from event successfully.' });
    };
    linkSource = async (c) => {
        const id = c.req.param('id');
        const sourceId = c.req.param('sourceId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkSource(id, sourceId, body.claimDescription, { actorId, requestId });
        return ok(c, { message: 'Source linked to event successfully.' });
    };
    unlinkSource = async (c) => {
        const id = c.req.param('id');
        const sourceId = c.req.param('sourceId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkSource(id, sourceId, { actorId, requestId });
        return ok(c, { message: 'Source unlinked from event successfully.' });
    };
}
export const eventsController = new EventsController();
