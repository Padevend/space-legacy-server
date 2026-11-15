import { SourceRepository, sourceRepository } from '../repositories/source_repository.js';
import type { SourceModel } from '../models/source.js';
import type { SourceLinkModel } from '../models/source_link.js';
import { AppException } from '#exceptions/app_exception';
import type {
  ListSourcesQueryDto,
  CreateSourceRequestDto,
  UpdateSourceRequestDto,
  LinkSourceDto,
} from '../validators/source.js';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class SourceService {
  constructor(private readonly repo: SourceRepository = sourceRepository) {}

  async list(query: ListSourcesQueryDto): Promise<PaginatedResult<SourceModel>> {
    const page = query.page;
    const pageSize = query.pageSize;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this.repo.findMany({
        skip,
        take: pageSize,
        search: query.search,
        sourceType: query.sourceType,
        publisher: query.publisher,
        orderByField: query.sort,
        orderDirection: query.order,
      }),
      this.repo.count({
        search: query.search,
        sourceType: query.sourceType,
        publisher: query.publisher,
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

  async getById(sourceId: string): Promise<SourceModel> {
    const item = await this.repo.findById(sourceId);
    if (!item) {
      throw AppException.notFound('Source', `Source with ID '${sourceId}' not found.`);
    }
    return item;
  }

  async create(dto: CreateSourceRequestDto): Promise<SourceModel> {
    const pubDate = dto.publicationDate ? new Date(dto.publicationDate) : null;
    return this.repo.create({
      title: dto.title,
      url: dto.url,
      publisher: dto.publisher,
      author: dto.author,
      publicationDate: pubDate,
      sourceType: dto.sourceType,
    });
  }

  async update(sourceId: string, dto: UpdateSourceRequestDto): Promise<SourceModel> {
    await this.getById(sourceId);
    const pubDate =
      dto.publicationDate !== undefined ? (dto.publicationDate ? new Date(dto.publicationDate) : null) : undefined;

    return this.repo.update(sourceId, {
      title: dto.title,
      url: dto.url,
      publisher: dto.publisher,
      author: dto.author,
      publicationDate: pubDate,
      sourceType: dto.sourceType,
    });
  }

  async delete(sourceId: string): Promise<SourceModel> {
    await this.getById(sourceId);
    return this.repo.delete(sourceId);
  }

  async linkEquipment(equipmentId: string, dto: LinkSourceDto): Promise<SourceLinkModel> {
    if (!dto.sourceId) throw AppException.badRequest('sourceId is required');
    await this.getById(dto.sourceId);
    return this.repo.linkEquipment(equipmentId, dto.sourceId, dto.claimDescription);
  }

  async unlinkEquipment(equipmentId: string, sourceId: string): Promise<void> {
    try {
      await this.repo.unlinkEquipment(equipmentId, sourceId);
    } catch {
      throw AppException.notFound('EquipmentSource', 'Source link not found for this equipment.');
    }
  }

  async linkMission(missionId: string, dto: LinkSourceDto): Promise<SourceLinkModel> {
    if (!dto.sourceId) throw AppException.badRequest('sourceId is required');
    await this.getById(dto.sourceId);
    return this.repo.linkMission(missionId, dto.sourceId, dto.claimDescription);
  }

  async unlinkMission(missionId: string, sourceId: string): Promise<void> {
    try {
      await this.repo.unlinkMission(missionId, sourceId);
    } catch {
      throw AppException.notFound('MissionSource', 'Source link not found for this mission.');
    }
  }

  async linkEvent(eventId: string, dto: LinkSourceDto): Promise<SourceLinkModel> {
    if (!dto.sourceId) throw AppException.badRequest('sourceId is required');
    await this.getById(dto.sourceId);
    return this.repo.linkEvent(eventId, dto.sourceId, dto.claimDescription);
  }

  async unlinkEvent(eventId: string, sourceId: string): Promise<void> {
    try {
      await this.repo.unlinkEvent(eventId, sourceId);
    } catch {
      throw AppException.notFound('EventSource', 'Source link not found for this event.');
    }
  }
}

export const sourceService = new SourceService();
