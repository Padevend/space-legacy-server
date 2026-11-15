import { prisma } from '../../core/database/prisma.js';
export class SourcesRepository {
    buildWhere(params) {
        const where = {};
        if (params.search) {
            where.OR = [
                { title: { contains: params.search, mode: 'insensitive' } },
                { publisher: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        if (params.sourceType) {
            where.sourceType = params.sourceType;
        }
        if (params.publisher) {
            where.publisher = {
                contains: params.publisher,
                mode: 'insensitive',
            };
        }
        return where;
    }
    async findMany(params) {
        const where = this.buildWhere(params);
        return prisma.source.findMany({
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
        return prisma.source.count({ where });
    }
    async findById(sourceId) {
        return prisma.source.findUnique({
            where: { sourceId },
        });
    }
    async findByUrl(url) {
        return prisma.source.findUnique({
            where: { url },
        });
    }
    async create(data) {
        return prisma.source.create({
            data: {
                title: data.title,
                url: data.url,
                publisher: data.publisher,
                sourceType: data.sourceType,
                author: data.author ?? null,
                publicationDate: data.publicationDate ?? null,
            },
        });
    }
    async update(sourceId, data) {
        return prisma.source.update({
            where: { sourceId },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.url !== undefined && { url: data.url }),
                ...(data.publisher !== undefined && { publisher: data.publisher }),
                ...(data.sourceType !== undefined && { sourceType: data.sourceType }),
                ...(data.author !== undefined && { author: data.author }),
                ...(data.publicationDate !== undefined && { publicationDate: data.publicationDate }),
            },
        });
    }
    async delete(sourceId) {
        return prisma.source.delete({
            where: { sourceId },
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
export const sourcesRepository = new SourcesRepository();
