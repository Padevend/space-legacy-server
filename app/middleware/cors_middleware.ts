import type { MiddlewareHandler } from 'hono';
import { corsConfig } from '#config/cors';

export const corsMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const origin = c.req.header('origin');

    if (!origin) {
      await next();
      return;
    }

    const isAllowed = corsConfig.origins.includes(origin);

    if (c.req.method === 'OPTIONS') {
      if (isAllowed) {
        c.header('Access-Control-Allow-Origin', origin);
        c.header('Access-Control-Allow-Methods', corsConfig.allowMethods.join(', '));
        c.header('Access-Control-Allow-Headers', corsConfig.allowHeaders.join(', '));
        c.header('Access-Control-Max-Age', String(corsConfig.maxAge));
        c.header('Access-Control-Allow-Credentials', 'true');
        return c.body(null, 204);
      }
      return c.body(null, 403);
    }

    if (isAllowed) {
      c.header('Access-Control-Allow-Origin', origin);
      c.header('Access-Control-Allow-Credentials', 'true');
      c.header('Access-Control-Expose-Headers', corsConfig.exposeHeaders.join(', '));
    }

    await next();
  };
};
