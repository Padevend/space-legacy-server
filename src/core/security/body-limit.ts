import type { MiddlewareHandler } from 'hono';
import { AppException } from '../exceptions/AppException.js';
import { securityConfig } from '../../../config/security.js';

export const bodyLimitMiddleware = (maxBytes = securityConfig.bodyLimitBytes): MiddlewareHandler => {
  return async (c, next) => {
    // Skip GET, HEAD, OPTIONS
    const method = c.req.method;
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
      await next();
      return;
    }

    const contentLength = c.req.header('content-length');
    if (contentLength) {
      const bytes = parseInt(contentLength, 10);
      if (!Number.isNaN(bytes) && bytes > maxBytes) {
        throw AppException.payloadTooLarge(
          `Payload size of ${bytes} bytes exceeds the maximum allowed limit of ${maxBytes} bytes.`
        );
      }
    }

    await next();
  };
};
