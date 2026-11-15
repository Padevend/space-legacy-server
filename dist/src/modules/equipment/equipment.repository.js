import { prisma } from '../../core/database/prisma.js';
export class EquipmentRepository {
    buildWhere(params) {
        const where = {};
        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { description: { contains: params.search, mode: 'insensitive' } },
                { manufacturer: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        if (params.equipmentType) {
            where.equipmentType = params.equipmentType;
        }
        if (params.operationalStatus) {
            where.operationalStatus = params.operationalStatus;
        }
        if (params.physicalStatus) {
            where.physicalStatus = params.physicalStatus;
        }
        if (params.parentEquipmentId) {
            where.parentEquipmentId = params.parentEquipmentId;
        }
        if (params.missionId) {
            where.missions = {
                some: { missionId: params.missionId },
            };
        }
        if (params.celestialBodyId) {
            where.locations = {
                some: {
                    location: {
                        celestialBodyId: params.celestialBodyId,
                    },
                },
            };
        }
        return where;
    }
    async findMany(params) {
        const where = this.buildWhere(params);
        return prisma.equipment.findMany({
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
        return prisma.equipment.count({ where });
    }
    async findById(equipmentId) {
        return prisma.equipment.findUnique({
            where: { equipmentId },
        });
    }
    async findBySlug(slug) {
        return prisma.equipment.findUnique({
            where: { slug },
        });
    }
    async findByIdOrSlugWithIncludes(idOrSlug, isUuid, includes) {
        const where = isUuid ? { equipmentId: idOrSlug } : { slug: idOrSlug };
        return prisma.equipment.findUnique({
            where,
            include: {
                ...(includes.parent && {
                    parent: {
                        select: {
                            equipmentId: true,
                            name: true,
                            slug: true,
                        },
                    },
                }),
                ...(includes.children && {
                    children: {
                        take: 50,
                        select: {
                            equipmentId: true,
                            name: true,
                            slug: true,
                            equipmentType: true,
                        },
                    },
                }),
                ...(includes.missions && {
                    missions: {
                        take: 50,
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
                ...(includes.locations && {
                    locations: {
                        take: 50,
                        include: {
                            location: true,
                        },
                    },
                }),
            },
        });
    }
    async create(data) {
        return prisma.equipment.create({
            data: {
                parentEquipmentId: data.parentEquipmentId ?? null,
                name: data.name,
                slug: data.slug,
                description: data.description ?? null,
                equipmentType: data.equipmentType,
                manufacturer: data.manufacturer ?? null,
                operationalStatus: data.operationalStatus ?? 'UNKNOWN',
                physicalStatus: data.physicalStatus ?? 'UNKNOWN',
            },
        });
    }
    async update(equipmentId, data) {
        return prisma.equipment.update({
            where: { equipmentId },
            data: {
                ...(data.parentEquipmentId !== undefined && { parentEquipmentId: data.parentEquipmentId }),
                ...(data.name !== undefined && { name: data.name }),
                ...(data.slug !== undefined && { slug: data.slug }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.equipmentType !== undefined && { equipmentType: data.equipmentType }),
                ...(data.manufacturer !== undefined && { manufacturer: data.manufacturer }),
                ...(data.operationalStatus !== undefined && { operationalStatus: data.operationalStatus }),
                ...(data.physicalStatus !== undefined && { physicalStatus: data.physicalStatus }),
            },
        });
    }
    async delete(equipmentId) {
        return prisma.equipment.delete({
            where: { equipmentId },
        });
    }
    // Sub-resources
    async findChildren(equipmentId) {
        return prisma.equipment.findMany({
            where: { parentEquipmentId: equipmentId },
            orderBy: { name: 'asc' },
        });
    }
    async findEvents(equipmentId) {
        return prisma.eventEquipment.findMany({
            where: { equipmentId },
            include: {
                event: true,
            },
            orderBy: {
                event: { eventDate: 'asc' },
            },
        });
    }
    async findLocations(equipmentId) {
        return prisma.equipmentLocation.findMany({
            where: { equipmentId },
            include: {
                location: true,
            },
            orderBy: {
                startDate: 'desc',
            },
        });
    }
    async findMeasurements(equipmentId) {
        return prisma.measurement.findMany({
            where: { equipmentId },
            orderBy: { measurementDate: 'desc' },
        });
    }
    async findMedia(equipmentId) {
        return prisma.equipmentMedia.findMany({
            where: { equipmentId },
            include: {
                media: true,
            },
        });
    }
    async findSources(equipmentId) {
        return prisma.equipmentSource.findMany({
            where: { equipmentId },
            include: {
                source: true,
            },
        });
    }
    // Relations
    async linkLocation(equipmentId, locationId, startDate, endDate, locationPrecision = 'UNKNOWN') {
        return prisma.equipmentLocation.create({
            data: {
                equipmentId,
                locationId,
                startDate: startDate ?? null,
                endDate: endDate ?? null,
                locationPrecision,
            },
        });
    }
    async unlinkLocation(equipmentLocationId) {
        return prisma.equipmentLocation.delete({
            where: { equipmentLocationId },
        });
    }
    async linkPerson(equipmentId, personId, roleInEquipment) {
        return prisma.equipmentPerson.upsert({
            where: {
                equipmentId_personId: { equipmentId, personId },
            },
            update: { roleInEquipment },
            create: { equipmentId, personId, roleInEquipment },
        });
    }
    async unlinkPerson(equipmentId, personId) {
        return prisma.equipmentPerson.delete({
            where: {
                equipmentId_personId: { equipmentId, personId },
            },
        });
    }
    async linkSource(equipmentId, sourceId, claimDescription) {
        return prisma.equipmentSource.upsert({
            where: {
                equipmentId_sourceId: { equipmentId, sourceId },
            },
            update: { claimDescription: claimDescription ?? null },
            create: { equipmentId, sourceId, claimDescription: claimDescription ?? null },
        });
    }
    async unlinkSource(equipmentId, sourceId) {
        return prisma.equipmentSource.delete({
            where: {
                equipmentId_sourceId: { equipmentId, sourceId },
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
export const equipmentRepository = new EquipmentRepository();
