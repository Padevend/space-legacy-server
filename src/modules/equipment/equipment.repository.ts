import { prisma } from '../../core/database/prisma.js';
import type {
  Equipment,
  EquipmentType,
  OperationalStatus,
  PhysicalStatus,
  DatePrecision,
  Prisma,
} from '@prisma/client';

export interface EquipmentListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  equipmentType?: EquipmentType | undefined;
  operationalStatus?: OperationalStatus | undefined;
  physicalStatus?: PhysicalStatus | undefined;
  missionId?: string | undefined;
  celestialBodyId?: string | undefined;
  parentEquipmentId?: string | undefined;
  orderByField: 'name' | 'equipmentType' | 'createdAt' | 'updatedAt';
  orderDirection: 'asc' | 'desc';
}

export class EquipmentRepository {
  private buildWhere(params: Partial<EquipmentListParams>): Prisma.EquipmentWhereInput {
    const where: Prisma.EquipmentWhereInput = {};

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

  async findMany(params: EquipmentListParams): Promise<Equipment[]> {
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

  async count(params: Partial<EquipmentListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return prisma.equipment.count({ where });
  }

  async findById(equipmentId: string): Promise<Equipment | null> {
    return prisma.equipment.findUnique({
      where: { equipmentId },
    });
  }

  async findBySlug(slug: string): Promise<Equipment | null> {
    return prisma.equipment.findUnique({
      where: { slug },
    });
  }

  async findByIdOrSlugWithIncludes(
    idOrSlug: string,
    isUuid: boolean,
    includes: {
      parent?: boolean;
      children?: boolean;
      missions?: boolean;
      locations?: boolean;
    }
  ) {
    const where: Prisma.EquipmentWhereUniqueInput = isUuid
      ? { equipmentId: idOrSlug }
      : { slug: idOrSlug };

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

  async create(data: {
    parentEquipmentId?: string | null | undefined;
    name: string;
    slug: string;
    description?: string | null | undefined;
    equipmentType: EquipmentType;
    manufacturer?: string | null | undefined;
    operationalStatus?: OperationalStatus | undefined;
    physicalStatus?: PhysicalStatus | undefined;
  }): Promise<Equipment> {
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

  async update(
    equipmentId: string,
    data: {
      parentEquipmentId?: string | null | undefined;
      name?: string | undefined;
      slug?: string | undefined;
      description?: string | null | undefined;
      equipmentType?: EquipmentType | undefined;
      manufacturer?: string | null | undefined;
      operationalStatus?: OperationalStatus | undefined;
      physicalStatus?: PhysicalStatus | undefined;
    }
  ): Promise<Equipment> {
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

  async delete(equipmentId: string): Promise<Equipment> {
    return prisma.equipment.delete({
      where: { equipmentId },
    });
  }

  // Sub-resources
  async findChildren(equipmentId: string): Promise<Equipment[]> {
    return prisma.equipment.findMany({
      where: { parentEquipmentId: equipmentId },
      orderBy: { name: 'asc' },
    });
  }

  async findEvents(equipmentId: string) {
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

  async findLocations(equipmentId: string) {
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

  async findMeasurements(equipmentId: string) {
    return prisma.measurement.findMany({
      where: { equipmentId },
      orderBy: { measurementDate: 'desc' },
    });
  }

  async findMedia(equipmentId: string) {
    return prisma.equipmentMedia.findMany({
      where: { equipmentId },
      include: {
        media: true,
      },
    });
  }

  async findSources(equipmentId: string) {
    return prisma.equipmentSource.findMany({
      where: { equipmentId },
      include: {
        source: true,
      },
    });
  }

  // Relations
  async linkLocation(
    equipmentId: string,
    locationId: string,
    startDate?: Date | null,
    endDate?: Date | null,
    locationPrecision: DatePrecision = 'UNKNOWN'
  ) {
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

  async unlinkLocation(equipmentLocationId: string) {
    return prisma.equipmentLocation.delete({
      where: { equipmentLocationId },
    });
  }

  async linkPerson(equipmentId: string, personId: string, roleInEquipment: string) {
    return prisma.equipmentPerson.upsert({
      where: {
        equipmentId_personId: { equipmentId, personId },
      },
      update: { roleInEquipment },
      create: { equipmentId, personId, roleInEquipment },
    });
  }

  async unlinkPerson(equipmentId: string, personId: string) {
    return prisma.equipmentPerson.delete({
      where: {
        equipmentId_personId: { equipmentId, personId },
      },
    });
  }

  async linkSource(equipmentId: string, sourceId: string, claimDescription?: string | null) {
    return prisma.equipmentSource.upsert({
      where: {
        equipmentId_sourceId: { equipmentId, sourceId },
      },
      update: { claimDescription: claimDescription ?? null },
      create: { equipmentId, sourceId, claimDescription: claimDescription ?? null },
    });
  }

  async unlinkSource(equipmentId: string, sourceId: string) {
    return prisma.equipmentSource.delete({
      where: {
        equipmentId_sourceId: { equipmentId, sourceId },
      },
    });
  }

  async createAuditLog(data: {
    actorId?: string | undefined;
    action: string;
    entity: string;
    entityId: string;
    requestId?: string | undefined;
    diffSummary?: Prisma.InputJsonValue | undefined;
  }): Promise<void> {
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
