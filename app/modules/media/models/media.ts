import type { MediaType, MediaProvenance, DownloadStatus } from '#shared/enums';

export interface MediaModel {
  mediaId: string;
  title: string;
  mediaType: MediaType;
  url: string;
  thumbnailUrl: string | null;
  caption: string | null;
  credit: string | null;
  creditUrl: string | null;
  provenanceType: MediaProvenance;
  requiresAiLabel?: boolean;
  altText: string | null;
  downloadStatus: DownloadStatus;

  equipments?: Array<{
    equipmentId: string;
    representationType: string | null;
    equipment?: {
      name: string;
      slug: string;
    };
  }>;

  stories?: Array<{
    storyId: string;
    captionOverride: string | null;
    displayOrder: number;
    story?: {
      title: string;
      slug: string;
    };
  }>;
}
