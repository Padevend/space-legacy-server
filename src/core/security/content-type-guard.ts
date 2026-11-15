import type { MiddlewareHandler } from 'hono';
import { AppException } from '../exceptions/AppException.js';

export const contentTypeGuardMiddleware = (allowedTypes: string[] = ['application/json']): MiddlewareHandler => {
  return async (c, next) => {
    const method = c.req.method;

    // Only inspect state-changing requests (POST, PUT, PATCH)
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      const contentLength = c.req.header('content-length');
      const transferEncoding = c.req.header('transfer-encoding');
      const hasBody =
        (contentLength !== undefined && parseInt(contentLength, 10) > 0) || transferEncoding !== undefined;
      const contentType = c.req.header('content-type');

      // If a body is present or Content-Type is sent on state-changing request
      if (hasBody || contentType) {
        if (!contentType) {
          throw AppException.unsupportedMediaType(
            `Missing Content-Type header on state-changing request with payload. Allowed types: ${allowedTypes.join(', ')}`
          );
        }

        const isAllowed = allowedTypes.some((type) => contentType.toLowerCase().includes(type.toLowerCase()));
        if (!isAllowed) {
          throw AppException.unsupportedMediaType(
            `Unsupported Content-Type: '${contentType}'. Allowed types: ${allowedTypes.join(', ')}`
          );
        }
      }
    }

    await next();
  };
};
