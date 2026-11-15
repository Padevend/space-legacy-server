import { prisma } from '../../core/database/prisma.js';
export class MissionsRepository {
    buildWhere(params) {
        const where = {};
        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { description: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        if (params.missionStatus) {
            where.missionStatus = params.missionStatus;
        }
        if (params.agency) {
            where.agency = { contains: params.agency, mode: 'insensitive' };
        }
        return where;
    }
    async findMany(params) {
        const where = this.buildWhere(params);
        return prisma.mission.findMany({
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
        return prisma.mission.count({ where });
    }
    async findById(missionId) {
        return prisma.mission.findUnique({
            where: { missionId },
        });
    }
    async findBySlug(slug) {
        return prisma.mission.findUnique({
            where: { slug },
        });
    }
    async findByIdOrSlugWithIncludes(idOrSlug, isUuid, includes) {
        const where = isUuid ? { missionId: idOrSlug } : { slug: idOrSlug };
        return prisma.mission.findUnique({
            where,
            include: {
                ...(includes.equipment && {
                    equipment: {
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
                ...(includes.people && {
                    people: {
                        take: 50,
                        include: {
                            person: {
                                select: {
                                    personId: true,
                                    fullName: true,
                                },
                            },
                        },
                    },
                }),
                ...(includes.sources && {
                    sources: {
                        take: 50,
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
        return prisma.mission.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description ?? null,
                agency: data.agency ?? null,
                missionStatus: data.missionStatus ?? 'UNKNOWN',
            },
        });
    }
    async update(missionId, data) {
        return prisma.mission.update({
            where: { missionId },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.slug !== undefined && { slug: data.slug }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.agency !== undefined && { agency: data.agency }),
                ...(data.missionStatus !== undefined && { missionStatus: data.missionStatus }),
            },
        });
    }
    async delete(missionId) {
        return prisma.mission.delete({
            where: { missionId },
        });
    }
    // Relations
    async linkPerson(missionId, personId, roleInMission) {
        return prisma.missionPerson.upsert({
            where: {
                missionId_personId: { missionId, personId },
            },
            update: { roleInMission },
            create: { missionId, personId, roleInMission },
        });
    }
    async unlinkPerson(missionId, personId) {
        return prisma.missionPerson.delete({
            where: {
                missionId_personId: { missionId, personId },
            },
        });
    }
    async linkSource(missionId, sourceId, claimDescription) {
        return prisma.missionSource.upsert({
            where: {
                missionId_sourceId: { missionId, sourceId },
            },
            update: { claimDescription: claimDescription ?? null },
            create: { missionId, sourceId, claimDescription: claimDescription ?? null },
        });
    }
    async unlinkSource(missionId, sourceId) {
        return prisma.missionSource.delete({
            where: {
                missionId_sourceId: { missionId, sourceId },
            },
        });
    }
    async linkEquipment(missionId, equipmentId, missionRole, participationDescription) {
        return prisma.missionEquipment.upsert({
            where: {
                missionId_equipmentId: { missionId, equipmentId },
            },
            update: {
                missionRole,
                participationDescription: participationDescription ?? null,
            },
            create: {
                missionId,
                equipmentId,
                missionRole,
                participationDescription: participationDescription ?? null,
            },
        });
    }
    async unlinkEquipment(missionId, equipmentId) {
        return prisma.missionEquipment.delete({
            where: {
                missionId_equipmentId: { missionId, equipmentId },
            },
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
export const missionsRepository = new MissionsRepository();
