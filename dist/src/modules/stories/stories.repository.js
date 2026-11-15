import { prisma } from '../../core/database/prisma.js';
export class StoriesRepository {
    buildWhere(params) {
        const where = {};
        if (params.search) {
            where.OR = [
                { title: { contains: params.search, mode: 'insensitive' } },
                { hook: { contains: params.search, mode: 'insensitive' } },
                { content: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        if (params.publicationStatus) {
            where.publicationStatus = params.publicationStatus;
        }
        if (params.storyType) {
            where.storyType = params.storyType;
        }
        if (params.language) {
            where.language = params.language;
        }
        if (params.equipmentId) {
            where.equipments = {
                some: {
                    equipmentId: params.equipmentId,
                },
            };
        }
        return where;
    }
    async findMany(params) {
        const where = this.buildWhere(params);
        return prisma.story.findMany({
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
        return prisma.story.count({ where });
    }
    async findById(storyId) {
        return prisma.story.findUnique({
            where: { storyId },
        });
    }
    async findBySlug(slug) {
        return prisma.story.findUnique({
            where: { slug },
        });
    }
    async findByIdOrSlugWithIncludes(idOrSlug, isUuid, includes, onlyPublished = false) {
        const where = {
            ...(isUuid ? { storyId: idOrSlug } : { slug: idOrSlug }),
            ...(onlyPublished ? { publicationStatus: 'PUBLISHED' } : {}),
        };
        return prisma.story.findFirst({
            where,
            include: {
                ...(includes.missions && {
                    missions: {
                        take: 50,
                        orderBy: { displayOrder: 'asc' },
                        include: {
                            mission: {
                                select: {
                                    missionId: true,
                                    name: true,
                                    slug: true,
                                },
                            },
                        },
                    },
                }),
                ...(includes.equipments && {
                    equipments: {
                        take: 50,
                        orderBy: { displayOrder: 'asc' },
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
                ...(includes.events && {
                    events: {
                        take: 50,
                        orderBy: { displayOrder: 'asc' },
                        include: {
                            event: {
                                select: {
                                    eventId: true,
                                    title: true,
                                    eventType: true,
                                },
                            },
                        },
                    },
                }),
                ...(includes.media && {
                    media: {
                        take: 50,
                        orderBy: { displayOrder: 'asc' },
                        include: {
                            media: {
                                select: {
                                    mediaId: true,
                                    title: true,
                                    url: true,
                                    thumbnailUrl: true,
                                    provenanceType: true,
                                },
                            },
                        },
                    },
                }),
                ...(includes.sources && {
                    sources: {
                        take: 50,
                        orderBy: { displayOrder: 'asc' },
                        include: {
                            source: {
                                select: {
                                    sourceId: true,
                                    title: true,
                                    url: true,
                                },
                            },
                        },
                    },
                }),
            },
        });
    }
    async create(data) {
        return prisma.story.create({
            data,
        });
    }
    async update(storyId, data) {
        return prisma.story.update({
            where: { storyId },
            data,
        });
    }
    async delete(storyId) {
        return prisma.story.delete({
            where: { storyId },
        });
    }
    // Story-Mission
    async linkMission(storyId, missionId, displayOrder = 0) {
        return prisma.storyMission.upsert({
            where: { storyId_missionId: { storyId, missionId } },
            create: { storyId, missionId, displayOrder },
            update: { displayOrder },
        });
    }
    async unlinkMission(storyId, missionId) {
        return prisma.storyMission.delete({
            where: { storyId_missionId: { storyId, missionId } },
        });
    }
    async findMissionLink(storyId, missionId) {
        return prisma.storyMission.findUnique({
            where: { storyId_missionId: { storyId, missionId } },
        });
    }
    async findMissionById(missionId) {
        return prisma.mission.findUnique({ where: { missionId } });
    }
    // Story-Equipment
    async linkEquipment(storyId, equipmentId, displayOrder = 0, narrativeRole) {
        return prisma.storyEquipment.upsert({
            where: { storyId_equipmentId: { storyId, equipmentId } },
            create: { storyId, equipmentId, displayOrder, narrativeRole: narrativeRole ?? null },
            update: { displayOrder, narrativeRole: narrativeRole ?? null },
        });
    }
    async unlinkEquipment(storyId, equipmentId) {
        return prisma.storyEquipment.delete({
            where: { storyId_equipmentId: { storyId, equipmentId } },
        });
    }
    async findEquipmentLink(storyId, equipmentId) {
        return prisma.storyEquipment.findUnique({
            where: { storyId_equipmentId: { storyId, equipmentId } },
        });
    }
    async findEquipmentById(equipmentId) {
        return prisma.equipment.findUnique({ where: { equipmentId } });
    }
    // Story-Event
    async linkEvent(storyId, eventId, displayOrder = 0) {
        return prisma.storyEvent.upsert({
            where: { storyId_eventId: { storyId, eventId } },
            create: { storyId, eventId, displayOrder },
            update: { displayOrder },
        });
    }
    async unlinkEvent(storyId, eventId) {
        return prisma.storyEvent.delete({
            where: { storyId_eventId: { storyId, eventId } },
        });
    }
    async findEventLink(storyId, eventId) {
        return prisma.storyEvent.findUnique({
            where: { storyId_eventId: { storyId, eventId } },
        });
    }
    async findEventById(eventId) {
        return prisma.event.findUnique({ where: { eventId } });
    }
    // Story-Media
    async linkMedia(storyId, mediaId, displayOrder = 0, captionOverride) {
        return prisma.storyMedia.upsert({
            where: { storyId_mediaId: { storyId, mediaId } },
            create: { storyId, mediaId, displayOrder, captionOverride: captionOverride ?? null },
            update: { displayOrder, captionOverride: captionOverride ?? null },
        });
    }
    async unlinkMedia(storyId, mediaId) {
        return prisma.storyMedia.delete({
            where: { storyId_mediaId: { storyId, mediaId } },
        });
    }
    async findMediaLink(storyId, mediaId) {
        return prisma.storyMedia.findUnique({
            where: { storyId_mediaId: { storyId, mediaId } },
        });
    }
    async findMediaById(mediaId) {
        return prisma.media.findUnique({ where: { mediaId } });
    }
    // Story-Source
    async linkSource(storyId, sourceId, displayOrder = 0, claimDescription) {
        return prisma.storySource.upsert({
            where: { storyId_sourceId: { storyId, sourceId } },
            create: { storyId, sourceId, displayOrder, claimDescription: claimDescription ?? null },
            update: { displayOrder, claimDescription: claimDescription ?? null },
        });
    }
    async unlinkSource(storyId, sourceId) {
        return prisma.storySource.delete({
            where: { storyId_sourceId: { storyId, sourceId } },
        });
    }
    async findSourceLink(storyId, sourceId) {
        return prisma.storySource.findUnique({
            where: { storyId_sourceId: { storyId, sourceId } },
        });
    }
    async findSourceById(sourceId) {
        return prisma.source.findUnique({ where: { sourceId } });
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
export const storiesRepository = new StoriesRepository();
