import type { Router } from '#infrastructure/http/router';
import { AuthController } from '../controllers/auth_controller.js';
import { loginRequestSchema, loginResponseDataSchema } from '../validators/auth.js';
import { strictCookieCsrfMiddleware } from '#middleware/csrf_origin_middleware';
import { middleware } from '#start/kernel';

export function registerAuthPublicRoutes(router: Router): void {
  const r = router.forModule('auth');

  r.post('/auth/login', [AuthController, 'login'])
    .as('auth.login')
    .validate({ body: loginRequestSchema })
    .docs({
      summary: 'Authenticate with email and password',
      tags: ['Auth'],
      responses: { 200: loginResponseDataSchema, 401: 'UNAUTHENTICATED' },
    });

  r.post('/auth/refresh', [AuthController, 'refresh'])
    .as('auth.refresh')
    .use(strictCookieCsrfMiddleware())
    .docs({
      summary: 'Rotate refresh token and issue new access token',
      tags: ['Auth'],
      responses: { 200: 'Refreshed token', 401: 'UNAUTHENTICATED' },
    });

  r.post('/auth/logout', [AuthController, 'logout'])
    .as('auth.logout')
    .use(strictCookieCsrfMiddleware())
    .use(middleware.auth({ optional: true }))
    .docs({
      summary: 'Revoke active refresh token session',
      tags: ['Auth'],
      responses: { 200: 'Logged out' },
    });
}
