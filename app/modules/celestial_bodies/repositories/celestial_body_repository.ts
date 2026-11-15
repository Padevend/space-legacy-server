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
}

export const celestialBodyRepository = new CelestialBodyRepository();
