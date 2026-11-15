import type { MiddlewareHandler } from 'hono';
import { securityConfig } from '#config/security';

export const secureHeadersMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    await next();

    c.res.headers.delete('X-Powered-By');
    c.res.headers.delete('x-powered-by');

    c.header('X-Content-Type-Options', securityConfig.headers.xContentTypeOptions || 'nosniff');
    c.header('X-Frame-Options', 'DENY');
    c.header('Referrer-Policy', securityConfig.headers.referrerPolicy);
    c.header('Permissions-Policy', securityConfig.headers.permissionsPolicy);
    c.header('Cross-Origin-Resource-Policy', securityConfig.headers.crossOriginResourcePolicy);

    if (
      !c.req.path.startsWith('/docs') &&
      !c.req.path.startsWith('/swagger') &&
      !c.req.path.startsWith('/scalar') &&
      !c.req.path.startsWith('/admin')
    ) {
      c.header('Content-Security-Policy', securityConfig.headers.contentSecurityPolicy);
    }

    const isProd = process.env['NODE_ENV'] === 'production';
    if (isProd) {
      c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    } else if (securityConfig.headers.strictTransportSecurity) {
      c.header('Strict-Transport-Security', securityConfig.headers.strictTransportSecurity);
    }
  };
};
