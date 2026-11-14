import type { MiddlewareHandler } from 'hono';
import { AppException } from '../exceptions/AppException.js';

export const contentTypeGuardMiddleware = (allowedTypes: string[] = ['application/json']): MiddlewareHandler => {
  return async (c, next) => {
    const method = c.req.method;

    // Only inspect state-changing requests with a body
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      const contentLength = c.req.header('content-length');
      const hasBody = contentLength !== undefined && parseInt(contentLength, 10) > 0;

      if (hasBody) {
        const contentType = c.req.header('content-type') || '';
        const isAllowed = allowedTypes.some((type) =>
          contentType.toLowerCase().includes(type.toLowerCase())
        );

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
