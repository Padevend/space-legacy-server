import { MissionRepository, missionRepository } from '../repositories/mission_repository.js';
import type { MissionModel } from '../models/mission.js';
import type { MissionEquipmentModel } from '../models/mission_equipment.js';
import { AppException } from '#exceptions/app_exception';
import type {
  ListMissionsQueryDto,
  CreateMissionRequestDto,
  UpdateMissionRequestDto,
  LinkMissionEquipmentDto,
} from '../validators/mission.js';

const ALLOWED_INCLUDES = ['equipment', 'sources'];

export class MissionService {
  constructor(private readonly repo: MissionRepository = missionRepository) {}

  async list(query: ListMissionsQueryDto): Promise<{ missions: MissionModel[]; total: number }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const listParams = {
      skip,
      take: pageSize,
      search: query.search,
      missionStatus: query.missionStatus,
      agency: query.agency,
      orderByField: (query.orderBy ?? 'name') as 'name' | 'createdAt' | 'updatedAt',
      orderDirection: (query.order ?? 'asc') as 'asc' | 'desc',
    };

    const [missions, total] = await Promise.all([this.repo.findMany(listParams), this.repo.count(listParams)]);

    return { missions, total };
  }

  async getByIdOrSlug(idOrSlug: string, includeParam?: string): Promise<MissionModel> {
    const includes = {
      equipment: false,
      sources: false,
    };

    if (includeParam) {
      const requested = includeParam
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      if (requested.length > 2) {
        throw AppException.unprocessable('Maximum of 2 include relations allowed.');
      }
      for (const req of requested) {
        if (!ALLOWED_INCLUDES.includes(req)) {
          throw AppException.unprocessable(
            `Invalid include relation '${req}'. Allowed relations for Mission: ${ALLOWED_INCLUDES.join(', ')}`
          );
        }
        if (req === 'equipment') includes.equipment = true;
        if (req === 'sources') includes.sources = true;
      }
    }

    const mission = await this.repo.findByIdOrSlug(idOrSlug, includes);
    if (!mission) {
      throw AppException.notFound('Mission', `Mission '${idOrSlug}' not found.`);
    }

    return mission;
  }

  async create(dto: CreateMissionRequestDto): Promise<MissionModel> {
    const existing = await this.repo.findBySlug(dto.slug);
    if (existing) {
      throw AppException.conflict(`Mission with slug '${dto.slug}' already exists.`);
    }

    return this.repo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      agency: dto.agency,
      missionStatus: dto.missionStatus,
    });
  }

  async update(id: string, dto: UpdateMissionRequestDto): Promise<MissionModel> {
    await this.getByIdOrSlug(id);

    if (dto.slug) {
      const existing = await this.repo.findBySlug(dto.slug);
      if (existing && existing.missionId !== id) {
        throw AppException.conflict(`Mission with slug '${dto.slug}' already exists.`);
      }
    }

    return this.repo.update(id, {
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      agency: dto.agency,
      missionStatus: dto.missionStatus,
    });
  }

  async delete(id: string): Promise<MissionModel> {
    await this.getByIdOrSlug(id);
    return this.repo.delete(id);
  }

  async linkEquipment(
    missionId: string,
    equipmentId: string,
    dto: LinkMissionEquipmentDto
  ): Promise<MissionEquipmentModel> {
    await this.getByIdOrSlug(missionId);
    const missionRole = dto.missionRole ?? dto.role ?? 'Primary Equipment';
    return this.repo.linkEquipment(missionId, equipmentId, missionRole, dto.participationDescription);
  }

  async unlinkEquipment(missionId: string, equipmentId: string): Promise<void> {
    try {
      await this.repo.unlinkEquipment(missionId, equipmentId);
    } catch {
      throw AppException.notFound('MissionEquipment', 'Equipment link not found for this mission.');
    }
  }
}

export const missionService = new MissionService();
