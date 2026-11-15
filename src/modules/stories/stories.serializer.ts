import type { Story } from '@prisma/client';
import type { StoryDto, StoryDetailDto } from './stories.schemas.js';

export class StoriesSerializer {
  serializeStory(story: Story): StoryDto {
    return {
      storyId: story.storyId,
      title: story.title,
      slug: story.slug,
      hook: story.hook ?? null,
      content: story.content,
      storyType: story.storyType,
      durationSeconds: story.durationSeconds ?? null,
      language: story.language,
      publicationStatus: story.publicationStatus,
      publishedAt: story.publishedAt ? story.publishedAt.toISOString() : null,
      createdAt: story.createdAt.toISOString(),
      updatedAt: story.updatedAt.toISOString(),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serializeStoryDetail(story: any): StoryDetailDto {
    const base = this.serializeStory(story);

    return {
      ...base,
      ...(story.missions !== undefined && {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        missions: story.missions.map((sm: any) => ({
          missionId: sm.missionId,
          name: sm.mission?.name ?? '',
          slug: sm.mission?.slug ?? '',
          displayOrder: sm.displayOrder ?? 0,
        })),
      }),
      ...(story.equipments !== undefined && {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        equipments: story.equipments.map((se: any) => ({
          equipmentId: se.equipmentId,
          name: se.equipment?.name ?? '',
          slug: se.equipment?.slug ?? '',
          displayOrder: se.displayOrder ?? 0,
          narrativeRole: se.narrativeRole ?? null,
        })),
      }),
      ...(story.events !== undefined && {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        events: story.events.map((se: any) => ({
          eventId: se.eventId,
          title: se.event?.title ?? '',
          eventType: se.event?.eventType ?? '',
          displayOrder: se.displayOrder ?? 0,
        })),
      }),
      ...(story.media !== undefined && {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        media: story.media.map((sm: any) => ({
          mediaId: sm.mediaId,
          title: sm.media?.title ?? '',
          url: sm.media?.url ?? '',
          thumbnailUrl: sm.media?.thumbnailUrl ?? null,
          provenanceType: sm.media?.provenanceType ?? '',
          requiresAiLabel: sm.media?.provenanceType === 'AI_GENERATED_ILLUSTRATION',
          displayOrder: sm.displayOrder ?? 0,
          captionOverride: sm.captionOverride ?? null,
        })),
      }),
      ...(story.sources !== undefined && {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sources: story.sources.map((ss: any) => ({
          sourceId: ss.sourceId,
          title: ss.source?.title ?? '',
          url: ss.source?.url ?? '',
          displayOrder: ss.displayOrder ?? 0,
          claimDescription: ss.claimDescription ?? null,
        })),
      }),
    };
  }
}

export const storiesSerializer = new StoriesSerializer();
