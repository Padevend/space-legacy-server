import { prisma } from '../../core/database/prisma.js';
import { Prisma, type Location, type LocationType } from '@prisma/client';

export interface LocationListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  celestialBodyId?: string | undefined;
  locationType?: LocationType | undefined;
  orderByField: 'name' | 'locationType';
  orderDirection: 'asc' | 'desc';
}

export class LocationsRepository {
  private buildWhere(params: Partial<LocationListParams>): Prisma.LocationWhereInput {
    const where: Prisma.LocationWhereInput = {};

    if (params.search) {
      where.name = {
        contains: params.search,
        mode: 'insensitive',
      };
    }

    if (params.celestialBodyId) {
      where.celestialBodyId = params.celestialBodyId;
    }

    if (params.locationType) {
      where.locationType = params.locationType;
    }

    return where;
  }

  async findMany(params: LocationListParams): Promise<Location[]> {
    const where = this.buildWhere(params);

    return prisma.location.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.orderByField]: params.orderDirection,
      },
    });
  }

  async count(params: Partial<LocationListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return prisma.location.count({ where });
  }

  async findById(locationId: string): Promise<Location | null> {
    return prisma.location.findUnique({
      where: { locationId },
    });
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
  }): Promise<Location> {
    return prisma.location.create({
      data: {
        name: data.name,
        locationType: data.locationType,
        celestialBodyId: data.celestialBodyId ?? null,
        latitude: data.latitude !== undefined && data.latitude !== null ? new Prisma.Decimal(data.latitude) : null,
        longitude: data.longitude !== undefined && data.longitude !== null ? new Prisma.Decimal(data.longitude) : null,
        altitude: data.altitude !== undefined && data.altitude !== null ? new Prisma.Decimal(data.altitude) : null,
        referenceSystem: data.referenceSystem ?? null,
        description: data.description ?? null,
      },
    });
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
  ): Promise<Location> {
    return prisma.location.update({
      where: { locationId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.locationType !== undefined && { locationType: data.locationType }),
        ...(data.celestialBodyId !== undefined && { celestialBodyId: data.celestialBodyId }),
        ...(data.latitude !== undefined && {
          latitude: data.latitude !== null ? new Prisma.Decimal(data.latitude) : null,
        }),
        ...(data.longitude !== undefined && {
          longitude: data.longitude !== null ? new Prisma.Decimal(data.longitude) : null,
        }),
        ...(data.altitude !== undefined && {
          altitude: data.altitude !== null ? new Prisma.Decimal(data.altitude) : null,
        }),
        ...(data.referenceSystem !== undefined && { referenceSystem: data.referenceSystem }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
  }

  async delete(locationId: string): Promise<Location> {
    return prisma.location.delete({
      where: { locationId },
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

export const locationsRepository = new LocationsRepository();
