import type { ApiResult, PaginationMeta } from '../_shared/api_envelope.js';
import type { Measurement, MeasurementDetail } from './model.js';

export interface MessageData {
  message: string;
}

export type ListMeasurementsResponse = ApiResult<
  Measurement[],
  'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR',
  PaginationMeta
>;

export type GetMeasurementResponse = ApiResult<
  MeasurementDetail,
  'NOT_FOUND' | 'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR'
>;

export type CreateMeasurementResponse = ApiResult<
  Measurement,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type UpdateMeasurementResponse = ApiResult<
  Measurement,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type DeleteMeasurementResponse = ApiResult<
  MessageData,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL_ERROR'
>;

export type MeasurementResponse = GetMeasurementResponse;
export type MeasurementDetailResponse = GetMeasurementResponse;
export type MeasurementListResponse = ListMeasurementsResponse;
