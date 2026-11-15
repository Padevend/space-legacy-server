import type { ApiResult, PaginationMeta } from '../_shared/api_envelope.js';
import type { Story, StoryDetail } from './model.js';

export interface MessageData {
  message: string;
}

export type ListStoriesResponse = ApiResult<
  Story[],
  'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR',
  PaginationMeta
>;

export type GetStoryResponse = ApiResult<
  StoryDetail,
  'NOT_FOUND' | 'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR'
>;

export type CreateStoryResponse = ApiResult<
  Story,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'CONFLICT' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type UpdateStoryResponse = ApiResult<
  Story,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type TransitionStoryResponse = ApiResult<
  Story,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type DeleteStoryResponse = ApiResult<
  MessageData,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_ERROR'
>;

export type StoryResponse = GetStoryResponse;
export type StoryDetailResponse = GetStoryResponse;
export type StoryListResponse = ListStoriesResponse;
