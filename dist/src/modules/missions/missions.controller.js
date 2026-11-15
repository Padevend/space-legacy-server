import { missionsService } from './missions.service.js';
import { missionsSerializer } from './missions.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import { listMissionsQuerySchema, getMissionQuerySchema, } from './missions.schemas.js';
export class MissionsController {
    service;
    serializer;
    constructor(service = missionsService, serializer = missionsSerializer) {
        this.service = service;
        this.serializer = serializer;
    }
    list = async (c) => {
        const rawQuery = c.req.query();
        const query = listMissionsQuerySchema.parse(rawQuery);
        const { missions, total } = await this.service.list(query);
        const data = missions.map((m) => this.serializer.serializeMission(m));
        return paginated(c, data, {
            page: query.page ?? 1,
            pageSize: query.pageSize ?? 20,
            total,
        });
    };
    get = async (c) => {
        const idOrSlug = c.req.param('idOrSlug');
        const rawQuery = c.req.query();
        const query = getMissionQuerySchema.parse(rawQuery);
        const mission = await this.service.getByIdOrSlug(idOrSlug, query.include);
        const serialized = this.serializer.serializeMissionDetail(mission);
        return ok(c, serialized);
    };
    getById = async (c) => {
        const id = c.req.param('id');
        const mission = await this.service.getById(id);
        const serialized = this.serializer.serializeMission(mission);
        return ok(c, serialized);
    };
    create = async (c) => {
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const mission = await this.service.create(body, { actorId, requestId });
        const serialized = this.serializer.serializeMission(mission);
        return created(c, serialized, `/api/v1/missions/${mission.slug}`);
    };
    update = async (c) => {
        const id = c.req.param('id');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const updated = await this.service.update(id, body, { actorId, requestId });
        const serialized = this.serializer.serializeMission(updated);
        return ok(c, serialized);
    };
    delete = async (c) => {
        const user = c.get('user');
        if (!user || user.role !== 'ADMIN') {
            throw AppException.forbidden('Admin role required to delete a mission.');
        }
        const id = c.req.param('id');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.delete(id, { actorId, requestId });
        return ok(c, { message: 'Mission deleted successfully.' });
    };
    // Relations
    linkPerson = async (c) => {
        const id = c.req.param('id');
        const personId = c.req.param('personId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkPerson(id, personId, body.roleInMission, { actorId, requestId });
        return ok(c, { message: 'Person linked to mission successfully.' });
    };
    unlinkPerson = async (c) => {
        const id = c.req.param('id');
        const personId = c.req.param('personId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkPerson(id, personId, { actorId, requestId });
        return ok(c, { message: 'Person unlinked from mission successfully.' });
    };
    linkSource = async (c) => {
        const id = c.req.param('id');
        const sourceId = c.req.param('sourceId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkSource(id, sourceId, body.claimDescription, { actorId, requestId });
        return ok(c, { message: 'Source linked to mission successfully.' });
    };
    unlinkSource = async (c) => {
        const id = c.req.param('id');
        const sourceId = c.req.param('sourceId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkSource(id, sourceId, { actorId, requestId });
        return ok(c, { message: 'Source unlinked from mission successfully.' });
    };
    linkEquipment = async (c) => {
        const id = c.req.param('id');
        const equipmentId = c.req.param('equipmentId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkEquipment(id, equipmentId, body.missionRole, body.participationDescription, {
            actorId,
            requestId,
        });
        return ok(c, { message: 'Equipment linked to mission successfully.' });
    };
    unlinkEquipment = async (c) => {
        const id = c.req.param('id');
        const equipmentId = c.req.param('equipmentId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkEquipment(id, equipmentId, { actorId, requestId });
        return ok(c, { message: 'Equipment unlinked from mission successfully.' });
    };
}
export const missionsController = new MissionsController();
