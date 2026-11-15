import type { MediaType, MediaProvenance, DownloadStatus } from './model.js';

export interface CreateMediaRequest {
  title: string;
  mediaType: MediaType;
  url: string;
  thumbnailUrl?: string | null | undefined;
  caption?: string | null | undefined;
  credit?: string | null | undefined;
  creditUrl?: string | null | undefined;
  provenanceType: MediaProvenance;
  altText?: string | null | undefined;
  downloadStatus?: DownloadStatus | undefined;
}

export interface UpdateMediaRequest {
  title?: string | undefined;
  mediaType?: MediaType | undefined;
  url?: string | undefined;
  thumbnailUrl?: string | null | undefined;
  caption?: string | null | undefined;
  credit?: string | null | undefined;
  creditUrl?: string | null | undefined;
  provenanceType?: MediaProvenance | undefined;
  altText?: string | null | undefined;
  downloadStatus?: DownloadStatus | undefined;
}

export interface LinkMediaEquipmentRequest {
  representationType?: string | null | undefined;
}
