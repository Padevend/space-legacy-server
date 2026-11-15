import { celestialBodyRepository, CelestialBodyRepository } from '../repositories/celestial_body_repository.js';
import type { CelestialBodyModel } from '../models/celestial_body.js';
import type { CelestialBodyDto } from '../validators/celestial_body.js';

export class CelestialBodyService {
  constructor(private repo: CelestialBodyRepository = celestialBodyRepository) {}

  async getPublishedBodies(): Promise<CelestialBodyDto[]> {
    const bodies = await this.repo.findPublished();
    return bodies.map((b) => this.toDto(b));
  }

  async getBodyBySlug(slug: string): Promise<CelestialBodyDto | null> {
    const body = await this.repo.findBySlug(slug);
    return body && body.isPublished ? this.toDto(body) : null;
  }

  private toDto(model: CelestialBodyModel): CelestialBodyDto {
    return {
      id: model.id,
      slug: model.slug,
      name: model.name,
      summary: model.summary,
      imagePath: model.imagePath,
      sortOrder: model.sortOrder,
    };
  }
}

export const celestialBodyService = new CelestialBodyService();
