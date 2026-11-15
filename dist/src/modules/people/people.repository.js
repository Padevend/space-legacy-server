import { prisma } from '../../core/database/prisma.js';
export class PeopleRepository {
    buildWhere(params) {
        const where = {};
        if (params.search) {
            where.fullName = {
                contains: params.search,
                mode: 'insensitive',
            };
        }
        if (params.affiliation) {
            where.affiliation = {
                contains: params.affiliation,
                mode: 'insensitive',
            };
        }
        return where;
    }
    async findMany(params) {
        const where = this.buildWhere(params);
        return prisma.person.findMany({
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
        return prisma.person.count({ where });
    }
    async findById(personId) {
        return prisma.person.findUnique({
            where: { personId },
        });
    }
    async create(data) {
        return prisma.person.create({
            data: {
                fullName: data.fullName,
                biography: data.biography ?? null,
                affiliation: data.affiliation ?? null,
            },
        });
    }
    async update(personId, data) {
        return prisma.person.update({
            where: { personId },
            data: {
                ...(data.fullName !== undefined && { fullName: data.fullName }),
                ...(data.biography !== undefined && { biography: data.biography }),
                ...(data.affiliation !== undefined && { affiliation: data.affiliation }),
            },
        });
    }
    async delete(personId) {
        return prisma.person.delete({
            where: { personId },
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
export const peopleRepository = new PeopleRepository();
