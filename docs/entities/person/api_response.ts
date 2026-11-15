import type { ApiResult, PaginationMeta } from '../_shared/api_envelope.js';
import type { Person } from './model.js';

export interface MessageData {
  message: string;
}

export type ListPeopleResponse = ApiResult<
  Person[],
  'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR',
  PaginationMeta
>;

export type GetPersonResponse = ApiResult<
  Person,
  'NOT_FOUND' | 'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR'
>;

export type CreatePersonResponse = ApiResult<
  Person,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type UpdatePersonResponse = ApiResult<
  Person,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type DeletePersonResponse = ApiResult<
  MessageData,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_ERROR'
>;
