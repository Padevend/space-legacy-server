import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { AppException, type ValidationErrorDetail } from './AppException.js';
import { mapZodError } from './zod-errors.js';
import { mapPrismaError } from './prisma-errors.js';
import { appConfig } from '../../../config/app.js';
import { logger } from '../logger/index.js';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    status: number;
    requestId: string;
    details?: ValidationErrorDetail[];
    retryAfterSeconds?: number;
  };
}

export function toAppException(error: unknown): AppException {
  if (error instanceof AppException) {
    return error;
  }

  if (error instanceof ZodError) {
    return mapZodError(error);
  }

  if (error instanceof HTTPException) {
    const status = error.status;
    if (status === 400) return AppException.badRequest(error.message);
    if (status === 401) return AppException.unauthenticated(error.message);
    if (status === 403) return AppException.forbidden(error.message);
    if (status === 404) return AppException.notFound('Route', error.message);
    if (status === 405) return AppException.methodNotAllowed(error.message);
    if (status === 408) return AppException.timeout(error.message);
    if (status === 413) return AppException.payloadTooLarge(error.message);
    if (status === 415) return AppException.unsupportedMediaType(error.message);
    if (status === 429) return AppException.tooManyRequests(60, error.message);
    if (status === 503) return AppException.serviceUnavailable(error.message);
    return new AppException({ code: 'INTERNAL_ERROR', status, message: error.message });
  }

  // Check Prisma error markers
  if (
    typeof error === 'object' &&
    error !== null &&
    ('code' in error || error.constructor.name.startsWith('Prisma'))
  ) {
    return mapPrismaError(error);
  }

  // Generic fallback
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
  return AppException.internal(message, error);
}

export function globalErrorHandler(err: Error, c: Context): Response {
  const requestId = c.get('requestId') || 'unknown';
  const appException = toAppException(err);

  // In production, mask non-exposed errors (internal 500s)
  const isProd = appConfig.isProduction;
  const shouldMask = isProd && (!appException.expose || appException.status >= 500);

  const message = shouldMask
    ? 'An unexpected internal error occurred. Please contact support.'
    : appException.message;

  // Log error with full internal context & stack
  if (appException.status >= 500) {
    logger.error(
      {
        requestId,
        path: c.req.path,
        method: c.req.method,
        code: appException.code,
        status: appException.status,
        err,
      },
      `Server Error [${appException.code}]: ${appException.message}`
    );
  } else {
    logger.warn(
      {
        requestId,
        path: c.req.path,
        method: c.req.method,
        code: appException.code,
        status: appException.status,
      },
      `Client Error [${appException.code}]: ${appException.message}`
    );
  }

  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code: appException.code,
      message,
      status: appException.status,
      requestId,
    },
  };

  if (appException.details && appException.details.length > 0) {
    payload.error.details = appException.details;
  }

  if (appException.retryAfterSeconds !== undefined) {
    payload.error.retryAfterSeconds = appException.retryAfterSeconds;
    c.header('Retry-After', String(appException.retryAfterSeconds));
  }

  // Set unified headers
  c.header('Content-Type', 'application/json; charset=utf-8');
  c.header('X-Request-Id', requestId);

  return c.json(payload, appException.status as ContentfulStatusCode);
}

export function notFoundHandler(c: Context): Response {
  const requestId = c.get('requestId') || 'unknown';
  const payload: ApiErrorResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `The requested endpoint '${c.req.method} ${c.req.path}' was not found.`,
      status: 404,
      requestId,
    },
  };

  c.header('Content-Type', 'application/json; charset=utf-8');
  c.header('X-Request-Id', requestId);
  return c.json(payload, 404);
}
