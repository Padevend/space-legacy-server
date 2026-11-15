import { OpenAPIHono } from '@hono/zod-openapi';
import { globalErrorHandler, notFoundHandler } from '../exceptions/error-handler.js';
export function createApp() {
    const app = new OpenAPIHono({
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
