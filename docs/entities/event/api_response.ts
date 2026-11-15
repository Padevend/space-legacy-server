import type { ApiResult, PaginationMeta } from '../_shared/api_envelope.js';
import type { Event, EventDetail } from './model.js';

export interface MessageData {
  message: string;
}

export type ListEventsResponse = ApiResult<
  Event[],
  'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR',
  PaginationMeta
>;

export type GetEventResponse = ApiResult<
  EventDetail,
  'NOT_FOUND' | 'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR'
>;

export type CreateEventResponse = ApiResult<
  Event,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type UpdateEventResponse = ApiResult<
  Event,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type DeleteEventResponse = ApiResult<
  MessageData,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_ERROR'
>;

export type EventResponse = GetEventResponse;
export type EventDetailResponse = GetEventResponse;
export type EventListResponse = ListEventsResponse;
