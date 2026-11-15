import type { StoryType, PublicationStatus } from './model.js';

export interface CreateStoryRequest {
  title: string;
  slug: string;
  hook?: string | null | undefined;
  content: string;
  storyType: StoryType;
  durationSeconds?: number | null | undefined;
  language?: string | undefined;
}

export interface UpdateStoryRequest {
  title?: string | undefined;
  slug?: string | undefined;
  hook?: string | null | undefined;
  content?: string | undefined;
  storyType?: StoryType | undefined;
  durationSeconds?: number | null | undefined;
  language?: string | undefined;
}

export interface StoryTransitionRequest {
  to: PublicationStatus;
}

export interface LinkStoryMissionRequest {
  displayOrder?: number | undefined;
}

export interface LinkStoryEquipmentRequest {
  displayOrder?: number | undefined;
  narrativeRole?: string | null | undefined;
}

export interface LinkStoryEventRequest {
  displayOrder?: number | undefined;
}

export interface LinkStoryMediaRequest {
  displayOrder?: number | undefined;
  captionOverride?: string | null | undefined;
}

export interface LinkStorySourceRequest {
  displayOrder?: number | undefined;
  claimDescription?: string | null | undefined;
}
