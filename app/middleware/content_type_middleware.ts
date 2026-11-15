import type { MiddlewareHandler } from 'hono';
import { AppException } from '#exceptions/app_exception';

export const contentTypeMiddleware = (allowedTypes: string[] = ['application/json']): MiddlewareHandler => {
  return async (c, next) => {
    const method = c.req.method;

    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      const contentLength = c.req.header('content-length');
      const transferEncoding = c.req.header('transfer-encoding');
      const hasBody =
        (contentLength !== undefined && parseInt(contentLength, 10) > 0) || transferEncoding !== undefined;
      const contentType = c.req.header('content-type');

      if (hasBody || contentType) {
        const path = c.req.path;
        const isUploadRoute = path.startsWith('/api/v1/admin/ingestion');
        const effectiveAllowed = isUploadRoute
          ? [
              ...allowedTypes,
              'multipart/form-data',
              'application/zip',
              'application/x-zip-compressed',
              'application/octet-stream',
            ]
          : allowedTypes;

        if (!contentType) {
          throw AppException.unsupportedMediaType(
            `Missing Content-Type header on state-changing request with payload. Allowed types: ${effectiveAllowed.join(', ')}`
          );
        }

        const isAllowed = effectiveAllowed.some((type) => contentType.toLowerCase().includes(type.toLowerCase()));
        if (!isAllowed) {
          throw AppException.unsupportedMediaType(
            `Unsupported Content-Type: '${contentType}'. Allowed types: ${effectiveAllowed.join(', ')}`
          );
        }
      }
    }

    await next();
  };
};
