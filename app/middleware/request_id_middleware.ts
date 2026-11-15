import type { MiddlewareHandler } from 'hono';

const SAFE_REQUEST_ID_REGEX = /^[a-zA-Z0-9_-]{8,64}$/;

export const requestIdMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const incoming = c.req.header('x-request-id');
    const requestId = incoming && SAFE_REQUEST_ID_REGEX.test(incoming) ? incoming : crypto.randomUUID();

    c.set('requestId', requestId);
    c.header('X-Request-Id', requestId);

    await next();
  };
};
