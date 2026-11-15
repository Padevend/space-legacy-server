import type { MiddlewareHandler } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { AppException } from '#exceptions/app_exception';
import { securityConfig } from '#config/security';

export const bodyLimitMiddleware = (maxBytes = securityConfig.bodyLimitBytes): MiddlewareHandler => {
  return bodyLimit({
    maxSize: maxBytes,
    onError: () => {
      throw AppException.payloadTooLarge(`Payload size exceeds the maximum allowed limit of ${maxBytes} bytes.`);
    },
  });
};
