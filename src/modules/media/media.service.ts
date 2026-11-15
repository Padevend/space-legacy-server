import { mediaRepository, type MediaRepository } from './media.repository.js';
import { AppException } from '../../core/exceptions/AppException.js';
import { sanitizePlainText } from '../../core/security/sanitize.js';
import type {
  ListMediaQueryDto,
  CreateMediaRequestDto,
  UpdateMediaRequestDto,
  LinkMediaEquipmentRequestDto,
} from './media.schemas.js';
import type { Media } from '@prisma/client';

const ALLOWED_INCLUDES = ['equipments', 'stories'];

export interface AuditContext {
  actorId?: string | undefined;
  requestId?: string | undefined;
}

export class MediaService {
  constructor(private readonly repository: MediaRepository = mediaRepository) {}

  async list(query: ListMediaQueryDto): Promise<{ media: Media[]; total: number }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const listParams = {
      skip,
      take: pageSize,
      search: query.search,
      mediaType: query.mediaType,
      provenanceType: query.provenanceType,
      orderByField: (query.orderBy ?? 'title') as 'title' | 'mediaType' | 'provenanceType',
      orderDirection: (query.order ?? 'asc') as 'asc' | 'desc',
    };

    const [media, total] = await Promise.all([this.repository.findMany(listParams), this.repository.count(listParams)]);

    return { media, total };
  }

  async getById(id: string, includeParam?: string) {
    const includes = {
      equipments: false,
      stories: false,
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
        if (part === 'equipments') includes.equipments = true;
        if (part === 'stories') includes.stories = true;
      }
    }

    const media = await this.repository.findByIdWithIncludes(id, includes);
    if (!media) {
      throw AppException.notFound(`Media with ID '${id}' not found.`);
    }

    return media;
  }

  async create(data: CreateMediaRequestDto, ctx: AuditContext = {}): Promise<Media> {
    const sanitizedTitle = sanitizePlainText(data.title);
    const sanitizedCaption = data.caption ? sanitizePlainText(data.caption) : null;
    const sanitizedCredit = data.credit ? sanitizePlainText(data.credit) : null;
    const sanitizedAltText = data.altText ? sanitizePlainText(data.altText) : null;

    const created = await this.repository.create({
      title: sanitizedTitle,
      mediaType: data.mediaType,
      url: data.url,
      thumbnailUrl: data.thumbnailUrl ?? null,
      caption: sanitizedCaption,
      credit: sanitizedCredit,
      creditUrl: data.creditUrl ?? null,
      provenanceType: data.provenanceType,
      altText: sanitizedAltText,
      downloadStatus: data.downloadStatus ?? 'EXTERNAL_ONLY',
    });

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'CREATE',
      entity: 'Media',
      entityId: created.mediaId,
      requestId: ctx.requestId,
      diffSummary: { title: created.title, provenanceType: created.provenanceType },
    });

    return created;
  }

  async update(id: string, data: UpdateMediaRequestDto, ctx: AuditContext = {}): Promise<Media> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw AppException.notFound(`Media with ID '${id}' not found.`);
    }

    const updateData: Parameters<MediaRepository['update']>[1] = {};

    if (data.title !== undefined) updateData.title = sanitizePlainText(data.title);
    if (data.mediaType !== undefined) updateData.mediaType = data.mediaType;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;
    if (data.caption !== undefined) updateData.caption = data.caption ? sanitizePlainText(data.caption) : null;
    if (data.credit !== undefined) updateData.credit = data.credit ? sanitizePlainText(data.credit) : null;
    if (data.creditUrl !== undefined) updateData.creditUrl = data.creditUrl;
    if (data.provenanceType !== undefined) updateData.provenanceType = data.provenanceType;
    if (data.altText !== undefined) updateData.altText = data.altText ? sanitizePlainText(data.altText) : null;
    if (data.downloadStatus !== undefined) updateData.downloadStatus = data.downloadStatus;

    const updated = await this.repository.update(id, updateData);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'UPDATE',
      entity: 'Media',
      entityId: updated.mediaId,
      requestId: ctx.requestId,
      diffSummary: { updatedFields: Object.keys(data) },
    });

    return updated;
  }

  async delete(id: string, ctx: AuditContext = {}): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw AppException.notFound(`Media with ID '${id}' not found.`);
    }

    await this.repository.delete(id);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'DELETE',
      entity: 'Media',
      entityId: id,
      requestId: ctx.requestId,
    });
  }

  async linkEquipment(mediaId: string, equipmentId: string, dto: LinkMediaEquipmentRequestDto, ctx: AuditContext = {}) {
    const [media, equipment] = await Promise.all([
      this.repository.findById(mediaId),
      this.repository.findEquipmentById(equipmentId),
    ]);

    if (!media) throw AppException.notFound(`Media with ID '${mediaId}' not found.`);
    if (!equipment) throw AppException.notFound(`Equipment with ID '${equipmentId}' not found.`);

    await this.repository.linkEquipment(mediaId, equipmentId, dto.representationType);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'LINK_EQUIPMENT',
      entity: 'Media',
      entityId: mediaId,
      requestId: ctx.requestId,
      diffSummary: { equipmentId, representationType: dto.representationType },
    });
  }

  async unlinkEquipment(mediaId: string, equipmentId: string, ctx: AuditContext = {}) {
    const link = await this.repository.findEquipmentLink(mediaId, equipmentId);
    if (!link) {
      throw AppException.notFound('Media-Equipment association not found.');
    }

    await this.repository.unlinkEquipment(mediaId, equipmentId);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'UNLINK_EQUIPMENT',
      entity: 'Media',
      entityId: mediaId,
      requestId: ctx.requestId,
      diffSummary: { equipmentId },
    });
  }
}

export const mediaService = new MediaService();
