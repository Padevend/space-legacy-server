import type { Router } from '#infrastructure/http/router';
import { IdentityController } from '../controllers/identity_controller.js';
import { auth } from '#middleware/auth_middleware';
import { rateLimit } from '#middleware/rate_limit_middleware';

export function registerIdentityPublicRoutes(router: Router): void {
  const r = router.forModule('identity');

  // Rate limit on registration and login attempts: 10 per minute per IP (Section 7)
  const authRateLimit = rateLimit({
    windowMs: 60 * 1000,
    max: process.env['NODE_ENV'] === 'test' ? 1000 : 10,
  });

  // Anonymous session (creates or returns active session)
  r.post('/session/anonymous', [IdentityController, 'anonymousSession'])
    .use(auth({ optional: true }))
    .as('identity.anonymous_session');

  // Registration & Authentication
  r.post('/auth/register', [IdentityController, 'register'])
    .use(authRateLimit, auth({ optional: true }))
    .as('identity.register');

  r.post('/auth/login', [IdentityController, 'login'])
    .use(authRateLimit, auth({ optional: true }))
    .as('identity.login');

  r.post('/auth/logout', [IdentityController, 'logout']).use(auth()).as('identity.logout');

  // Current User / Identity Management
  r.get('/me', [IdentityController, 'me']).use(auth()).as('identity.me');

  r.patch('/me', [IdentityController, 'updateProfile']).use(auth()).as('identity.update_profile');

  r.patch('/me/password', [IdentityController, 'updatePassword']).use(auth()).as('identity.update_password');

  r.delete('/me', [IdentityController, 'deleteAccount']).use(auth()).as('identity.delete_account');
}
