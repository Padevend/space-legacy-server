import { prisma } from '../../core/database/prisma.js';
import { Prisma } from '@prisma/client';
export class MeasurementsRepository {
    buildWhere(params) {
        const where = {};
        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { context: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        if (params.equipmentId) {
            where.equipmentId = params.equipmentId;
        }
        if (params.eventId) {
            where.eventId = params.eventId;
        }
        if (params.measurementType) {
            where.measurementType = params.measurementType;
        }
        return where;
    }
    async findMany(params) {
        const where = this.buildWhere(params);
        return prisma.measurement.findMany({
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
        return prisma.measurement.count({ where });
    }
    async findById(measurementId) {
        return prisma.measurement.findUnique({
            where: { measurementId },
        });
    }
    async findByIdWithIncludes(measurementId, includes) {
        return prisma.measurement.findUnique({
            where: { measurementId },
            include: {
                ...(includes.equipment && {
                    equipment: {
                        select: {
                            equipmentId: true,
                            name: true,
                            slug: true,
                        },
                    },
                }),
                ...(includes.event && {
                    event: {
                        select: {
                            eventId: true,
                            title: true,
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
        return prisma.measurement.create({
            data: {
                equipmentId: data.equipmentId ?? null,
                eventId: data.eventId ?? null,
                name: data.name,
                value: new Prisma.Decimal(data.value),
                unit: data.unit,
                measurementType: data.measurementType,
                context: data.context,
                measurementDate: data.measurementDate ?? null,
                isApproximate: data.isApproximate ?? false,
                uncertainty: data.uncertainty ? new Prisma.Decimal(data.uncertainty) : null,
            },
        });
    }
    async update(measurementId, data) {
        return prisma.measurement.update({
            where: { measurementId },
            data: {
                ...(data.equipmentId !== undefined && { equipmentId: data.equipmentId }),
                ...(data.eventId !== undefined && { eventId: data.eventId }),
                ...(data.name !== undefined && { name: data.name }),
                ...(data.value !== undefined && { value: new Prisma.Decimal(data.value) }),
                ...(data.unit !== undefined && { unit: data.unit }),
                ...(data.measurementType !== undefined && { measurementType: data.measurementType }),
                ...(data.context !== undefined && { context: data.context }),
                ...(data.measurementDate !== undefined && { measurementDate: data.measurementDate }),
                ...(data.isApproximate !== undefined && { isApproximate: data.isApproximate }),
                ...(data.uncertainty !== undefined && {
                    uncertainty: data.uncertainty ? new Prisma.Decimal(data.uncertainty) : null,
                }),
            },
        });
    }
    async delete(measurementId) {
        return prisma.measurement.delete({
            where: { measurementId },
        });
    }
    // Relations
    async linkSource(measurementId, sourceId, claimDescription) {
        return prisma.measurementSource.upsert({
            where: {
                measurementId_sourceId: { measurementId, sourceId },
            },
            update: { claimDescription: claimDescription ?? null },
            create: { measurementId, sourceId, claimDescription: claimDescription ?? null },
        });
    }
    async unlinkSource(measurementId, sourceId) {
        return prisma.measurementSource.delete({
            where: {
                measurementId_sourceId: { measurementId, sourceId },
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
export const measurementsRepository = new MeasurementsRepository();
