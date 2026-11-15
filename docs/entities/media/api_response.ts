import type { ApiResult, PaginationMeta } from '../_shared/api_envelope.js';
import type { Media, MediaDetail } from './model.js';

export interface MessageData {
  message: string;
}

export type ListMediaResponse = ApiResult<
  Media[],
  'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR',
  PaginationMeta
>;

export type GetMediaResponse = ApiResult<
  MediaDetail,
  'NOT_FOUND' | 'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR'
>;

export type CreateMediaResponse = ApiResult<
  Media,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type UpdateMediaResponse = ApiResult<
  Media,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type DeleteMediaResponse = ApiResult<
  MessageData,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_ERROR'
>;

export type MediaResponse = GetMediaResponse;
export type MediaDetailResponse = GetMediaResponse;
export type MediaListResponse = ListMediaResponse;
