import type { MiddlewareHandler } from 'hono';
import { logger } from './index.js';

export const requestLogger = (): MiddlewareHandler => {
  return async (c, next) => {
    const start = performance.now();
    const requestId = c.get('requestId') || 'unknown';
    const clientIp = c.get('clientIp') || 'unknown';
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
