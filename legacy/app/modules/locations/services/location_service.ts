import { LocationRepository, locationRepository } from '../repositories/location_repository.js';
import type { LocationModel } from '../models/location.js';
import type { EquipmentLocationModel } from '../models/equipment_location.js';
import { AppException } from '#exceptions/app_exception';
import type {
  ListLocationsQueryDto,
  CreateLocationRequestDto,
  UpdateLocationRequestDto,
  LinkEquipmentLocationDto,
} from '../validators/location.js';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class LocationService {
  constructor(private readonly repo: LocationRepository = locationRepository) {}

  async list(query: ListLocationsQueryDto): Promise<PaginatedResult<LocationModel>> {
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

  async getById(locationId: string): Promise<LocationModel> {
    const item = await this.repo.findById(locationId);
    if (!item) {
      throw AppException.notFound('Location', `Location with ID '${locationId}' not found.`);
    }
    return item;
  }

  async create(dto: CreateLocationRequestDto): Promise<LocationModel> {
    const existing = await this.repo.findByName(dto.name);
    if (existing) {
      throw AppException.conflict(`A location with name '${dto.name}' already exists.`);
    }

    return this.repo.create({
      celestialBodyId: dto.celestialBodyId,
      name: dto.name,
      locationType: dto.locationType,
      latitude: dto.latitude,
      longitude: dto.longitude,
      altitude: dto.altitude,
      referenceSystem: dto.referenceSystem,
      description: dto.description,
    });
  }

  async update(locationId: string, dto: UpdateLocationRequestDto): Promise<LocationModel> {
    await this.getById(locationId);

    if (dto.name) {
      const existing = await this.repo.findByName(dto.name);
      if (existing && existing.locationId !== locationId) {
        throw AppException.conflict(`A location with name '${dto.name}' already exists.`);
      }
    }

    return this.repo.update(locationId, {
      celestialBodyId: dto.celestialBodyId,
      name: dto.name,
      locationType: dto.locationType,
      latitude: dto.latitude,
      longitude: dto.longitude,
      altitude: dto.altitude,
      referenceSystem: dto.referenceSystem,
      description: dto.description,
    });
  }

  async delete(locationId: string): Promise<LocationModel> {
    await this.getById(locationId);
    return this.repo.delete(locationId);
  }

  async linkEquipment(equipmentId: string, dto: LinkEquipmentLocationDto): Promise<EquipmentLocationModel> {
    const targetLocationId = dto.locationId;
    if (!targetLocationId) {
      throw AppException.badRequest('Location ID is required.');
    }
    await this.getById(targetLocationId);

    const startDate = dto.startDate ? new Date(dto.startDate) : dto.dateArrival ? new Date(dto.dateArrival) : null;
    const endDate = dto.endDate ? new Date(dto.endDate) : dto.dateDeparture ? new Date(dto.dateDeparture) : null;
    const precision = dto.locationPrecision || 'UNKNOWN';

    return this.repo.linkEquipment({
      equipmentId,
      locationId: targetLocationId,
      startDate,
      endDate,
      locationPrecision: precision,
    });
  }

  async unlinkEquipment(equipmentId: string, locationId: string): Promise<void> {
    try {
      await this.repo.unlinkEquipment(equipmentId, locationId);
    } catch {
      throw AppException.notFound('EquipmentLocation', 'Location link not found for this equipment.');
    }
  }

  async getEquipmentLocations(equipmentId: string): Promise<EquipmentLocationModel[]> {
    return this.repo.findEquipmentLocations(equipmentId);
  }
}

export const locationService = new LocationService();
