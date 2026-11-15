import type { ApiResult, PaginationMeta } from '../_shared/api_envelope.js';
import type { User } from './model.js';

export interface LoginData {
  user: User;
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface RefreshData {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

export interface MessageData {
  message: string;
}

export type LoginResponse = ApiResult<
  LoginData,
  'UNAUTHENTICATED' | 'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR'
>;

export type RefreshResponse = ApiResult<
  RefreshData,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR'
>;

export type LogoutResponse = ApiResult<MessageData, 'FORBIDDEN' | 'INTERNAL_ERROR'>;

export type GetMeResponse = ApiResult<User, 'UNAUTHENTICATED' | 'INTERNAL_ERROR'>;

export type ChangePasswordResponse = ApiResult<
  MessageData,
  'UNAUTHENTICATED' | 'BAD_REQUEST' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type ListUsersResponse = ApiResult<
  User[],
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'TOO_MANY_REQUESTS' | 'INTERNAL_ERROR',
  PaginationMeta
>;

export type GetUserResponse = ApiResult<
  User,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL_ERROR'
>;

export type CreateUserResponse = ApiResult<
  User,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'CONFLICT' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type UpdateUserResponse = ApiResult<
  User,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION_ERROR' | 'INTERNAL_ERROR'
>;

export type DeleteUserResponse = ApiResult<
  MessageData,
  'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_ERROR'
>;
