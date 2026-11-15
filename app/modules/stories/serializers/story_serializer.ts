import type { StoryModel } from '../models/story.js';
import type { StoryDto, StoryDetailDto } from '../validators/story.js';
import type { StoryMissionModel } from '../models/story_mission.js';
import type { StoryEquipmentModel } from '../models/story_equipment.js';
import type { StoryEventModel } from '../models/story_event.js';
import type { StorySourceModel } from '../models/story_source.js';

export class StorySerializer {
  serializeStory(story: StoryModel): StoryDto {
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

  serializeStoryMission(link: StoryMissionModel) {
    return {
      storyId: link.storyId,
      missionId: link.missionId,
      displayOrder: link.displayOrder,
    };
  }

  serializeStoryEquipment(link: StoryEquipmentModel) {
    return {
      storyId: link.storyId,
      equipmentId: link.equipmentId,
      displayOrder: link.displayOrder,
      narrativeRole: link.narrativeRole,
    };
  }

  serializeStoryEvent(link: StoryEventModel) {
    return {
      storyId: link.storyId,
      eventId: link.eventId,
      displayOrder: link.displayOrder,
    };
  }

  serializeStorySource(link: StorySourceModel) {
    return {
      storyId: link.storyId,
      sourceId: link.sourceId,
      displayOrder: link.displayOrder,
      claimDescription: link.claimDescription,
    };
  }
}

export const storySerializer = new StorySerializer();
