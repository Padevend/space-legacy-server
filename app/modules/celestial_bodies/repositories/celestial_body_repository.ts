import { prisma } from '#infrastructure/database/prisma_client';
import type { CelestialBodyModel } from '../models/celestial_body.js';

export class CelestialBodyRepository {
  async findPublished(): Promise<CelestialBodyModel[]> {
    return prisma.celestialBody.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findBySlug(slug: string): Promise<CelestialBodyModel | null> {
    return prisma.celestialBody.findUnique({
      where: { slug },
    });
  }

  async findById(id: string): Promise<CelestialBodyModel | null> {
    return prisma.celestialBody.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Partial<any>): Promise<CelestialBodyModel> {
    const payload: Record<string, any> = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.summary !== undefined) payload.summary = data.summary;
    if (data.imagePath !== undefined) payload.imagePath = data.imagePath;
    if (data.sortOrder !== undefined) payload.sortOrder = data.sortOrder;
    if (data.isPublished !== undefined) payload.isPublished = data.isPublished;

    return prisma.celestialBody.update({
      where: { id },
      data: payload,
    });
  }
}

export const celestialBodyRepository = new CelestialBodyRepository();
