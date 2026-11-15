import type { ApiResult, PaginationMeta } from '../_shared/api_envelope.js';
import type { Location } from './model.js';

export interface MessageData {
  message: string;
}

export type ListLocationsResponse = ApiResult<
  Location[],
  'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR',
  PaginationMeta
>;

export type GetLocationResponse = ApiResult<
  Location,
  'NOT_FOUND' | 'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR'
>;

export type CreateLocationResponse = ApiResult<
  Location,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type UpdateLocationResponse = ApiResult<
  Location,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type DeleteLocationResponse = ApiResult<
  MessageData,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_ERROR'
>;
