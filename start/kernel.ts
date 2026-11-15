import type { Hono } from 'hono';
import { etag } from 'hono/etag';
import router from '#infrastructure/http/router';
import { requestIdMiddleware } from '#middleware/request_id_middleware';
import { loggerMiddleware } from '#middleware/logger_middleware';
import { trustedProxyMiddleware } from '#middleware/trusted_proxy_middleware';
import { secureHeadersMiddleware } from '#middleware/secure_headers_middleware';
import { corsMiddleware } from '#middleware/cors_middleware';
import { timeoutMiddleware } from '#middleware/timeout_middleware';
import { bodyLimitMiddleware } from '#middleware/body_limit_middleware';
import { contentTypeMiddleware } from '#middleware/content_type_middleware';
import { rateLimit } from '#middleware/rate_limit_middleware';
import { csrfOriginMiddleware } from '#middleware/csrf_origin_middleware';
import { auth } from '#middleware/auth_middleware';
import { ability, requireRole } from '#middleware/ability_middleware';
import { rateLimitConfig } from '#config/rate-limit';

export function registerGlobalMiddleware(app: Hono): void {
  // 1. Request ID (generate, accept safe incoming, echo in X-Request-Id)
  app.use('*', requestIdMiddleware());

  // 2. Request logger (start/end, duration, status, redacted)
  app.use('*', loggerMiddleware());

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
  app.use('*', contentTypeMiddleware());

  // 9. Global rate limiter (ceiling on client IP)
  app.use(
    '*',
    rateLimit({
      windowMs: rateLimitConfig.global.windowMs,
      max: rateLimitConfig.global.max,
      keyGenerator: (c: any) => `global:${c.get('clientIp')}`,
    })
  );

  // 10. CSRF guard (state-changing methods checked for allowed origin/referer)
  app.use('*', csrfOriginMiddleware());

  // 11. ETag for public GET responses
  app.use('*', async (c, next) => {
    if (c.req.method === 'GET' && !c.req.path.startsWith('/api/v1/admin')) {
      return etag()(c, next);
    }
    await next();
  });
}

export const middleware = router.named({
  auth,
  ability,
  requireRole,
  rateLimit,
  csrfOrigin: csrfOriginMiddleware,
});
