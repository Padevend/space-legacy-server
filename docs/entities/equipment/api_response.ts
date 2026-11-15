import type { ApiResult, PaginationMeta } from '../_shared/api_envelope.js';
import type { Equipment, EquipmentDetail } from './model.js';

export interface MessageData {
  message: string;
}

export type ListEquipmentResponse = ApiResult<
  Equipment[],
  'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR',
  PaginationMeta
>;

export type GetEquipmentResponse = ApiResult<
  EquipmentDetail,
  'NOT_FOUND' | 'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR'
>;

export type CreateEquipmentResponse = ApiResult<
  Equipment,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'CONFLICT' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type UpdateEquipmentResponse = ApiResult<
  Equipment,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type DeleteEquipmentResponse = ApiResult<
  MessageData,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_ERROR'
>;

export type EquipmentResponse = GetEquipmentResponse;
export type EquipmentDetailResponse = GetEquipmentResponse;
export type EquipmentListResponse = ListEquipmentResponse;
