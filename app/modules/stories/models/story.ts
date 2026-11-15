import type { StoryType, PublicationStatus } from '#shared/enums';

export interface StoryModel {
  storyId: string;
  title: string;
  slug: string;
  hook: string | null;
  content: string;
  storyType: StoryType;
  durationSeconds: number | null;
  language: string;
  publicationStatus: PublicationStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  missions?: Array<{
    missionId: string;
    displayOrder: number;
    mission?: {
      name: string;
      slug: string;
    };
  }>;

  equipments?: Array<{
    equipmentId: string;
    displayOrder: number;
    narrativeRole: string | null;
    equipment?: {
      name: string;
      slug: string;
    };
  }>;

  events?: Array<{
    eventId: string;
    displayOrder: number;
    event?: {
      title: string;
      eventType: string;
    };
  }>;

  sources?: Array<{
    sourceId: string;
    displayOrder: number;
    claimDescription: string | null;
    source?: {
      title: string;
      url: string;
    };
  }>;
}
