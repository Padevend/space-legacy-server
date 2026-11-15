import { MediaRepository, mediaRepository } from '../repositories/media_repository.js';
import type { MediaModel } from '../models/media.js';
import type { EquipmentMediaModel } from '../models/equipment_media.js';
import { AppException } from '#exceptions/app_exception';
import { sanitizePlainText } from '#infrastructure/security/sanitizer';
import type {
  ListMediaQueryDto,
  CreateMediaRequestDto,
  UpdateMediaRequestDto,
  LinkMediaEquipmentRequestDto,
} from '../validators/media.js';

const ALLOWED_INCLUDES = ['equipments', 'stories'];

export class MediaService {
  constructor(private readonly repo: MediaRepository = mediaRepository) {}

  async list(query: ListMediaQueryDto): Promise<{ media: MediaModel[]; total: number }> {
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

    const [media, total] = await Promise.all([this.repo.findMany(listParams), this.repo.count(listParams)]);

    return { media, total };
  }

  async getById(id: string, includeParam?: string): Promise<any> {
    const includes = {
      equipments: false,
      stories: false,
    };

    if (includeParam) {
      const parts = includeParam.split(',').map((p) => p.trim());
      if (parts.length > 3) {
        throw AppException.badRequest('Maximum of 3 include relations allowed.');
      }

      for (const part of parts) {
        if (part.includes('.')) {
          throw AppException.badRequest('Nested includes deeper than one level are not supported.');
        }
        if (!ALLOWED_INCLUDES.includes(part)) {
          throw AppException.badRequest(`Invalid include relation: '${part}'. Allowed: ${ALLOWED_INCLUDES.join(', ')}`);
        }
        if (part === 'equipments') includes.equipments = true;
        if (part === 'stories') includes.stories = true;
      }
    }

    const media = await this.repo.findByIdWithIncludes(id, includes);
    if (!media) {
      throw AppException.notFound('Media', `Media with ID '${id}' not found.`);
    }

    return media;
  }

  async create(data: CreateMediaRequestDto): Promise<MediaModel> {
    const sanitizedTitle = sanitizePlainText(data.title);
    const sanitizedCaption = data.caption ? sanitizePlainText(data.caption) : null;
    const sanitizedCredit = data.credit ? sanitizePlainText(data.credit) : null;
    const sanitizedAltText = data.altText ? sanitizePlainText(data.altText) : null;

    return this.repo.create({
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
  }

  async update(id: string, data: UpdateMediaRequestDto): Promise<MediaModel> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw AppException.notFound('Media', `Media with ID '${id}' not found.`);
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

    return this.repo.update(id, updateData);
  }

  async delete(id: string): Promise<MediaModel> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw AppException.notFound('Media', `Media with ID '${id}' not found.`);
    }

    return this.repo.delete(id);
  }

  async linkEquipment(
    mediaId: string,
    equipmentId: string,
    dto: LinkMediaEquipmentRequestDto
  ): Promise<EquipmentMediaModel> {
    const existing = await this.repo.findById(mediaId);
    if (!existing) {
      throw AppException.notFound('Media', `Media with ID '${mediaId}' not found.`);
    }

    return this.repo.linkEquipment(mediaId, equipmentId, dto.representationType);
  }

  async unlinkEquipment(mediaId: string, equipmentId: string): Promise<void> {
    try {
      await this.repo.unlinkEquipment(mediaId, equipmentId);
    } catch {
      throw AppException.notFound('EquipmentMedia', 'Equipment link not found for this media.');
    }
  }
}

export const mediaService = new MediaService();
