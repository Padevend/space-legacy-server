export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T, M = Record<string, never>> {
  success: true;
  data: T;
  meta: { requestId: string } & M;
}

export interface ApiErrorDetail {
  path: string;
  code: string;
  message: string;
}

export interface ApiErrorBody<C extends string = string> {
  code: C;
  message: string;
  status: number;
  requestId: string;
  details?: ApiErrorDetail[];
  retryAfterSeconds?: number;
}

export interface ApiFailure<C extends string = string> {
  success: false;
  error: ApiErrorBody<C>;
}

export type ApiResult<T, C extends string, M = Record<string, never>> =
  | ApiSuccess<T, M>
  | ApiFailure<C>;
