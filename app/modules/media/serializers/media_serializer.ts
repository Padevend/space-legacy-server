import type { MediaModel } from '../models/media.js';
import type { MediaDto, MediaDetailDto } from '../validators/media.js';
import type { EquipmentMediaModel } from '../models/equipment_media.js';

export class MediaSerializer {
  serializeMedia(media: MediaModel): MediaDto {
    return {
      mediaId: media.mediaId,
      title: media.title,
      mediaType: media.mediaType,
      url: media.url,
      thumbnailUrl: media.thumbnailUrl ?? null,
      caption: media.caption ?? null,
      credit: media.credit ?? null,
      creditUrl: media.creditUrl ?? null,
      provenanceType: media.provenanceType,
      requiresAiLabel: media.provenanceType === 'AI_GENERATED_ILLUSTRATION',
      altText: media.altText ?? null,
      downloadStatus: media.downloadStatus,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serializeMediaDetail(media: any): MediaDetailDto {
    const base = this.serializeMedia(media);

    return {
      ...base,
      ...(media.equipments !== undefined && {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        equipments: media.equipments.map((em: any) => ({
          equipmentId: em.equipmentId,
          name: em.equipment?.name ?? '',
          slug: em.equipment?.slug ?? '',
          representationType: em.representationType ?? null,
        })),
      }),
      ...(media.stories !== undefined && {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stories: media.stories.map((sm: any) => ({
          storyId: sm.storyId,
          title: sm.story?.title ?? '',
          slug: sm.story?.slug ?? '',
          captionOverride: sm.captionOverride ?? null,
          displayOrder: sm.displayOrder ?? 0,
        })),
      }),
    };
  }

  serializeEquipmentMedia(link: EquipmentMediaModel) {
    return {
      equipmentId: link.equipmentId,
      mediaId: link.mediaId,
      representationType: link.representationType,
    };
  }
}

export const mediaSerializer = new MediaSerializer();
