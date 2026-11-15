import type { Router } from '#infrastructure/http/router';
import { AuthController } from '../controllers/auth_controller.js';
import { UsersController } from '../controllers/users_controller.js';
import { changePasswordRequestSchema, userProfileSchema } from '../validators/auth.js';
import { createUserRequestSchema, updateUserRequestSchema, listUsersQuerySchema } from '../validators/user.js';
import { middleware } from '#start/kernel';

export function registerAuthAdminRoutes(router: Router): void {
  const r = router.forModule('auth');

  r.get('/auth/me', [AuthController, 'me'])
    .as('auth.me')
    .use(middleware.auth())
    .docs({
      summary: 'Get authenticated user profile',
      tags: ['Auth'],
      responses: { 200: userProfileSchema, 401: 'UNAUTHENTICATED' },
    });

  r.post('/auth/change-password', [AuthController, 'changePassword'])
    .as('auth.changePassword')
    .use(middleware.auth())
    .validate({ body: changePasswordRequestSchema })
    .docs({
      summary: 'Change authenticated user password',
      tags: ['Auth'],
      responses: { 200: 'Password changed', 400: 'BAD_REQUEST' },
    });

  // Admin user management resource
  r.get('/admin/users', [UsersController, 'index'])
    .as('admin.users.index')
    .use(middleware.requireRole('ADMIN'))
    .validate({ query: listUsersQuerySchema })
    .docs({ summary: 'List user accounts', tags: ['Users'] });

  r.post('/admin/users', [UsersController, 'store'])
    .as('admin.users.store')
    .use(middleware.requireRole('ADMIN'))
    .validate({ body: createUserRequestSchema })
    .docs({ summary: 'Create user account', tags: ['Users'] });

  r.get('/admin/users/:id', [UsersController, 'show'])
    .as('admin.users.show')
    .use(middleware.requireRole('ADMIN'))
    .docs({ summary: 'Get user account', tags: ['Users'] });

  r.put('/admin/users/:id', [UsersController, 'update'])
    .as('admin.users.update')
    .use(middleware.requireRole('ADMIN'))
    .validate({ body: updateUserRequestSchema })
    .docs({ summary: 'Update user account', tags: ['Users'] });

  r.patch('/admin/users/:id', [UsersController, 'update'])
    .as('admin.users.patch')
    .use(middleware.requireRole('ADMIN'))
    .validate({ body: updateUserRequestSchema })
    .docs({ summary: 'Patch user account', tags: ['Users'] });

  r.delete('/admin/users/:id', [UsersController, 'destroy'])
    .as('admin.users.destroy')
    .use(middleware.requireRole('ADMIN'))
    .docs({ summary: 'Delete user account', tags: ['Users'] });
}
