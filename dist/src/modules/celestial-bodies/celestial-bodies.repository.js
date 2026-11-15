import { prisma } from '../../core/database/prisma.js';
export class CelestialBodiesRepository {
    buildWhere(params) {
        const where = {};
        if (params.search) {
            where.name = {
                contains: params.search,
                mode: 'insensitive',
            };
        }
        if (params.bodyType) {
            where.bodyType = params.bodyType;
        }
        return where;
    }
    async findMany(params) {
        const where = this.buildWhere(params);
        return prisma.celestialBody.findMany({
            where,
            skip: params.skip,
            take: params.take,
            orderBy: {
                [params.orderByField]: params.orderDirection,
            },
        });
    }
    async count(params) {
        const where = this.buildWhere(params);
        return prisma.celestialBody.count({ where });
    }
    async findById(celestialBodyId) {
        return prisma.celestialBody.findUnique({
            where: { celestialBodyId },
        });
    }
    async findByName(name) {
        return prisma.celestialBody.findUnique({
            where: { name },
        });
    }
    async create(data) {
        return prisma.celestialBody.create({
            data: {
                name: data.name,
                bodyType: data.bodyType,
                description: data.description ?? null,
            },
        });
    }
    async update(celestialBodyId, data) {
        return prisma.celestialBody.update({
            where: { celestialBodyId },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.bodyType && { bodyType: data.bodyType }),
                ...(data.description !== undefined && { description: data.description }),
            },
        });
    }
    async delete(celestialBodyId) {
        return prisma.celestialBody.delete({
            where: { celestialBodyId },
        });
    }
    async createAuditLog(data) {
        await prisma.auditLog.create({
            data: {
                actorId: data.actorId ?? null,
                action: data.action,
                entity: data.entity,
                entityId: data.entityId,
                requestId: data.requestId ?? null,
                ...(data.diffSummary !== undefined && { diffSummary: data.diffSummary }),
            },
        });
    }
}
export const celestialBodiesRepository = new CelestialBodiesRepository();
