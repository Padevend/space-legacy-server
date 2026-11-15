import { missionsRepository } from './missions.repository.js';
import { AppException } from '../../core/exceptions/AppException.js';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_INCLUDES = ['equipment', 'people', 'sources'];
export class MissionsService {
    repository;
    constructor(repository = missionsRepository) {
        this.repository = repository;
    }
    async list(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;
        const skip = (page - 1) * pageSize;
        const listParams = {
            skip,
            take: pageSize,
            search: query.search,
            missionStatus: query.missionStatus,
            agency: query.agency,
            orderByField: (query.orderBy ?? 'name'),
            orderDirection: (query.order ?? 'asc'),
        };
        const [missions, total] = await Promise.all([
            this.repository.findMany(listParams),
            this.repository.count(listParams),
        ]);
        return { missions, total };
    }
    async getByIdOrSlug(idOrSlug, includeParam) {
        const isUuid = UUID_REGEX.test(idOrSlug);
        // Validate includes
        const includes = {
            equipment: false,
            people: false,
            sources: false,
        };
        if (includeParam) {
            const parts = includeParam.split(',').map((p) => p.trim());
            if (parts.length > 3) {
                throw AppException.unprocessable('Maximum of 3 include relations allowed.');
            }
            for (const part of parts) {
                if (part.includes('.')) {
                    throw AppException.unprocessable('Nested includes deeper than one level are not supported.');
                }
                if (!ALLOWED_INCLUDES.includes(part)) {
                    throw AppException.unprocessable(`Invalid include relation: '${part}'. Allowed: ${ALLOWED_INCLUDES.join(', ')}`);
                }
                if (part === 'equipment')
                    includes.equipment = true;
                if (part === 'people')
                    includes.people = true;
                if (part === 'sources')
                    includes.sources = true;
            }
        }
        const mission = await this.repository.findByIdOrSlugWithIncludes(idOrSlug, isUuid, includes);
        if (!mission) {
            throw AppException.notFound(`Mission '${idOrSlug}' not found.`);
        }
        return mission;
    }
    async getById(missionId) {
        const mission = await this.repository.findById(missionId);
        if (!mission) {
            throw AppException.notFound(`Mission with ID '${missionId}' not found.`);
        }
        return mission;
    }
    async create(data, ctx) {
        const existingSlug = await this.repository.findBySlug(data.slug);
        if (existingSlug) {
            throw AppException.conflict(`Mission with slug '${data.slug}' already exists.`);
        }
        const created = await this.repository.create(data);
        await this.repository.createAuditLog({
            actorId: ctx.actorId,
            action: 'CREATE',
            entity: 'Mission',
            entityId: created.missionId,
            requestId: ctx.requestId,
            diffSummary: { slug: created.slug, name: created.name },
        });
        return created;
    }
    async update(missionId, data, ctx) {
        const existing = await this.getById(missionId);
        if (data.slug && data.slug !== existing.slug) {
            const slugOwner = await this.repository.findBySlug(data.slug);
            if (slugOwner && slugOwner.missionId !== missionId) {
                throw AppException.conflict(`Mission with slug '${data.slug}' already exists.`);
            }
        }
        const updated = await this.repository.update(missionId, data);
        await this.repository.createAuditLog({
            actorId: ctx.actorId,
            action: 'UPDATE',
            entity: 'Mission',
            entityId: updated.missionId,
            requestId: ctx.requestId,
            diffSummary: { updatedFields: Object.keys(data) },
        });
        return updated;
    }
    async delete(missionId, ctx) {
        const existing = await this.getById(missionId);
        try {
            const deleted = await this.repository.delete(missionId);
            await this.repository.createAuditLog({
                actorId: ctx.actorId,
                action: 'DELETE',
                entity: 'Mission',
                entityId: existing.missionId,
                requestId: ctx.requestId,
                diffSummary: { slug: existing.slug, name: existing.name },
            });
            return deleted;
        }
        catch (err) {
            if (err instanceof Error && 'code' in err && err.code === 'P2003') {
                throw AppException.conflict('Cannot delete mission with active associated events or equipment.');
            }
            throw err;
        }
    }
    // Relations
    async linkPerson(missionId, personId, roleInMission, ctx) {
        await this.getById(missionId);
        const link = await this.repository.linkPerson(missionId, personId, roleInMission);
        await this.repository.createAuditLog({
            actorId: ctx.actorId,
            action: 'LINK_PERSON',
            entity: 'MissionPerson',
            entityId: `${missionId}:${personId}`,
            requestId: ctx.requestId,
            diffSummary: { roleInMission },
        });
        return link;
    }
    async unlinkPerson(missionId, personId, ctx) {
        await this.getById(missionId);
        try {
            await this.repository.unlinkPerson(missionId, personId);
            await this.repository.createAuditLog({
                actorId: ctx.actorId,
                action: 'UNLINK_PERSON',
                entity: 'MissionPerson',
                entityId: `${missionId}:${personId}`,
                requestId: ctx.requestId,
            });
        }
        catch {
            throw AppException.notFound(`Link between mission '${missionId}' and person '${personId}' not found.`);
        }
    }
    async linkSource(missionId, sourceId, claimDescription, ctx = {}) {
        await this.getById(missionId);
        const link = await this.repository.linkSource(missionId, sourceId, claimDescription);
        await this.repository.createAuditLog({
            actorId: ctx.actorId,
            action: 'LINK_SOURCE',
            entity: 'MissionSource',
            entityId: `${missionId}:${sourceId}`,
            requestId: ctx.requestId,
            diffSummary: { claimDescription: claimDescription ?? null },
        });
        return link;
    }
    async unlinkSource(missionId, sourceId, ctx) {
        await this.getById(missionId);
        try {
            await this.repository.unlinkSource(missionId, sourceId);
            await this.repository.createAuditLog({
                actorId: ctx.actorId,
                action: 'UNLINK_SOURCE',
                entity: 'MissionSource',
                entityId: `${missionId}:${sourceId}`,
                requestId: ctx.requestId,
            });
        }
        catch {
            throw AppException.notFound(`Link between mission '${missionId}' and source '${sourceId}' not found.`);
        }
    }
    async linkEquipment(missionId, equipmentId, missionRole, participationDescription, ctx = {}) {
        await this.getById(missionId);
        const link = await this.repository.linkEquipment(missionId, equipmentId, missionRole, participationDescription);
        await this.repository.createAuditLog({
            actorId: ctx.actorId,
            action: 'LINK_EQUIPMENT',
            entity: 'MissionEquipment',
            entityId: `${missionId}:${equipmentId}`,
            requestId: ctx.requestId,
            diffSummary: { missionRole, participationDescription: participationDescription ?? null },
        });
        return link;
    }
    async unlinkEquipment(missionId, equipmentId, ctx = {}) {
        await this.getById(missionId);
        try {
            await this.repository.unlinkEquipment(missionId, equipmentId);
            await this.repository.createAuditLog({
                actorId: ctx.actorId,
                action: 'UNLINK_EQUIPMENT',
                entity: 'MissionEquipment',
                entityId: `${missionId}:${equipmentId}`,
                requestId: ctx.requestId,
            });
        }
        catch {
            throw AppException.notFound(`Link between mission '${missionId}' and equipment '${equipmentId}' not found.`);
        }
    }
}
export const missionsService = new MissionsService();
