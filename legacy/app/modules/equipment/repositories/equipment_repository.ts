import { prisma } from '#infrastructure/database/prisma_client';
import type { EquipmentModel } from '../models/equipment.js';
import type { EquipmentType, OperationalStatus, PhysicalStatus } from '#shared/enums';

export interface EquipmentListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  equipmentType?: EquipmentType | undefined;
  operationalStatus?: OperationalStatus | undefined;
  physicalStatus?: PhysicalStatus | undefined;
  parentEquipmentId?: string | undefined;
  orderByField: 'name' | 'equipmentType' | 'createdAt' | 'updatedAt';
  orderDirection: 'asc' | 'desc';
}

export class EquipmentRepository {
  private mapEquipment(row: any): EquipmentModel {
    return {
      equipmentId: row.equipmentId,
      parentEquipmentId: row.parentEquipmentId,
      name: row.name,
      slug: row.slug,
      description: row.description,
      equipmentType: row.equipmentType,
      manufacturer: row.manufacturer,
      operationalStatus: row.operationalStatus,
      physicalStatus: row.physicalStatus,
      parent: row.parent ? { equipmentId: row.parent.equipmentId, name: row.parent.name, slug: row.parent.slug } : null,
      children: row.children?.map((c: any) => ({
        equipmentId: c.equipmentId,
        name: c.name,
        slug: c.slug,
        equipmentType: c.equipmentType,
      })),
      missions: row.missions?.map((m: any) => ({
        missionId: m.missionId,
        name: m.mission?.name ?? '',
        slug: m.mission?.slug ?? '',
        missionRole: m.missionRole ?? m.role ?? '',
      })),
      locations: row.locations?.map((loc: any) => ({
        equipmentLocationId: loc.equipmentLocationId,
        locationId: loc.locationId,
        name: loc.location?.name ?? '',
        latitude:
          loc.location?.latitude !== null && loc.location?.latitude !== undefined
            ? Number(loc.location.latitude)
            : null,
        longitude:
          loc.location?.longitude !== null && loc.location?.longitude !== undefined
            ? Number(loc.location.longitude)
            : null,
        startDate: loc.startDate
          ? typeof loc.startDate === 'string'
            ? loc.startDate
            : loc.startDate.toISOString().split('T')[0]
          : null,
        endDate: loc.endDate
          ? typeof loc.endDate === 'string'
            ? loc.endDate
            : loc.endDate.toISOString().split('T')[0]
          : null,
      })),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async findMany(params: EquipmentListParams): Promise<EquipmentModel[]> {
    const where: any = {};
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

    const rows = await prisma.equipment.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.orderByField]: params.orderDirection },
    });
    return rows.map((r) => this.mapEquipment(r));
  }

  async count(params: Partial<EquipmentListParams>): Promise<number> {
    const where: any = {};
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
    return prisma.equipment.count({ where });
  }

  async findByIdOrSlug(
    idOrSlug: string,
    includes?: { parent?: boolean; children?: boolean; missions?: boolean; locations?: boolean }
  ): Promise<EquipmentModel | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const where = isUuid ? { equipmentId: idOrSlug } : { slug: idOrSlug };

    const row = await prisma.equipment.findUnique({
      where,
      include: {
        ...(includes?.parent && { parent: true }),
        ...(includes?.children && { children: true }),
        ...(includes?.missions && {
          missions: {
            include: {
              mission: true,
            },
          },
        }),
        ...(includes?.locations && {
          locations: {
            include: {
              location: true,
            },
          },
        }),
      },
    });
    return row ? this.mapEquipment(row) : null;
  }

  async findBySlug(slug: string): Promise<EquipmentModel | null> {
    const row = await prisma.equipment.findUnique({ where: { slug } });
    return row ? this.mapEquipment(row) : null;
  }

  async getParentId(equipmentId: string): Promise<string | null> {
    const row = await prisma.equipment.findUnique({
      where: { equipmentId },
      select: { parentEquipmentId: true },
    });
    return row?.parentEquipmentId ?? null;
  }

  async findChildren(parentId: string): Promise<EquipmentModel[]> {
    const rows = await prisma.equipment.findMany({
      where: { parentEquipmentId: parentId },
    });
    return rows.map((r) => this.mapEquipment(r));
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
  }): Promise<EquipmentModel> {
    const row = await prisma.equipment.create({
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
    return this.mapEquipment(row);
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
  ): Promise<EquipmentModel> {
    const row = await prisma.equipment.update({
      where: { equipmentId },
      data: {
        ...(data.parentEquipmentId !== undefined && { parentEquipmentId: data.parentEquipmentId }),
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.equipmentType && { equipmentType: data.equipmentType }),
        ...(data.manufacturer !== undefined && { manufacturer: data.manufacturer }),
        ...(data.operationalStatus && { operationalStatus: data.operationalStatus }),
        ...(data.physicalStatus && { physicalStatus: data.physicalStatus }),
      },
    });
    return this.mapEquipment(row);
  }

  async delete(equipmentId: string): Promise<EquipmentModel> {
    const row = await prisma.equipment.delete({ where: { equipmentId } });
    return this.mapEquipment(row);
  }
}

export const equipmentRepository = new EquipmentRepository();
