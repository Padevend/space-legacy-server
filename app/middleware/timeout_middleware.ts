import type { MiddlewareHandler } from 'hono';
import { AppException } from '#exceptions/app_exception';
import { securityConfig } from '#config/security';

export const timeoutMiddleware = (timeoutMs = securityConfig.requestTimeoutMs): MiddlewareHandler => {
  return async (c, next) => {
    let timer: NodeJS.Timeout | undefined;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(AppException.timeout(`Request processing timed out after ${timeoutMs}ms.`));
      }, timeoutMs);
    });

    try {
      await Promise.race([next(), timeoutPromise]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  };
};
