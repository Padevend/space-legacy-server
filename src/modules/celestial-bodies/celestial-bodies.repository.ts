import { prisma } from '../../core/database/prisma.js';
import type { CelestialBody, Prisma, CelestialBodyType } from '@prisma/client';

export interface CelestialBodyListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  bodyType?: CelestialBodyType | undefined;
  orderByField: 'name' | 'bodyType';
  orderDirection: 'asc' | 'desc';
}

export class CelestialBodiesRepository {
  private buildWhere(params: Partial<CelestialBodyListParams>): Prisma.CelestialBodyWhereInput {
    const where: Prisma.CelestialBodyWhereInput = {};

    if (params.search) {
      where.name = {
        contains: params.search,
        mode: 'insensitive',
      };
    }

    if (params.bodyType) {
      where.bodyType = params.bodyType;
    }

    return where;
  }

  async findMany(params: CelestialBodyListParams): Promise<CelestialBody[]> {
    const where = this.buildWhere(params);

    return prisma.celestialBody.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.orderByField]: params.orderDirection,
      },
    });
  }

  async count(params: Partial<CelestialBodyListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return prisma.celestialBody.count({ where });
  }

  async findById(celestialBodyId: string): Promise<CelestialBody | null> {
    return prisma.celestialBody.findUnique({
      where: { celestialBodyId },
    });
  }

  async findByName(name: string): Promise<CelestialBody | null> {
    return prisma.celestialBody.findUnique({
      where: { name },
    });
  }

  async create(data: {
    name: string;
    bodyType: CelestialBodyType;
    description?: string | undefined;
  }): Promise<CelestialBody> {
    return prisma.celestialBody.create({
      data: {
        name: data.name,
        bodyType: data.bodyType,
        description: data.description ?? null,
      },
    });
  }

  async update(
    celestialBodyId: string,
    data: {
      name?: string | undefined;
      bodyType?: CelestialBodyType | undefined;
      description?: string | null | undefined;
    }
  ): Promise<CelestialBody> {
    return prisma.celestialBody.update({
      where: { celestialBodyId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.bodyType && { bodyType: data.bodyType }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
  }

  async delete(celestialBodyId: string): Promise<CelestialBody> {
    return prisma.celestialBody.delete({
      where: { celestialBodyId },
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

export const celestialBodiesRepository = new CelestialBodiesRepository();
