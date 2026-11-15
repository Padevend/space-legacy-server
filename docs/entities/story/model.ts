export const STORY_TYPES = [
  'LEGACY_STORY',
  'BEHIND_THE_TECHNOLOGY',
  'FINAL_CHAPTER',
  'SPACE_FACT',
] as const;

export type StoryType = (typeof STORY_TYPES)[number];

export const PUBLICATION_STATUSES = [
  'DRAFT',
  'REVIEW',
  'PUBLISHED',
  'ARCHIVED',
] as const;

export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];

export interface Story {
  storyId: string;
  title: string;
  slug: string;
  hook: string | null;
  content: string;
  storyType: StoryType;
  durationSeconds: number | null;
  language: string;
  publicationStatus: PublicationStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoryMissionRelation {
  missionId: string;
  name: string;
  slug: string;
  displayOrder: number;
}

export interface StoryEquipmentRelation {
  equipmentId: string;
  name: string;
  slug: string;
  displayOrder: number;
  narrativeRole: string | null;
}

export interface StoryEventRelation {
  eventId: string;
  title: string;
  eventType: string;
  displayOrder: number;
}

export interface StoryMediaRelation {
  mediaId: string;
  title: string;
  url: string;
  thumbnailUrl: string | null;
  provenanceType: string;
  requiresAiLabel: boolean;
  displayOrder: number;
  captionOverride: string | null;
}

export interface StorySourceRelation {
  sourceId: string;
  title: string;
  url: string;
  displayOrder: number;
  claimDescription: string | null;
}

export interface StoryDetail extends Story {
  missions?: StoryMissionRelation[];
  equipments?: StoryEquipmentRelation[];
  events?: StoryEventRelation[];
  media?: StoryMediaRelation[];
  sources?: StorySourceRelation[];
}
