import { prisma } from '#infrastructure/database/prisma_client';
import type { CelestialBodyModel } from '../models/celestial_body.js';
import type { CelestialBodyType } from '#shared/enums';

export interface CelestialBodyListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  bodyType?: CelestialBodyType | undefined;
  orderByField: 'name' | 'bodyType';
  orderDirection: 'asc' | 'desc';
}

export class CelestialBodyRepository {
  private mapRow(row: any): CelestialBodyModel {
    return {
      celestialBodyId: row.celestialBodyId,
      name: row.name,
      bodyType: row.bodyType,
      description: row.description,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async findMany(params: CelestialBodyListParams): Promise<CelestialBodyModel[]> {
    const where: any = {};
    if (params.search) {
      where.name = { contains: params.search, mode: 'insensitive' };
    }
    if (params.bodyType) {
      where.bodyType = params.bodyType;
    }

    const rows = await prisma.celestialBody.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.orderByField]: params.orderDirection },
    });
    return rows.map((r) => this.mapRow(r));
  }

  async count(params: Partial<CelestialBodyListParams>): Promise<number> {
    const where: any = {};
    if (params.search) {
      where.name = { contains: params.search, mode: 'insensitive' };
    }
    if (params.bodyType) {
      where.bodyType = params.bodyType;
    }
    return prisma.celestialBody.count({ where });
  }

  async findById(celestialBodyId: string): Promise<CelestialBodyModel | null> {
    const row = await prisma.celestialBody.findUnique({
      where: { celestialBodyId },
    });
    return row ? this.mapRow(row) : null;
  }

  async findByName(name: string): Promise<CelestialBodyModel | null> {
    const row = await prisma.celestialBody.findUnique({
      where: { name },
    });
    return row ? this.mapRow(row) : null;
  }

  async create(data: {
    name: string;
    bodyType: CelestialBodyType;
    description?: string | undefined;
  }): Promise<CelestialBodyModel> {
    const row = await prisma.celestialBody.create({
      data: {
        name: data.name,
        bodyType: data.bodyType,
        description: data.description ?? null,
      },
    });
    return this.mapRow(row);
  }

  async update(
    celestialBodyId: string,
    data: {
      name?: string | undefined;
      bodyType?: CelestialBodyType | undefined;
      description?: string | null | undefined;
    }
  ): Promise<CelestialBodyModel> {
    const row = await prisma.celestialBody.update({
      where: { celestialBodyId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.bodyType && { bodyType: data.bodyType }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
    return this.mapRow(row);
  }

  async delete(celestialBodyId: string): Promise<CelestialBodyModel> {
    const row = await prisma.celestialBody.delete({
      where: { celestialBodyId },
    });
    return this.mapRow(row);
  }
}

export const celestialBodyRepository = new CelestialBodyRepository();
