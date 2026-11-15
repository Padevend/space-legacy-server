import type { ApiResult, PaginationMeta } from '../_shared/api_envelope.js';
import type { Mission, MissionDetail } from './model.js';

export interface MessageData {
  message: string;
}

export type ListMissionsResponse = ApiResult<
  Mission[],
  'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR',
  PaginationMeta
>;

export type GetMissionResponse = ApiResult<
  MissionDetail,
  'NOT_FOUND' | 'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR'
>;

export type CreateMissionResponse = ApiResult<
  Mission,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'CONFLICT' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type UpdateMissionResponse = ApiResult<
  Mission,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type DeleteMissionResponse = ApiResult<
  MessageData,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_ERROR'
>;

export type MissionResponse = GetMissionResponse;
export type MissionDetailResponse = GetMissionResponse;
export type MissionListResponse = ListMissionsResponse;
