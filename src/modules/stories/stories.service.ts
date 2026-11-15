import { storiesRepository, type StoriesRepository } from './stories.repository.js';
import { AppException } from '../../core/exceptions/AppException.js';
import { sanitizePlainText } from '../../core/security/sanitize.js';
import type {
  ListPublicStoriesQueryDto,
  ListAdminStoriesQueryDto,
  CreateStoryRequestDto,
  UpdateStoryRequestDto,
  StoryTransitionRequestDto,
  LinkStoryMissionRequestDto,
  LinkStoryEquipmentRequestDto,
  LinkStoryEventRequestDto,
  LinkStoryMediaRequestDto,
  LinkStorySourceRequestDto,
} from './stories.schemas.js';
import type { Story, PublicationStatus } from '@prisma/client';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_INCLUDES = ['missions', 'equipments', 'events', 'media', 'sources'];

const ALLOWED_TRANSITIONS: Record<PublicationStatus, PublicationStatus[]> = {
  DRAFT: ['REVIEW', 'ARCHIVED'],
  REVIEW: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
  PUBLISHED: ['DRAFT', 'ARCHIVED'],
  ARCHIVED: ['DRAFT'],
};

export interface AuditContext {
  actorId?: string | undefined;
  requestId?: string | undefined;
}

export class StoriesService {
  constructor(private readonly repository: StoriesRepository = storiesRepository) {}

  private parseIncludes(includeParam?: string) {
    const includes = {
      missions: false,
      equipments: false,
      events: false,
      media: false,
      sources: false,
    };

    if (includeParam) {
      const parts = includeParam.split(',').map((p) => p.trim());
      if (parts.length > 3) {
        throw AppException.unprocessable('Maximum of 3 include relations allowed.');
      }

      for (const part of parts) {
        if (part.includes('.')) {
          throw AppException.unprocessable('Nested includes deeper than one level are not supported.');
        }
        if (!ALLOWED_INCLUDES.includes(part)) {
          throw AppException.unprocessable(
            `Invalid include relation: '${part}'. Allowed: ${ALLOWED_INCLUDES.join(', ')}`
          );
        }
        if (part === 'missions') includes.missions = true;
        if (part === 'equipments') includes.equipments = true;
        if (part === 'events') includes.events = true;
        if (part === 'media') includes.media = true;
        if (part === 'sources') includes.sources = true;
      }
    }

    return includes;
  }

  // ==========================================
  // PUBLIC OPERATIONS (PUBLISHED ONLY)
  // ==========================================

  async listPublic(query: ListPublicStoriesQueryDto): Promise<{ stories: Story[]; total: number }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const listParams = {
      skip,
      take: pageSize,
      search: query.search,
      publicationStatus: 'PUBLISHED' as const, // Strict enforcement
      storyType: query.storyType,
      language: query.language,
      equipmentId: query.equipmentId,
      orderByField: (query.orderBy ?? 'publishedAt') as 'title' | 'publishedAt' | 'createdAt',
      orderDirection: (query.order ?? 'desc') as 'asc' | 'desc',
    };

    const [stories, total] = await Promise.all([
      this.repository.findMany(listParams),
      this.repository.count(listParams),
    ]);

