import { OpenAPIHono } from '@hono/zod-openapi';
import type { AppEnv } from './context.js';
import { globalErrorHandler, notFoundHandler } from '../exceptions/error-handler.js';

export function createApp(): OpenAPIHono<AppEnv> {
  const app = new OpenAPIHono<AppEnv>({
    defaultHook: (result, c) => {
      if (!result.success) {
        return globalErrorHandler(result.error, c);
      }
    },
  });

  app.onError(globalErrorHandler);
  app.notFound(notFoundHandler);

  return app;
}
