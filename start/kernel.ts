import type { OpenAPIHono } from '@hono/zod-openapi';
import { etag } from 'hono/etag';
import type { AppEnv } from '../src/core/http/context.js';
import {
  requestIdMiddleware,
  trustedProxyMiddleware,
  secureHeadersMiddleware,
  corsMiddleware,
  timeoutMiddleware,
  bodyLimitMiddleware,
  contentTypeGuardMiddleware,
  rateLimitMiddleware,
  csrfGuardMiddleware,
} from '../src/core/security/index.js';
import { requestLogger } from '../src/core/logger/request-logger.js';
import { rateLimitConfig } from '../config/rate-limit.js';

export function registerGlobalMiddleware(app: OpenAPIHono<AppEnv>): void {
  // 1. Request ID (generate, accept safe incoming, echo in X-Request-Id)
  app.use('*', requestIdMiddleware());

  // 2. Request logger (start/end, duration, status, redacted)
  app.use('*', requestLogger());

  // 3. Trusted-proxy resolution (the real client IP)
  app.use('*', trustedProxyMiddleware());

  // 4. Secure headers (CSP, nosniff, Referrer-Policy, CORP, HSTS in prod)
  app.use('*', secureHeadersMiddleware());

  // 5. CORS (strict allow-list from environment)
  app.use('*', corsMiddleware());

  // 6. Timeout middleware
  app.use('*', timeoutMiddleware());

  // 7. Body-size limit (413 if over limit)
  app.use('*', bodyLimitMiddleware());

  // 8. Content-type guard (JSON required for bodies with content)
  app.use('*', contentTypeGuardMiddleware());

  // 9. Global rate limiter (ceiling on client IP)
  app.use(
    '*',
    rateLimitMiddleware({
      windowMs: rateLimitConfig.global.windowMs,
      max: rateLimitConfig.global.max,
      keyGenerator: (c) => `global:${c.get('clientIp')}`,
    })
  );

  // 10. CSRF guard (state-changing methods checked for allowed origin/referer)
  app.use('*', csrfGuardMiddleware());

  // 11. ETag for public GET responses
  app.use('*', async (c, next) => {
    if (c.req.method === 'GET' && !c.req.path.startsWith('/api/v1/admin')) {
      return etag()(c, next);
    }
    await next();
  });
}
