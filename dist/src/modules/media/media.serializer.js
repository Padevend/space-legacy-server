export class MediaSerializer {
    serializeMedia(media) {
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
    serializeMediaDetail(media) {
        const base = this.serializeMedia(media);
        return {
            ...base,
            ...(media.equipments !== undefined && {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                equipments: media.equipments.map((em) => ({
                    equipmentId: em.equipmentId,
                    name: em.equipment?.name ?? '',
                    slug: em.equipment?.slug ?? '',
                    representationType: em.representationType ?? null,
                })),
            }),
            ...(media.stories !== undefined && {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                stories: media.stories.map((sm) => ({
                    storyId: sm.storyId,
                    title: sm.story?.title ?? '',
                    slug: sm.story?.slug ?? '',
                    captionOverride: sm.captionOverride ?? null,
                    displayOrder: sm.displayOrder ?? 0,
                })),
            }),
        };
    }
}
export const mediaSerializer = new MediaSerializer();
