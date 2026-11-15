import { equipmentService } from './equipment.service.js';
import { equipmentSerializer } from './equipment.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import { listEquipmentQuerySchema, getEquipmentQuerySchema, } from './equipment.schemas.js';
export class EquipmentController {
    service;
    serializer;
    constructor(service = equipmentService, serializer = equipmentSerializer) {
        this.service = service;
        this.serializer = serializer;
    }
    list = async (c) => {
        const rawQuery = c.req.query();
        const query = listEquipmentQuerySchema.parse(rawQuery);
        const { equipment, total } = await this.service.list(query);
        const data = equipment.map((e) => this.serializer.serializeEquipment(e));
        return paginated(c, data, {
            page: query.page ?? 1,
            pageSize: query.pageSize ?? 20,
            total,
        });
    };
    get = async (c) => {
        const idOrSlug = c.req.param('idOrSlug');
        const rawQuery = c.req.query();
        const query = getEquipmentQuerySchema.parse(rawQuery);
        const item = await this.service.getByIdOrSlug(idOrSlug, query.include);
        const serialized = this.serializer.serializeEquipmentDetail(item);
        return ok(c, serialized);
    };
    create = async (c) => {
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const item = await this.service.create(body, { actorId, requestId });
        const serialized = this.serializer.serializeEquipment(item);
        return created(c, serialized, `/api/v1/equipment/${item.slug}`);
    };
    update = async (c) => {
        const id = c.req.param('id');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const updated = await this.service.update(id, body, { actorId, requestId });
        const serialized = this.serializer.serializeEquipment(updated);
        return ok(c, serialized);
    };
    delete = async (c) => {
        const user = c.get('user');
        if (!user || user.role !== 'ADMIN') {
            throw AppException.forbidden('Admin role required to delete equipment.');
        }
        const id = c.req.param('id');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.delete(id, { actorId, requestId });
        return ok(c, { message: 'Equipment deleted successfully.' });
    };
    // Sub-resources
    getChildren = async (c) => {
        const idOrSlug = c.req.param('idOrSlug');
        const children = await this.service.getChildren(idOrSlug);
        const data = children.map((ch) => this.serializer.serializeEquipment(ch));
        return ok(c, data);
    };
    getEvents = async (c) => {
        const idOrSlug = c.req.param('idOrSlug');
        const events = await this.service.getEvents(idOrSlug);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = events.map((ev) => ({
            eventId: ev.eventId,
            title: ev.event?.title ?? '',
            eventType: ev.event?.eventType ?? '',
            eventDate: ev.event?.eventDate ? ev.event.eventDate.toISOString().split('T')[0] : null,
            roleInEvent: ev.roleInEvent ?? null,
            description: ev.description ?? null,
        }));
        return ok(c, data);
    };
    getLocations = async (c) => {
        const idOrSlug = c.req.param('idOrSlug');
        const locations = await this.service.getLocations(idOrSlug);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = locations.map((loc) => ({
            equipmentLocationId: loc.equipmentLocationId,
            locationId: loc.locationId,
            name: loc.location?.name ?? '',
            latitude: loc.location?.latitude ? Number(loc.location.latitude) : null,
            longitude: loc.location?.longitude ? Number(loc.location.longitude) : null,
            startDate: loc.startDate ? loc.startDate.toISOString().split('T')[0] : null,
            endDate: loc.endDate ? loc.endDate.toISOString().split('T')[0] : null,
            locationPrecision: loc.locationPrecision,
        }));
        return ok(c, data);
    };
    getMeasurements = async (c) => {
        const idOrSlug = c.req.param('idOrSlug');
        const measurements = await this.service.getMeasurements(idOrSlug);
        const data = measurements.map((m) => ({
            measurementId: m.measurementId,
            name: m.name,
            value: m.value.toString(),
            unit: m.unit,
            measurementType: m.measurementType,
            context: m.context,
            measurementDate: m.measurementDate ? m.measurementDate.toISOString() : null,
            isApproximate: m.isApproximate,
            uncertainty: m.uncertainty ? m.uncertainty.toString() : null,
        }));
        return ok(c, data);
    };
    getMedia = async (c) => {
        const idOrSlug = c.req.param('idOrSlug');
        const media = await this.service.getMedia(idOrSlug);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = media.map((m) => ({
            mediaId: m.mediaId,
            title: m.media?.title ?? '',
            mediaType: m.media?.mediaType ?? '',
            url: m.media?.url ?? '',
            thumbnailUrl: m.media?.thumbnailUrl ?? null,
            provenanceType: m.media?.provenanceType ?? '',
            requiresAiLabel: m.media?.provenanceType === 'AI_GENERATED_ILLUSTRATION',
        }));
        return ok(c, data);
    };
    getSources = async (c) => {
        const idOrSlug = c.req.param('idOrSlug');
        const sources = await this.service.getSources(idOrSlug);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = sources.map((s) => ({
            sourceId: s.sourceId,
            title: s.source?.title ?? '',
            url: s.source?.url ?? '',
            publisher: s.source?.publisher ?? '',
            claimDescription: s.claimDescription ?? null,
        }));
        return ok(c, data);
    };
    // Relations
    linkMission = async (c) => {
        const id = c.req.param('id');
        const missionId = c.req.param('missionId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkMission(id, missionId, body.missionRole, body.participationDescription, {
            actorId,
            requestId,
        });
        return ok(c, { message: 'Equipment linked to mission successfully.' });
    };
    unlinkMission = async (c) => {
        const id = c.req.param('id');
        const missionId = c.req.param('missionId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkMission(id, missionId, { actorId, requestId });
        return ok(c, { message: 'Equipment unlinked from mission successfully.' });
    };
    linkLocation = async (c) => {
        const id = c.req.param('id');
        const locationId = c.req.param('locationId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkLocation(id, locationId, body.startDate, body.endDate, body.locationPrecision, {
            actorId,
            requestId,
        });
        return ok(c, { message: 'Location linked to equipment successfully.' });
    };
    unlinkLocation = async (c) => {
        const equipmentLocationId = c.req.param('equipmentLocationId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkLocation(equipmentLocationId, { actorId, requestId });
        return ok(c, { message: 'Equipment location removed successfully.' });
    };
    linkPerson = async (c) => {
        const id = c.req.param('id');
        const personId = c.req.param('personId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkPerson(id, personId, body.roleInEquipment, { actorId, requestId });
        return ok(c, { message: 'Person linked to equipment successfully.' });
    };
    unlinkPerson = async (c) => {
        const id = c.req.param('id');
        const personId = c.req.param('personId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkPerson(id, personId, { actorId, requestId });
        return ok(c, { message: 'Person unlinked from equipment successfully.' });
    };
    linkSource = async (c) => {
        const id = c.req.param('id');
        const sourceId = c.req.param('sourceId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkSource(id, sourceId, body.claimDescription, { actorId, requestId });
        return ok(c, { message: 'Source linked to equipment successfully.' });
    };
    unlinkSource = async (c) => {
        const id = c.req.param('id');
        const sourceId = c.req.param('sourceId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkSource(id, sourceId, { actorId, requestId });
        return ok(c, { message: 'Source unlinked from equipment successfully.' });
    };
}
export const equipmentController = new EquipmentController();
