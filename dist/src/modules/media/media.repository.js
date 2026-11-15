import { prisma } from '../../core/database/prisma.js';
export class MediaRepository {
    buildWhere(params) {
        const where = {};
        if (params.search) {
            where.OR = [
                { title: { contains: params.search, mode: 'insensitive' } },
                { caption: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        if (params.mediaType) {
            where.mediaType = params.mediaType;
        }
        if (params.provenanceType) {
            where.provenanceType = params.provenanceType;
        }
        return where;
    }
    async findMany(params) {
        const where = this.buildWhere(params);
        return prisma.media.findMany({
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
        return prisma.media.count({ where });
    }
    async findById(mediaId) {
        return prisma.media.findUnique({
            where: { mediaId },
        });
    }
    async findByIdWithIncludes(mediaId, includes) {
        return prisma.media.findUnique({
            where: { mediaId },
            include: {
                ...(includes.equipments && {
                    equipments: {
                        take: 50,
                        include: {
                            equipment: {
                                select: {
                                    equipmentId: true,
                                    name: true,
                                    slug: true,
                                },
                            },
                        },
                    },
                }),
                ...(includes.stories && {
                    stories: {
                        take: 50,
                        include: {
                            story: {
                                select: {
                                    storyId: true,
                                    title: true,
                                    slug: true,
                                },
                            },
                        },
                    },
                }),
            },
        });
    }
    async create(data) {
        return prisma.media.create({
            data,
        });
    }
    async update(mediaId, data) {
        return prisma.media.update({
            where: { mediaId },
            data,
        });
    }
    async delete(mediaId) {
        return prisma.media.delete({
            where: { mediaId },
        });
    }
    async linkEquipment(mediaId, equipmentId, representationType) {
        return prisma.equipmentMedia.upsert({
            where: {
                equipmentId_mediaId: {
                    equipmentId,
                    mediaId,
                },
            },
            create: {
                mediaId,
                equipmentId,
                representationType: representationType ?? null,
            },
            update: {
                representationType: representationType ?? null,
            },
        });
    }
    async unlinkEquipment(mediaId, equipmentId) {
        return prisma.equipmentMedia.delete({
            where: {
                equipmentId_mediaId: {
                    equipmentId,
                    mediaId,
                },
            },
        });
    }
    async findEquipmentLink(mediaId, equipmentId) {
        return prisma.equipmentMedia.findUnique({
            where: {
                equipmentId_mediaId: {
                    equipmentId,
                    mediaId,
                },
            },
        });
    }
    async findEquipmentById(equipmentId) {
        return prisma.equipment.findUnique({
            where: { equipmentId },
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
export const mediaRepository = new MediaRepository();