    return { stories, total };
  }

  async getPublicByIdOrSlug(idOrSlug: string, includeParam?: string) {
    const isUuid = UUID_REGEX.test(idOrSlug);
    const includes = this.parseIncludes(includeParam);

    const story = await this.repository.findByIdOrSlugWithIncludes(idOrSlug, isUuid, includes, true);
    if (!story || story.publicationStatus !== 'PUBLISHED') {
      // Reveal nothing about existence of draft/archived stories
      throw AppException.notFound(`Story '${idOrSlug}' not found.`);
    }

    return story;
  }

  // ==========================================
  // ADMIN OPERATIONS
  // ==========================================

  async listAdmin(query: ListAdminStoriesQueryDto): Promise<{ stories: Story[]; total: number }> {
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

    const [stories, total] = await Promise.all([
      this.repository.findMany(listParams),
      this.repository.count(listParams),
    ]);

    return { stories, total };
  }

  async getAdminByIdOrSlug(idOrSlug: string, includeParam?: string) {
    const isUuid = UUID_REGEX.test(idOrSlug);
    const includes = this.parseIncludes(includeParam);

    const story = await this.repository.findByIdOrSlugWithIncludes(idOrSlug, isUuid, includes, false);
    if (!story) {
      throw AppException.notFound(`Story '${idOrSlug}' not found.`);
    }

    return story;
  }

  async create(data: CreateStoryRequestDto, ctx: AuditContext = {}): Promise<Story> {
    const existing = await this.repository.findBySlug(data.slug);
    if (existing) {
      throw AppException.conflict(`Story with slug '${data.slug}' already exists.`);
    }

    const sanitizedTitle = sanitizePlainText(data.title);
    const sanitizedHook = data.hook ? sanitizePlainText(data.hook) : null;
    const sanitizedContent = sanitizePlainText(data.content);

    const created = await this.repository.create({
      title: sanitizedTitle,
      slug: data.slug,
      hook: sanitizedHook,
      content: sanitizedContent,
      storyType: data.storyType,
      durationSeconds: data.durationSeconds ?? null,
      language: data.language ?? 'en',
      publicationStatus: 'DRAFT', // Always starts in DRAFT
      publishedAt: null,
    });

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'CREATE',
      entity: 'Story',
      entityId: created.storyId,
      requestId: ctx.requestId,
      diffSummary: { title: created.title, slug: created.slug },
    });

    return created;
  }

  async update(id: string, data: UpdateStoryRequestDto, ctx: AuditContext = {}): Promise<Story> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw AppException.notFound(`Story with ID '${id}' not found.`);
    }

    if (data.slug && data.slug !== existing.slug) {
      const duplicateSlug = await this.repository.findBySlug(data.slug);
      if (duplicateSlug) {
        throw AppException.conflict(`Story with slug '${data.slug}' already exists.`);
      }
    }

    const updateData: Parameters<StoriesRepository['update']>[1] = {};

    if (data.title !== undefined) updateData.title = sanitizePlainText(data.title);
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.hook !== undefined) updateData.hook = data.hook ? sanitizePlainText(data.hook) : null;
    if (data.content !== undefined) updateData.content = sanitizePlainText(data.content);
    if (data.storyType !== undefined) updateData.storyType = data.storyType;
    if (data.durationSeconds !== undefined) updateData.durationSeconds = data.durationSeconds;
    if (data.language !== undefined) updateData.language = data.language;

    const updated = await this.repository.update(id, updateData);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'UPDATE',
      entity: 'Story',
      entityId: updated.storyId,
      requestId: ctx.requestId,
      diffSummary: { updatedFields: Object.keys(data) },
    });

    return updated;
  }

  async transition(id: string, dto: StoryTransitionRequestDto, ctx: AuditContext = {}): Promise<Story> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw AppException.notFound(`Story with ID '${id}' not found.`);
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
    const updateData: Parameters<StoriesRepository['update']>[1] = {
      publicationStatus: targetStatus,
      ...(publishedAt && { publishedAt }),
    };

    const updated = await this.repository.update(id, updateData);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'TRANSITION',
      entity: 'Story',
      entityId: updated.storyId,
      requestId: ctx.requestId,
      diffSummary: {
        from: currentStatus,
        to: targetStatus,
        publishedAt: publishedAt ? publishedAt.toISOString() : null,
      },
    });

    return updated;
  }

  async delete(id: string, ctx: AuditContext = {}): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw AppException.notFound(`Story with ID '${id}' not found.`);
    }

    await this.repository.delete(id);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'DELETE',
      entity: 'Story',
      entityId: id,
      requestId: ctx.requestId,
    });
  }

  // ==========================================
  // RELATIONS
  // ==========================================

  async linkMission(storyId: string, missionId: string, dto: LinkStoryMissionRequestDto, ctx: AuditContext = {}) {
    const [story, mission] = await Promise.all([
      this.repository.findById(storyId),
      this.repository.findMissionById(missionId),
    ]);

    if (!story) throw AppException.notFound(`Story with ID '${storyId}' not found.`);
    if (!mission) throw AppException.notFound(`Mission with ID '${missionId}' not found.`);

    await this.repository.linkMission(storyId, missionId, dto.displayOrder);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'LINK_MISSION',
      entity: 'Story',
      entityId: storyId,
      requestId: ctx.requestId,
      diffSummary: { missionId, displayOrder: dto.displayOrder },
    });
  }

  async unlinkMission(storyId: string, missionId: string, ctx: AuditContext = {}) {
    const link = await this.repository.findMissionLink(storyId, missionId);
    if (!link) throw AppException.notFound('Story-Mission association not found.');

    await this.repository.unlinkMission(storyId, missionId);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'UNLINK_MISSION',
      entity: 'Story',
      entityId: storyId,
      requestId: ctx.requestId,
      diffSummary: { missionId },
    });
  }

  async linkEquipment(storyId: string, equipmentId: string, dto: LinkStoryEquipmentRequestDto, ctx: AuditContext = {}) {
    const [story, equipment] = await Promise.all([
      this.repository.findById(storyId),
      this.repository.findEquipmentById(equipmentId),
    ]);

    if (!story) throw AppException.notFound(`Story with ID '${storyId}' not found.`);
    if (!equipment) throw AppException.notFound(`Equipment with ID '${equipmentId}' not found.`);

    await this.repository.linkEquipment(storyId, equipmentId, dto.displayOrder, dto.narrativeRole);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'LINK_EQUIPMENT',
      entity: 'Story',
      entityId: storyId,
      requestId: ctx.requestId,
      diffSummary: { equipmentId, displayOrder: dto.displayOrder, narrativeRole: dto.narrativeRole },
    });
  }

  async unlinkEquipment(storyId: string, equipmentId: string, ctx: AuditContext = {}) {
    const link = await this.repository.findEquipmentLink(storyId, equipmentId);
    if (!link) throw AppException.notFound('Story-Equipment association not found.');

    await this.repository.unlinkEquipment(storyId, equipmentId);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'UNLINK_EQUIPMENT',
      entity: 'Story',
      entityId: storyId,
      requestId: ctx.requestId,
      diffSummary: { equipmentId },
    });
  }

  async linkEvent(storyId: string, eventId: string, dto: LinkStoryEventRequestDto, ctx: AuditContext = {}) {
    const [story, event] = await Promise.all([
      this.repository.findById(storyId),
      this.repository.findEventById(eventId),
    ]);

    if (!story) throw AppException.notFound(`Story with ID '${storyId}' not found.`);
    if (!event) throw AppException.notFound(`Event with ID '${eventId}' not found.`);

    await this.repository.linkEvent(storyId, eventId, dto.displayOrder);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'LINK_EVENT',
      entity: 'Story',
      entityId: storyId,
      requestId: ctx.requestId,
      diffSummary: { eventId, displayOrder: dto.displayOrder },
    });
  }

  async unlinkEvent(storyId: string, eventId: string, ctx: AuditContext = {}) {
    const link = await this.repository.findEventLink(storyId, eventId);
    if (!link) throw AppException.notFound('Story-Event association not found.');

    await this.repository.unlinkEvent(storyId, eventId);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'UNLINK_EVENT',
      entity: 'Story',
      entityId: storyId,
      requestId: ctx.requestId,
      diffSummary: { eventId },
    });
  }

  async linkMedia(storyId: string, mediaId: string, dto: LinkStoryMediaRequestDto, ctx: AuditContext = {}) {
    const [story, media] = await Promise.all([
      this.repository.findById(storyId),
      this.repository.findMediaById(mediaId),
    ]);

    if (!story) throw AppException.notFound(`Story with ID '${storyId}' not found.`);
    if (!media) throw AppException.notFound(`Media with ID '${mediaId}' not found.`);

    await this.repository.linkMedia(storyId, mediaId, dto.displayOrder, dto.captionOverride);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'LINK_MEDIA',
      entity: 'Story',
      entityId: storyId,
      requestId: ctx.requestId,
      diffSummary: { mediaId, displayOrder: dto.displayOrder, captionOverride: dto.captionOverride },
    });
  }

  async unlinkMedia(storyId: string, mediaId: string, ctx: AuditContext = {}) {
    const link = await this.repository.findMediaLink(storyId, mediaId);
    if (!link) throw AppException.notFound('Story-Media association not found.');

    await this.repository.unlinkMedia(storyId, mediaId);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'UNLINK_MEDIA',
      entity: 'Story',
      entityId: storyId,
      requestId: ctx.requestId,
      diffSummary: { mediaId },
    });
  }

  async linkSource(storyId: string, sourceId: string, dto: LinkStorySourceRequestDto, ctx: AuditContext = {}) {
    const [story, source] = await Promise.all([
      this.repository.findById(storyId),
      this.repository.findSourceById(sourceId),
    ]);

    if (!story) throw AppException.notFound(`Story with ID '${storyId}' not found.`);
    if (!source) throw AppException.notFound(`Source with ID '${sourceId}' not found.`);

    await this.repository.linkSource(storyId, sourceId, dto.displayOrder, dto.claimDescription);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'LINK_SOURCE',
      entity: 'Story',
      entityId: storyId,
      requestId: ctx.requestId,
      diffSummary: { sourceId, displayOrder: dto.displayOrder, claimDescription: dto.claimDescription },
    });
  }

  async unlinkSource(storyId: string, sourceId: string, ctx: AuditContext = {}) {
    const link = await this.repository.findSourceLink(storyId, sourceId);
    if (!link) throw AppException.notFound('Story-Source association not found.');

    await this.repository.unlinkSource(storyId, sourceId);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'UNLINK_SOURCE',
      entity: 'Story',
      entityId: storyId,
      requestId: ctx.requestId,
      diffSummary: { sourceId },
    });
  }
}

export const storiesService = new StoriesService();
