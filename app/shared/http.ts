import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { AppErrorResponse } from './errors.js';

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
    total?: number | undefined;
  };
  facets?: Record<string, Record<string, number>> | undefined;
}

export function jsonSuccess<T>(c: Context, data: T, status: ContentfulStatusCode = 200) {
  return c.json(data, status);
}

export function jsonPaginated<T>(
  c: Context,
  items: T[],
  nextCursor: string | null,
  total?: number | undefined,
  facets?: Record<string, Record<string, number>> | undefined,
  status: ContentfulStatusCode = 200
) {
  const payload: PaginatedResult<T> = {
    data: items,
    pagination: {
      nextCursor,
      hasMore: nextCursor !== null,
      total,
    },
    facets,
  };
  return c.json(payload, status);
}

export function jsonError(c: Context, errorResponse: AppErrorResponse, status: ContentfulStatusCode = 400) {
  return c.json(errorResponse, status);
}

/**
 * Encode an object into an opaque URL-safe base64 cursor.
 */
export function encodeCursor(payload: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

/**
 * Decode an opaque URL-safe base64 cursor into an object.
 */
export function decodeCursor<T = Record<string, unknown>>(cursor: string): T | null {
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
