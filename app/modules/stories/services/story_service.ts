import { StoryRepository, storyRepository } from '../repositories/story_repository.js';
import type { StoryModel } from '../models/story.js';
import type { StoryMissionModel } from '../models/story_mission.js';
import type { StoryEquipmentModel } from '../models/story_equipment.js';
import type { StoryEventModel } from '../models/story_event.js';
import type { StorySourceModel } from '../models/story_source.js';
import { AppException } from '#exceptions/app_exception';
import { sanitizePlainText } from '#infrastructure/security/sanitizer';
import type { PublicationStatus } from '#shared/enums';
import type {
  ListPublicStoriesQueryDto,
  ListAdminStoriesQueryDto,
  CreateStoryRequestDto,
  UpdateStoryRequestDto,
  StoryTransitionRequestDto,
  LinkStoryMissionRequestDto,
  LinkStoryEquipmentRequestDto,
  LinkStoryEventRequestDto,
  LinkStorySourceRequestDto,
} from '../validators/story.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_INCLUDES = ['missions', 'equipments', 'equipment', 'events', 'sources'];

const ALLOWED_TRANSITIONS: Record<PublicationStatus, PublicationStatus[]> = {
  DRAFT: ['REVIEW', 'ARCHIVED'],
  REVIEW: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
  PUBLISHED: ['DRAFT', 'ARCHIVED'],
  ARCHIVED: ['DRAFT'],
};

export class StoryService {
  constructor(private readonly repo: StoryRepository = storyRepository) {}

  private parseIncludes(includeParam?: string) {
    const includes = {
      missions: false,
      equipments: false,
      events: false,
      sources: false,
    };

    if (includeParam) {
      const parts = includeParam.split(',').map((p) => p.trim());
      if (parts.length > 3) {
        throw AppException.unprocessable('Maximum of 3 include relations allowed.');
      }

      for (const part of parts) {
        if (part.includes('.')) {
          throw AppException.badRequest('Nested includes deeper than one level are not supported.');
        }
        if (!ALLOWED_INCLUDES.includes(part)) {
          throw AppException.badRequest(`Invalid include relation: '${part}'. Allowed: ${ALLOWED_INCLUDES.join(', ')}`);
        }
        if (part === 'missions') includes.missions = true;
        if (part === 'equipments' || part === 'equipment') includes.equipments = true;
        if (part === 'events') includes.events = true;
        if (part === 'sources') includes.sources = true;
      }
    }

    return includes;
  }

  // ==========================================
  // PUBLIC OPERATIONS (PUBLISHED ONLY)
  // ==========================================

  async listPublic(query: ListPublicStoriesQueryDto): Promise<{ stories: StoryModel[]; total: number }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const listParams = {
      skip,
      take: pageSize,
      search: query.search,
      publicationStatus: 'PUBLISHED' as const,
      storyType: query.storyType,
      language: query.language,
      equipmentId: query.equipmentId,
      orderByField: (query.orderBy ?? 'publishedAt') as 'title' | 'publishedAt' | 'createdAt',
      orderDirection: (query.order ?? 'desc') as 'asc' | 'desc',
    };

    const [stories, total] = await Promise.all([this.repo.findMany(listParams), this.repo.count(listParams)]);

