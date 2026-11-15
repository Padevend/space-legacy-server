import { celestialBodyRepository, CelestialBodyRepository } from '../repositories/celestial_body_repository.js';
import type { CelestialBodyModel } from '../models/celestial_body.js';
import type { UpdateCelestialBodyInput } from '../validators/celestial_body.js';
import { AppException } from '#exceptions/app_exception';

export interface CelestialBodyAdminDto {
  id: string;
  slug: string;
  name: string;
  summary: string;
  imagePath: string | null;
  sortOrder: number;
  isPublished: boolean;
}

export class CelestialBodyService {
  constructor(private repo: CelestialBodyRepository = celestialBodyRepository) {}

  async getPublishedBodies(): Promise<CelestialBodyAdminDto[]> {
    const bodies = await this.repo.findPublished();
    return bodies.map((b) => this.toDto(b));
  }

  async getBodyBySlug(slug: string): Promise<CelestialBodyAdminDto | null> {
    const body = await this.repo.findBySlug(slug);
    return body && body.isPublished ? this.toDto(body) : null;
  }

  async updateBody(id: string, data: UpdateCelestialBodyInput): Promise<CelestialBodyAdminDto> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw AppException.notFound('CelestialBody', `Celestial body with id '${id}' not found.`);
    }

    const updated = await this.repo.update(id, data);
    return this.toDto(updated);
  }

  private toDto(model: CelestialBodyModel): CelestialBodyAdminDto {
    return {
      id: model.id,
      slug: model.slug,
      name: model.name,
      summary: model.summary,
      imagePath: model.imagePath,
      sortOrder: model.sortOrder,
      isPublished: model.isPublished,
    };
  }
}

export const celestialBodyService = new CelestialBodyService();
