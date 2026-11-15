import { EquipmentRepository, equipmentRepository } from '../repositories/equipment_repository.js';
import type { EquipmentModel } from '../models/equipment.js';
import { EquipmentHierarchy } from '../models/equipment_hierarchy.js';
import { AppException } from '#exceptions/app_exception';
import type {
  ListEquipmentQueryDto,
  CreateEquipmentRequestDto,
  UpdateEquipmentRequestDto,
} from '../validators/equipment.js';

const ALLOWED_INCLUDES = ['parent', 'children', 'missions', 'locations'];

export class EquipmentService {
  constructor(private readonly repo: EquipmentRepository = equipmentRepository) {}

  async list(query: ListEquipmentQueryDto): Promise<{ equipment: EquipmentModel[]; total: number }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const listParams = {
      skip,
      take: pageSize,
      search: query.search,
      equipmentType: query.equipmentType,
      operationalStatus: query.operationalStatus,
      physicalStatus: query.physicalStatus,
      parentEquipmentId: query.parentEquipmentId,
      orderByField: (query.orderBy ?? 'name') as 'name' | 'equipmentType' | 'createdAt' | 'updatedAt',
      orderDirection: (query.order ?? 'asc') as 'asc' | 'desc',
    };

    const [equipment, total] = await Promise.all([this.repo.findMany(listParams), this.repo.count(listParams)]);

    return { equipment, total };
  }

  async getByIdOrSlug(idOrSlug: string, includeParam?: string): Promise<EquipmentModel> {
    const includes = {
      parent: false,
      children: false,
      people: false,
      missions: false,
      locations: false,
    };

    if (includeParam) {
      const requested = includeParam
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      if (requested.length > 3) {
        throw AppException.unprocessable('Maximum of 3 include relations allowed.');
      }
      for (const req of requested) {
        if (!ALLOWED_INCLUDES.includes(req)) {
          throw AppException.badRequest(
            `Invalid include relation '${req}'. Allowed relations for Equipment: ${ALLOWED_INCLUDES.join(', ')}`
          );
        }
        if (req === 'parent') includes.parent = true;
        if (req === 'children') includes.children = true;
        if (req === 'people') includes.people = true;
        if (req === 'missions') includes.missions = true;
        if (req === 'locations') includes.locations = true;
      }
    }

    const item = await this.repo.findByIdOrSlug(idOrSlug, includes);
    if (!item) {
      throw AppException.notFound('Equipment', `Equipment '${idOrSlug}' not found.`);
    }

    return item;
  }

  async getChildren(idOrSlug: string): Promise<EquipmentModel[]> {
    const parent = await this.getByIdOrSlug(idOrSlug);
    return this.repo.findChildren(parent.equipmentId);
  }

  async create(dto: CreateEquipmentRequestDto): Promise<EquipmentModel> {
    const existing = await this.repo.findBySlug(dto.slug);
    if (existing) {
      throw AppException.conflict(`Equipment with slug '${dto.slug}' already exists.`);
    }

    if (dto.parentEquipmentId) {
      const parent = await this.repo.findByIdOrSlug(dto.parentEquipmentId);
      if (!parent) {
        throw AppException.notFound(
          'Parent Equipment',
          `Parent equipment with ID '${dto.parentEquipmentId}' not found.`
        );
      }
    }

    return this.repo.create({
      parentEquipmentId: dto.parentEquipmentId,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      equipmentType: dto.equipmentType,
      manufacturer: dto.manufacturer,
      operationalStatus: dto.operationalStatus,
      physicalStatus: dto.physicalStatus,
    });
  }

  async update(id: string, dto: UpdateEquipmentRequestDto): Promise<EquipmentModel> {
    const current = await this.getByIdOrSlug(id);

    if (dto.slug) {
      const existing = await this.repo.findBySlug(dto.slug);
      if (existing && existing.equipmentId !== current.equipmentId) {
        throw AppException.conflict(`Equipment with slug '${dto.slug}' already exists.`);
      }
    }

    if (dto.parentEquipmentId !== undefined && dto.parentEquipmentId !== null) {
      await EquipmentHierarchy.assertNoCycle(current.equipmentId, dto.parentEquipmentId, (equipId) =>
        this.repo.getParentId(equipId)
      );

      const parent = await this.repo.findByIdOrSlug(dto.parentEquipmentId);
      if (!parent) {
        throw AppException.notFound(
          'Parent Equipment',
          `Parent equipment with ID '${dto.parentEquipmentId}' not found.`
        );
      }
    }

    return this.repo.update(current.equipmentId, {
      parentEquipmentId: dto.parentEquipmentId,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      equipmentType: dto.equipmentType,
      manufacturer: dto.manufacturer,
      operationalStatus: dto.operationalStatus,
      physicalStatus: dto.physicalStatus,
    });
  }

  async delete(id: string): Promise<EquipmentModel> {
    const current = await this.getByIdOrSlug(id);
    return this.repo.delete(current.equipmentId);
  }
}

export const equipmentService = new EquipmentService();
