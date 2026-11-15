import type { MiddlewareHandler } from 'hono';
import { logger } from '#infrastructure/logger/logger';

export const loggerMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const start = performance.now();
    const requestId = (c.get('requestId') as string) || 'unknown';
    const clientIp = (c.get('clientIp') as string) || 'unknown';
    const method = c.req.method;
    const path = c.req.path;

    await next();

    const duration = Math.round(performance.now() - start);
    const status = c.res.status;
    const userId = c.get('userId');

    logger.info(
      {
        requestId,
        method,
        path,
        status,
        durationMs: duration,
        clientIp,
        ...(userId ? { userId } : {}),
      },
      `${method} ${path} -> ${status} (${duration}ms)`
    );
  };
};
