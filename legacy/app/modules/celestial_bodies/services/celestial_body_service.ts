import { CelestialBodyRepository, celestialBodyRepository } from '../repositories/celestial_body_repository.js';
import type { CelestialBodyModel } from '../models/celestial_body.js';
import { AppException } from '#exceptions/app_exception';
import type {
  ListCelestialBodiesQueryDto,
  CreateCelestialBodyRequestDto,
  UpdateCelestialBodyRequestDto,
} from '../validators/celestial_body.js';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class CelestialBodyService {
  constructor(private readonly repo: CelestialBodyRepository = celestialBodyRepository) {}

  async list(query: ListCelestialBodiesQueryDto): Promise<PaginatedResult<CelestialBodyModel>> {
    const page = query.page;
    const pageSize = query.pageSize;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this.repo.findMany({
        skip,
        take: pageSize,
        search: query.search,
        bodyType: query.bodyType,
        orderByField: query.sort,
        orderDirection: query.order,
      }),
      this.repo.count({
        search: query.search,
        bodyType: query.bodyType,
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getById(celestialBodyId: string): Promise<CelestialBodyModel> {
    const item = await this.repo.findById(celestialBodyId);
    if (!item) {
      throw AppException.notFound('CelestialBody', `Celestial body with ID '${celestialBodyId}' not found.`);
    }
    return item;
  }

  async create(dto: CreateCelestialBodyRequestDto): Promise<CelestialBodyModel> {
    const existing = await this.repo.findByName(dto.name);
    if (existing) {
      throw AppException.conflict(`A celestial body with name '${dto.name}' already exists.`);
    }

    return this.repo.create({
      name: dto.name,
      bodyType: dto.bodyType,
      description: dto.description,
    });
  }

  async update(celestialBodyId: string, dto: UpdateCelestialBodyRequestDto): Promise<CelestialBodyModel> {
    await this.getById(celestialBodyId);

    if (dto.name) {
      const existing = await this.repo.findByName(dto.name);
      if (existing && existing.celestialBodyId !== celestialBodyId) {
        throw AppException.conflict(`A celestial body with name '${dto.name}' already exists.`);
      }
    }

    return this.repo.update(celestialBodyId, {
      name: dto.name,
      bodyType: dto.bodyType,
      description: dto.description,
    });
  }

  async delete(celestialBodyId: string): Promise<CelestialBodyModel> {
    await this.getById(celestialBodyId);
    return this.repo.delete(celestialBodyId);
  }
}

export const celestialBodyService = new CelestialBodyService();
