import type { Context } from 'hono';

export interface ApiMeta {
  requestId: string;
  [key: string]: unknown;
}

export interface PaginationMeta extends ApiMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T, M extends ApiMeta = ApiMeta> {
  success: true;
  data: T;
  meta: M;
}

export function ok<T, M extends Record<string, unknown> = Record<string, never>>(
  c: Context,
  data: T,
  extraMeta?: M
): Response {
  const requestId = (c.get('requestId') as string) || 'unknown';
  const meta: ApiMeta = { requestId, ...(extraMeta ?? {}) };
  c.header('Content-Type', 'application/json; charset=utf-8');
  c.header('X-Request-Id', requestId);
  return c.json({ success: true, data, meta }, 200);
}

export function created<T>(c: Context, data: T, location?: string): Response {
  const requestId = (c.get('requestId') as string) || 'unknown';
  c.header('Content-Type', 'application/json; charset=utf-8');
  c.header('X-Request-Id', requestId);
  if (location) {
    c.header('Location', location);
  }
  return c.json({ success: true, data, meta: { requestId } }, 201);
}

export function paginated<T>(
  c: Context,
  data: T[],
  pagination: { page: number; pageSize: number; total: number }
): Response {
  const requestId = (c.get('requestId') as string) || 'unknown';
  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.pageSize));
  const meta: PaginationMeta = {
    requestId,
    page: pagination.page,
    pageSize: pagination.pageSize,
    total: pagination.total,
    totalPages,
  };
  c.header('Content-Type', 'application/json; charset=utf-8');
  c.header('X-Request-Id', requestId);
  return c.json({ success: true, data, meta }, 200);
}

export function noContent(c: Context): Response {
  const requestId = (c.get('requestId') as string) || 'unknown';
  c.header('X-Request-Id', requestId);
  return c.body(null, 204);
}
