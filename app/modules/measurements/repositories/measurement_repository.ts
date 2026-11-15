import { prismaClient, type ExtendedPrismaClient } from '#infrastructure/database/prisma_client';
import { Prisma } from '@prisma/client';
import type { MeasurementModel } from '../models/measurement.js';
import type { MeasurementType } from '#shared/enums';

export interface MeasurementListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  equipmentId?: string | undefined;
  eventId?: string | undefined;
  measurementType?: MeasurementType | undefined;
  orderByField: 'name' | 'measurementType' | 'measurementDate';
  orderDirection: 'asc' | 'desc';
}

export class MeasurementRepository {
  constructor(private readonly prisma: ExtendedPrismaClient = prismaClient) {}

  private buildWhere(params: Partial<MeasurementListParams>): Prisma.MeasurementWhereInput {
    const where: Prisma.MeasurementWhereInput = {};

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

  async findMany(params: MeasurementListParams): Promise<MeasurementModel[]> {
    const where = this.buildWhere(params);

    const rows = await this.prisma.measurement.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.orderByField]: params.orderDirection,
      },
    });

    return rows as unknown as MeasurementModel[];
  }

  async count(params: Partial<MeasurementListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return this.prisma.measurement.count({ where });
  }

  async findById(measurementId: string): Promise<MeasurementModel | null> {
    const row = await this.prisma.measurement.findUnique({
      where: { measurementId },
    });
    return row as unknown as MeasurementModel | null;
  }

  async findByIdWithIncludes(
    measurementId: string,
    includes: {
      equipment?: boolean;
      event?: boolean;
      sources?: boolean;
    }
  ): Promise<any | null> {
    return this.prisma.measurement.findUnique({
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

  async create(data: {
    equipmentId?: string | null;
    eventId?: string | null;
    name: string;
    value: string | Prisma.Decimal;
    unit: string;
    measurementType: MeasurementType;
    context: string;
    measurementDate?: Date | null;
    isApproximate: boolean;
    uncertainty?: string | Prisma.Decimal | null;
  }): Promise<MeasurementModel> {
    const value = typeof data.value === 'string' ? new Prisma.Decimal(data.value) : data.value;
    const uncertainty =
      typeof data.uncertainty === 'string' ? new Prisma.Decimal(data.uncertainty) : (data.uncertainty ?? null);

    const row = await this.prisma.measurement.create({
      data: {
        equipmentId: data.equipmentId ?? null,
        eventId: data.eventId ?? null,
        name: data.name,
        value,
        unit: data.unit,
        measurementType: data.measurementType,
        context: data.context,
        measurementDate: data.measurementDate ?? null,
        isApproximate: data.isApproximate,
        uncertainty,
      },
    });
    return row as unknown as MeasurementModel;
  }

  async update(
    measurementId: string,
    data: {
      equipmentId?: string | null;
      eventId?: string | null;
      name?: string;
      value?: string | Prisma.Decimal;
      unit?: string;
      measurementType?: MeasurementType;
      context?: string;
      measurementDate?: Date | null;
      isApproximate?: boolean;
      uncertainty?: string | Prisma.Decimal | null;
    }
  ): Promise<MeasurementModel> {
    const updateData: Prisma.MeasurementUncheckedUpdateInput = {};

    if (data.equipmentId !== undefined) updateData.equipmentId = data.equipmentId;
    if (data.eventId !== undefined) updateData.eventId = data.eventId;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.unit !== undefined) updateData.unit = data.unit;
    if (data.measurementType !== undefined) updateData.measurementType = data.measurementType;
    if (data.context !== undefined) updateData.context = data.context;
    if (data.isApproximate !== undefined) updateData.isApproximate = data.isApproximate;
    if (data.measurementDate !== undefined) updateData.measurementDate = data.measurementDate;

    if (data.value !== undefined) {
      updateData.value = typeof data.value === 'string' ? new Prisma.Decimal(data.value) : data.value;
    }
    if (data.uncertainty !== undefined) {
      updateData.uncertainty =
        typeof data.uncertainty === 'string' ? new Prisma.Decimal(data.uncertainty) : (data.uncertainty ?? null);
    }

    const row = await this.prisma.measurement.update({
      where: { measurementId },
      data: updateData,
    });
    return row as unknown as MeasurementModel;
  }

  async delete(measurementId: string): Promise<MeasurementModel> {
    const row = await this.prisma.measurement.delete({
      where: { measurementId },
    });
    return row as unknown as MeasurementModel;
  }
}

export const measurementRepository = new MeasurementRepository();
