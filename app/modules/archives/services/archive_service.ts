import { ArchiveRepository, archiveRepository } from '../repositories/archive_repository.js';
import type { ArchiveModel } from '../models/archive.js';
import type { ArchiveMissionModel } from '../models/archive_mission.js';
import type { ArchiveEquipmentModel } from '../models/archive_equipment.js';
import type { ArchiveEventModel } from '../models/archive_event.js';
import type { ArchiveSourceModel } from '../models/archive_source.js';
import { AppException } from '#exceptions/app_exception';
import type {
  ListArchivesQueryDto,
  CreateArchiveRequestDto,
  LinkArchiveMissionRequestDto,
  LinkArchiveEquipmentRequestDto,
  LinkArchiveEventRequestDto,
  LinkArchiveSourceRequestDto,
} from '../validators/archive.js';

export class ArchiveService {
  constructor(private readonly repo: ArchiveRepository = archiveRepository) {}

  async list(query: ListArchivesQueryDto): Promise<{ archives: ArchiveModel[]; total: number }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const listParams = {
      skip,
      take: pageSize,
      search: query.search,
      archiveProvider: query.archiveProvider,
      orderByField: (query.orderBy ?? 'retrievedAt') as 'archiveTitle' | 'archiveProvider' | 'retrievedAt',
      orderDirection: (query.order ?? 'desc') as 'asc' | 'desc',
    };

    const [archives, total] = await Promise.all([this.repo.findMany(listParams), this.repo.count(listParams)]);

    return { archives, total };
  }

  async getById(id: string): Promise<ArchiveModel> {
    const archive = await this.repo.findById(id);
    if (!archive) {
      throw AppException.notFound('Archive', `Archive with ID '${id}' not found.`);
    }
    return archive;
  }

  async create(dto: CreateArchiveRequestDto): Promise<ArchiveModel> {
    const existing = await this.repo.findByProviderAndExternalId(dto.archiveProvider, dto.externalId);
    if (existing) {
      throw AppException.conflict(
        `Archive with provider '${dto.archiveProvider}' and external ID '${dto.externalId}' already exists.`
      );
    }

    return this.repo.create({
      externalId: dto.externalId,
      archiveTitle: dto.archiveTitle,
      archiveProvider: dto.archiveProvider,
      originalUrl: dto.originalUrl,
      rawContent: dto.rawContent,
      archiveVersion: dto.archiveVersion ?? null,
      contentHash: dto.contentHash ?? null,
    });
  }

  async delete(id: string): Promise<ArchiveModel> {
    await this.getById(id);
    return this.repo.delete(id);
  }

  // Relations
  async linkMission(
    archiveId: string,
    missionId: string,
    dto: LinkArchiveMissionRequestDto
  ): Promise<ArchiveMissionModel> {
    await this.getById(archiveId);
    return this.repo.linkMission(archiveId, missionId, dto.sectionName);
  }

  async unlinkMission(archiveId: string, missionId: string): Promise<void> {
    try {
      await this.repo.unlinkMission(archiveId, missionId);
    } catch {
      throw AppException.notFound('ArchiveMission', 'Mission link not found for this archive.');
    }
  }

  async linkEquipment(
    archiveId: string,
    equipmentId: string,
    dto: LinkArchiveEquipmentRequestDto
  ): Promise<ArchiveEquipmentModel> {
    await this.getById(archiveId);
    return this.repo.linkEquipment(archiveId, equipmentId, dto.sectionName, dto.extractedReference);
  }

  async unlinkEquipment(archiveId: string, equipmentId: string): Promise<void> {
    try {
      await this.repo.unlinkEquipment(archiveId, equipmentId);
    } catch {
      throw AppException.notFound('ArchiveEquipment', 'Equipment link not found for this archive.');
    }
  }

  async linkEvent(archiveId: string, eventId: string, dto: LinkArchiveEventRequestDto): Promise<ArchiveEventModel> {
    await this.getById(archiveId);
    return this.repo.linkEvent(archiveId, eventId, dto.sectionName, dto.extractedReference);
  }

  async unlinkEvent(archiveId: string, eventId: string): Promise<void> {
    try {
      await this.repo.unlinkEvent(archiveId, eventId);
    } catch {
      throw AppException.notFound('ArchiveEvent', 'Event link not found for this archive.');
    }
  }

  async linkSource(archiveId: string, sourceId: string, dto: LinkArchiveSourceRequestDto): Promise<ArchiveSourceModel> {
    await this.getById(archiveId);
    return this.repo.linkSource(archiveId, sourceId, dto.referenceContext);
  }

  async unlinkSource(archiveId: string, sourceId: string): Promise<void> {
    try {
      await this.repo.unlinkSource(archiveId, sourceId);
    } catch {
      throw AppException.notFound('ArchiveSource', 'Source link not found for this archive.');
    }
  }
}

export const archiveService = new ArchiveService();
