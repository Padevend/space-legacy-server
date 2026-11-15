import type { Location } from '@prisma/client';
import { locationsRepository, type LocationsRepository } from './locations.repository.js';
import { AppException } from '../../core/exceptions/AppException.js';
import type { ListLocationsQueryDto, CreateLocationRequestDto, UpdateLocationRequestDto } from './locations.schemas.js';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class LocationsService {
  constructor(private readonly repo: LocationsRepository = locationsRepository) {}

  async list(query: ListLocationsQueryDto): Promise<PaginatedResult<Location>> {
    const page = query.page;
    const pageSize = query.pageSize;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this.repo.findMany({
        skip,
        take: pageSize,
        search: query.search,
        celestialBodyId: query.celestialBodyId,
        locationType: query.locationType,
        orderByField: query.sort,
        orderDirection: query.order,
      }),
      this.repo.count({
        search: query.search,
        celestialBodyId: query.celestialBodyId,
        locationType: query.locationType,
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

  async getById(id: string): Promise<Location> {
    const location = await this.repo.findById(id);
    if (!location) {
      throw AppException.notFound('Location', `Location with ID '${id}' not found.`);
    }
    return location;
  }

  async create(dto: CreateLocationRequestDto, context: { actorId: string; requestId: string }): Promise<Location> {
    const created = await this.repo.create({
      name: dto.name,
      locationType: dto.locationType,
      celestialBodyId: dto.celestialBodyId,
      latitude: dto.latitude,
      longitude: dto.longitude,
      altitude: dto.altitude,
      referenceSystem: dto.referenceSystem,
      description: dto.description,
    });

    await this.repo.createAuditLog({
      actorId: context.actorId,
      action: 'LOCATION_CREATED',
      entity: 'Location',
      entityId: created.locationId,
      requestId: context.requestId,
      diffSummary: { name: created.name, locationType: created.locationType },
    });

    return created;
  }

  async update(
    id: string,
    dto: UpdateLocationRequestDto,
    context: { actorId: string; requestId: string }
  ): Promise<Location> {
    await this.getById(id);

    const updated = await this.repo.update(id, {
      name: dto.name,
      locationType: dto.locationType,
      celestialBodyId: dto.celestialBodyId,
      latitude: dto.latitude,
      longitude: dto.longitude,
      altitude: dto.altitude,
      referenceSystem: dto.referenceSystem,
      description: dto.description,
    });

    await this.repo.createAuditLog({
      actorId: context.actorId,
      action: 'LOCATION_UPDATED',
      entity: 'Location',
      entityId: updated.locationId,
      requestId: context.requestId,
      diffSummary: { name: updated.name, locationType: updated.locationType },
    });

    return updated;
  }

  async delete(id: string, context: { actorId: string; requestId: string }): Promise<void> {
    const location = await this.getById(id);

    await this.repo.delete(id);

    await this.repo.createAuditLog({
      actorId: context.actorId,
      action: 'LOCATION_DELETED',
      entity: 'Location',
      entityId: id,
      requestId: context.requestId,
      diffSummary: { deletedName: location.name },
    });
  }
}

export const locationsService = new LocationsService();
