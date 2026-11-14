import type { MiddlewareHandler } from 'hono';
import { securityConfig } from '../../../config/security.js';

export const secureHeadersMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    await next();

    // Remove X-Powered-By header if present
    c.res.headers.delete('X-Powered-By');
    c.res.headers.delete('x-powered-by');

    // Set secure headers
    c.header('X-Content-Type-Options', securityConfig.headers.xContentTypeOptions);
    c.header('Referrer-Policy', securityConfig.headers.referrerPolicy);
    c.header('Permissions-Policy', securityConfig.headers.permissionsPolicy);
    c.header('Cross-Origin-Resource-Policy', securityConfig.headers.crossOriginResourcePolicy);

    // Only apply strict CSP if not an API docs UI route
    if (!c.req.path.startsWith('/docs') && !c.req.path.startsWith('/swagger') && !c.req.path.startsWith('/scalar')) {
      c.header('Content-Security-Policy', securityConfig.headers.contentSecurityPolicy);
    }

    if (securityConfig.headers.strictTransportSecurity) {
      c.header('Strict-Transport-Security', securityConfig.headers.strictTransportSecurity);
    }
  };
};
