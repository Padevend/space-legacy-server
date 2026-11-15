import type { MiddlewareHandler } from 'hono';
import { AppException } from '#exceptions/app_exception';
import { corsConfig } from '#config/cors';

export const csrfOriginMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const method = c.req.method;

    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      await next();
      return;
    }

    const origin = c.req.header('origin');
    const referer = c.req.header('referer');

    let sourceOrigin: string | null = null;
    if (origin) {
      sourceOrigin = origin;
    } else if (referer) {
      try {
        const parsedUrl = new URL(referer);
        sourceOrigin = parsedUrl.origin;
      } catch {
        // Ignore invalid referer format
      }
    }

    if (sourceOrigin && !corsConfig.origins.includes(sourceOrigin)) {
      throw AppException.forbidden('Disallowed origin. CSRF protection blocked the request.');
    }

    await next();
  };
};

export const strictCookieCsrfMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const method = c.req.method;
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      await next();
      return;
    }

    const origin = c.req.header('origin');
    const customHeader = c.req.header('x-csrf-token');

    if (!origin || !corsConfig.origins.includes(origin)) {
      throw AppException.forbidden('Missing or invalid Origin header for sensitive session operation.');
    }

    if (!customHeader) {
      throw AppException.forbidden('Missing required X-CSRF-Token custom header.');
    }

    await next();
  };
};

export const csrfGuardMiddleware = csrfOriginMiddleware;
