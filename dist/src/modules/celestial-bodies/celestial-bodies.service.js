import { celestialBodiesRepository } from './celestial-bodies.repository.js';
import { AppException } from '../../core/exceptions/AppException.js';
export class CelestialBodiesService {
    repo;
    constructor(repo = celestialBodiesRepository) {
        this.repo = repo;
    }
    async list(query) {
        const page = query.page;
        const pageSize = query.pageSize;
        const skip = (page - 1) * pageSize;
        const [items, total] = await Promise.all([
            this.repo.findMany({
                skip,
                take: pageSize,
                search: query.search,
                bodyType: query.bodyType,
                orderByField: query.sort,
                orderDirection: query.order,
            }),
            this.repo.count({
                search: query.search,
                bodyType: query.bodyType,
            }),
        ]);
        const totalPages = Math.ceil(total / pageSize) || 1;
        return {
            items,
            total,
            page,
            pageSize,
            totalPages,
        };
    }
    async getById(id) {
        const body = await this.repo.findById(id);
        if (!body) {
            throw AppException.notFound('CelestialBody', `Celestial body with ID '${id}' not found.`);
        }
        return body;
    }
    async create(dto, context) {
        const existing = await this.repo.findByName(dto.name);
        if (existing) {
            throw AppException.conflict(`Celestial body with name '${dto.name}' already exists.`);
        }
        const created = await this.repo.create({
            name: dto.name,
            bodyType: dto.bodyType,
            ...(dto.description !== undefined && { description: dto.description }),
        });
        await this.repo.createAuditLog({
            actorId: context.actorId,
            action: 'CELESTIAL_BODY_CREATED',
            entity: 'CelestialBody',
            entityId: created.celestialBodyId,
            requestId: context.requestId,
            diffSummary: { name: created.name, bodyType: created.bodyType },
        });
        return created;
    }
    async update(id, dto, context) {
        await this.getById(id);
        if (dto.name) {
            const existing = await this.repo.findByName(dto.name);
            if (existing && existing.celestialBodyId !== id) {
                throw AppException.conflict(`Celestial body with name '${dto.name}' already exists.`);
            }
        }
        const updated = await this.repo.update(id, {
            ...(dto.name !== undefined && { name: dto.name }),
            ...(dto.bodyType !== undefined && { bodyType: dto.bodyType }),
            ...(dto.description !== undefined && { description: dto.description }),
        });
        await this.repo.createAuditLog({
            actorId: context.actorId,
            action: 'CELESTIAL_BODY_UPDATED',
            entity: 'CelestialBody',
            entityId: updated.celestialBodyId,
            requestId: context.requestId,
            diffSummary: { name: updated.name, bodyType: updated.bodyType },
        });
        return updated;
    }
    async delete(id, context) {
        const body = await this.getById(id);
        await this.repo.delete(id);
        await this.repo.createAuditLog({
            actorId: context.actorId,
            action: 'CELESTIAL_BODY_DELETED',
            entity: 'CelestialBody',
            entityId: id,
            requestId: context.requestId,
            diffSummary: { deletedName: body.name },
        });
    }
}
export const celestialBodiesService = new CelestialBodiesService();