    return { stories, total };
  }

  async getPublicByIdOrSlug(idOrSlug: string, includeParam?: string): Promise<any> {
    const isUuid = UUID_REGEX.test(idOrSlug);
    const includes = this.parseIncludes(includeParam);

    const story = await this.repo.findByIdOrSlugWithIncludes(idOrSlug, isUuid, includes, true);
    if (!story || story.publicationStatus !== 'PUBLISHED') {
      throw AppException.notFound('Story', `Story '${idOrSlug}' not found.`);
    }

    return story;
  }

  // ==========================================
  // ADMIN OPERATIONS
  // ==========================================

  async listAdmin(query: ListAdminStoriesQueryDto): Promise<{ stories: StoryModel[]; total: number }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const listParams = {
      skip,
      take: pageSize,
      search: query.search,
      publicationStatus: query.publicationStatus,
      storyType: query.storyType,
      language: query.language,
      equipmentId: query.equipmentId,
      orderByField: (query.orderBy ?? 'updatedAt') as 'title' | 'publishedAt' | 'createdAt' | 'updatedAt',
      orderDirection: (query.order ?? 'desc') as 'asc' | 'desc',
    };

    const [stories, total] = await Promise.all([this.repo.findMany(listParams), this.repo.count(listParams)]);

    return { stories, total };
  }

  async getAdminByIdOrSlug(idOrSlug: string, includeParam?: string): Promise<any> {
    const isUuid = UUID_REGEX.test(idOrSlug);
    const includes = this.parseIncludes(includeParam);

    const story = await this.repo.findByIdOrSlugWithIncludes(idOrSlug, isUuid, includes, false);
    if (!story) {
      throw AppException.notFound('Story', `Story '${idOrSlug}' not found.`);
    }

    return story;
  }

  async create(data: CreateStoryRequestDto): Promise<StoryModel> {
    const existing = await this.repo.findBySlug(data.slug);
    if (existing) {
      throw AppException.conflict(`Story with slug '${data.slug}' already exists.`);
    }

    const sanitizedTitle = sanitizePlainText(data.title);
    const sanitizedHook = data.hook ? sanitizePlainText(data.hook) : null;
    const sanitizedContent = sanitizePlainText(data.content);

    return this.repo.create({
      title: sanitizedTitle,
      slug: data.slug,
      hook: sanitizedHook,
      content: sanitizedContent,
      storyType: data.storyType,
      durationSeconds: data.durationSeconds ?? null,
      language: data.language ?? 'en',
      publicationStatus: 'DRAFT',
      publishedAt: null,
    });
  }

  async update(id: string, data: UpdateStoryRequestDto): Promise<StoryModel> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw AppException.notFound('Story', `Story with ID '${id}' not found.`);
    }

    if (data.slug && data.slug !== existing.slug) {
      const duplicateSlug = await this.repo.findBySlug(data.slug);
      if (duplicateSlug) {
        throw AppException.conflict(`Story with slug '${data.slug}' already exists.`);
      }
    }

    const updateData: Parameters<StoryRepository['update']>[1] = {};

    if (data.title !== undefined) updateData.title = sanitizePlainText(data.title);
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.hook !== undefined) updateData.hook = data.hook ? sanitizePlainText(data.hook) : null;
    if (data.content !== undefined) updateData.content = sanitizePlainText(data.content);
    if (data.storyType !== undefined) updateData.storyType = data.storyType;
    if (data.durationSeconds !== undefined) updateData.durationSeconds = data.durationSeconds;
    if (data.language !== undefined) updateData.language = data.language;

    return this.repo.update(id, updateData);
  }

  async transition(id: string, dto: StoryTransitionRequestDto): Promise<StoryModel> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw AppException.notFound('Story', `Story with ID '${id}' not found.`);
    }

    const currentStatus = existing.publicationStatus;
    const targetStatus = dto.to;

    const allowed = ALLOWED_TRANSITIONS[currentStatus];
    if (!allowed.includes(targetStatus)) {
      throw AppException.conflict(
        `Cannot transition story from '${currentStatus}' to '${targetStatus}'. Allowed transitions: ${allowed.join(', ')}.`
      );
    }

    const publishedAt = targetStatus === 'PUBLISHED' ? new Date() : undefined;
    const updateData: Parameters<StoryRepository['update']>[1] = {
      publicationStatus: targetStatus,
      ...(publishedAt && { publishedAt }),
    };

    return this.repo.update(id, updateData);
  }

  async delete(id: string): Promise<StoryModel> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw AppException.notFound('Story', `Story with ID '${id}' not found.`);
    }

    return this.repo.delete(id);
  }

  // Relations
  async linkMission(storyId: string, missionId: string, dto: LinkStoryMissionRequestDto): Promise<StoryMissionModel> {
    const existing = await this.repo.findById(storyId);
    if (!existing) {
      throw AppException.notFound('Story', `Story with ID '${storyId}' not found.`);
    }

    return this.repo.linkMission(storyId, missionId, dto.displayOrder ?? 0);
  }

  async unlinkMission(storyId: string, missionId: string): Promise<void> {
    try {
      await this.repo.unlinkMission(storyId, missionId);
    } catch {
      throw AppException.notFound('StoryMission', 'Mission link not found for this story.');
    }
  }

  async linkEquipment(
    storyId: string,
    equipmentId: string,
    dto: LinkStoryEquipmentRequestDto
  ): Promise<StoryEquipmentModel> {
    const existing = await this.repo.findById(storyId);
    if (!existing) {
      throw AppException.notFound('Story', `Story with ID '${storyId}' not found.`);
    }

    return this.repo.linkEquipment(storyId, equipmentId, dto.displayOrder ?? 0, dto.narrativeRole);
  }

  async unlinkEquipment(storyId: string, equipmentId: string): Promise<void> {
    try {
      await this.repo.unlinkEquipment(storyId, equipmentId);
    } catch {
      throw AppException.notFound('StoryEquipment', 'Equipment link not found for this story.');
    }
  }

  async linkEvent(storyId: string, eventId: string, dto: LinkStoryEventRequestDto): Promise<StoryEventModel> {
    const existing = await this.repo.findById(storyId);
    if (!existing) {
      throw AppException.notFound('Story', `Story with ID '${storyId}' not found.`);
    }

    return this.repo.linkEvent(storyId, eventId, dto.displayOrder ?? 0);
  }

  async unlinkEvent(storyId: string, eventId: string): Promise<void> {
    try {
      await this.repo.unlinkEvent(storyId, eventId);
    } catch {
      throw AppException.notFound('StoryEvent', 'Event link not found for this story.');
    }
  }

  async linkSource(storyId: string, sourceId: string, dto: LinkStorySourceRequestDto): Promise<StorySourceModel> {
    const existing = await this.repo.findById(storyId);
    if (!existing) {
      throw AppException.notFound('Story', `Story with ID '${storyId}' not found.`);
    }

    return this.repo.linkSource(storyId, sourceId, dto.displayOrder ?? 0, dto.claimDescription);
  }

  async unlinkSource(storyId: string, sourceId: string): Promise<void> {
    try {
      await this.repo.unlinkSource(storyId, sourceId);
    } catch {
      throw AppException.notFound('StorySource', 'Source link not found for this story.');
    }
  }
}

export const storyService = new StoryService();
