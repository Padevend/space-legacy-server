import { prisma } from '#infrastructure/database/prisma_client';
import type { LocationModel } from '../models/location.js';
import type { EquipmentLocationModel } from '../models/equipment_location.js';
import type { LocationType, DatePrecision } from '#shared/enums';

export interface LocationListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  celestialBodyId?: string | undefined;
  locationType?: LocationType | undefined;
  orderByField: 'name' | 'locationType';
  orderDirection: 'asc' | 'desc';
}

export class LocationRepository {
  private mapLocation(row: any): LocationModel {
    return {
      locationId: row.locationId,
      celestialBodyId: row.celestialBodyId,
      name: row.name,
      locationType: row.locationType,
      latitude: row.latitude !== null ? Number(row.latitude) : null,
      longitude: row.longitude !== null ? Number(row.longitude) : null,
      altitude: row.altitude !== null ? Number(row.altitude) : null,
      referenceSystem: row.referenceSystem,
      description: row.description,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private mapEquipmentLocation(row: any): EquipmentLocationModel {
    return {
      equipmentLocationId: row.equipmentLocationId,
      equipmentId: row.equipmentId,
      locationId: row.locationId,
      startDate: row.startDate,
      endDate: row.endDate,
      locationPrecision: row.locationPrecision,
      location: row.location ? this.mapLocation(row.location) : undefined,
    };
  }

  async findMany(params: LocationListParams): Promise<LocationModel[]> {
    const where: any = {};
    if (params.search) {
      where.name = { contains: params.search, mode: 'insensitive' };
    }
    if (params.celestialBodyId) {
      where.celestialBodyId = params.celestialBodyId;
    }
    if (params.locationType) {
      where.locationType = params.locationType;
    }

    const rows = await prisma.location.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.orderByField]: params.orderDirection },
    });
    return rows.map((r) => this.mapLocation(r));
  }

  async count(params: Partial<LocationListParams>): Promise<number> {
    const where: any = {};
    if (params.search) {
      where.name = { contains: params.search, mode: 'insensitive' };
    }
    if (params.celestialBodyId) {
      where.celestialBodyId = params.celestialBodyId;
    }
    if (params.locationType) {
      where.locationType = params.locationType;
    }
    return prisma.location.count({ where });
  }

  async findById(locationId: string): Promise<LocationModel | null> {
    const row = await prisma.location.findUnique({
      where: { locationId },
    });
    return row ? this.mapLocation(row) : null;
  }

  async findByName(name: string): Promise<LocationModel | null> {
    const row = await prisma.location.findFirst({
      where: { name },
    });
    return row ? this.mapLocation(row) : null;
  }

  async create(data: {
    celestialBodyId?: string | null | undefined;
    name: string;
    locationType: LocationType;
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
    altitude?: number | null | undefined;
    referenceSystem?: string | null | undefined;
    description?: string | null | undefined;
  }): Promise<LocationModel> {
    const row = await prisma.location.create({
      data: {
        celestialBodyId: data.celestialBodyId ?? null,
        name: data.name,
        locationType: data.locationType,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        altitude: data.altitude ?? null,
        referenceSystem: data.referenceSystem ?? null,
        description: data.description ?? null,
      },
    });
    return this.mapLocation(row);
  }

  async update(
    locationId: string,
    data: {
      celestialBodyId?: string | null | undefined;
      name?: string | undefined;
      locationType?: LocationType | undefined;
      latitude?: number | null | undefined;
      longitude?: number | null | undefined;
      altitude?: number | null | undefined;
      referenceSystem?: string | null | undefined;
      description?: string | null | undefined;
    }
  ): Promise<LocationModel> {
    const row = await prisma.location.update({
      where: { locationId },
      data: {
        ...(data.celestialBodyId !== undefined && { celestialBodyId: data.celestialBodyId }),
        ...(data.name && { name: data.name }),
        ...(data.locationType && { locationType: data.locationType }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
        ...(data.altitude !== undefined && { altitude: data.altitude }),
        ...(data.referenceSystem !== undefined && { referenceSystem: data.referenceSystem }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
    return this.mapLocation(row);
  }

  async delete(locationId: string): Promise<LocationModel> {
    const row = await prisma.location.delete({
      where: { locationId },
    });
    return this.mapLocation(row);
  }

  async linkEquipment(data: {
    equipmentId: string;
    locationId: string;
    startDate?: Date | null | undefined;
    endDate?: Date | null | undefined;
    locationPrecision?: DatePrecision | undefined;
  }): Promise<EquipmentLocationModel> {
    const row = await prisma.equipmentLocation.create({
      data: {
        equipmentId: data.equipmentId,
        locationId: data.locationId,
        startDate: data.startDate ?? null,
        endDate: data.endDate ?? null,
        locationPrecision: data.locationPrecision ?? 'UNKNOWN',
      },
      include: {
        location: true,
      },
    });
    return this.mapEquipmentLocation(row);
  }

  async unlinkEquipment(equipmentId: string, locationIdOrLinkId: string): Promise<void> {
    await prisma.equipmentLocation.deleteMany({
      where: {
        equipmentId,
        OR: [{ locationId: locationIdOrLinkId }, { equipmentLocationId: locationIdOrLinkId }],
      },
    });
  }

  async findEquipmentLocations(idOrSlug: string): Promise<EquipmentLocationModel[]> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const where: any = isUuid ? { equipmentId: idOrSlug } : { equipment: { slug: idOrSlug } };

    const rows = await prisma.equipmentLocation.findMany({
      where,
      include: {
        location: true,
      },
    });
    return rows.map((r) => this.mapEquipmentLocation(r));
  }
}

export const locationRepository = new LocationRepository();
