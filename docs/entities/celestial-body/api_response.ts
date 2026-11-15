import type { ApiResult, PaginationMeta } from '../_shared/api_envelope.js';
import type { CelestialBody } from './model.js';

export interface MessageData {
  message: string;
}

export type ListCelestialBodiesResponse = ApiResult<
  CelestialBody[],
  'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR',
  PaginationMeta
>;

export type GetCelestialBodyResponse = ApiResult<
  CelestialBody,
  'NOT_FOUND' | 'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR'
>;

export type CreateCelestialBodyResponse = ApiResult<
  CelestialBody,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'CONFLICT' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type UpdateCelestialBodyResponse = ApiResult<
  CelestialBody,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type DeleteCelestialBodyResponse = ApiResult<
  MessageData,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_ERROR'
>;
