export const MEDIA_TYPES = [
  'IMAGE',
  'VIDEO',
  'AUDIO',
  'MODEL_3D',
  'DOCUMENT',
  'ANIMATION',
  'OTHER',
] as const;

export type MediaType = (typeof MEDIA_TYPES)[number];

export const MEDIA_PROVENANCES = [
  'NASA_ARCHIVE',
  'RECONSTRUCTION_3D',
  'AI_GENERATED_ILLUSTRATION',
  'DATA_VISUALIZATION',
  'OTHER',
] as const;

export type MediaProvenance = (typeof MEDIA_PROVENANCES)[number];

export const DOWNLOAD_STATUSES = [
  'AVAILABLE',
  'PENDING',
  'FAILED',
  'EXTERNAL_ONLY',
] as const;

export type DownloadStatus = (typeof DOWNLOAD_STATUSES)[number];

export interface Media {
  mediaId: string;
  title: string;
  mediaType: MediaType;
  url: string;
  thumbnailUrl: string | null;
  caption: string | null;
  credit: string | null;
  creditUrl: string | null;
  provenanceType: MediaProvenance;
  requiresAiLabel: boolean;
  altText: string | null;
  downloadStatus: DownloadStatus;
}

export interface MediaEquipmentRelation {
  equipmentId: string;
  name: string;
  slug: string;
  representationType: string | null;
}

export interface MediaStoryRelation {
  storyId: string;
  title: string;
  slug: string;
  captionOverride: string | null;
  displayOrder: number;
}

export interface MediaDetail extends Media {
  equipments?: MediaEquipmentRelation[];
  stories?: MediaStoryRelation[];
}
