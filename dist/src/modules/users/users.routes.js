import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { usersController } from './users.controller.js';
import { listUsersQuerySchema, createUserRequestSchema, updateUserRequestSchema, userIdParamSchema, userProfileSchema, } from './users.schemas.js';
import { authenticate, requireRole, rateLimitMiddleware } from '../../core/security/index.js';
import { rateLimitConfig } from '../../../config/rate-limit.js';
export const listUsersRoute = createRoute({
    method: 'get',
    path: '/',
    summary: 'List Users (Admin Only)',
    description: 'Retrieves a paginated list of users with optional filtering and sorting.',
    tags: ['Admin Users'],
    security: [{ bearerAuth: [] }],
    request: {
        query: listUsersQuerySchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: z.array(userProfileSchema),
                        meta: z.object({
                            requestId: z.string(),
                            page: z.number(),
                            pageSize: z.number(),
                            total: z.number(),
                            totalPages: z.number(),
                        }),
                    }),
                },
            },
            description: 'Paginated user list.',
        },
        401: { description: 'Unauthenticated.' },
        403: { description: 'Forbidden: Admin role required.' },
    },
});
export const getUserRoute = createRoute({
    method: 'get',
    path: '/{id}',
    summary: 'Get User By ID (Admin Only)',
    description: 'Retrieves a single user by UUID.',
    tags: ['Admin Users'],
    security: [{ bearerAuth: [] }],
    request: {
        params: userIdParamSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: userProfileSchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'User details.',
        },
        401: { description: 'Unauthenticated.' },
        403: { description: 'Forbidden: Admin role required.' },
        404: { description: 'User not found.' },
    },
});
export const createUserRoute = createRoute({
    method: 'post',
    path: '/',
    summary: 'Create User (Admin Only)',
    description: 'Creates a new user account with Argon2id hashed password.',
    tags: ['Admin Users'],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: createUserRequestSchema,
                },
            },
            required: true,
        },
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: userProfileSchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'User created successfully.',
        },
        400: { description: 'Validation error.' },
        401: { description: 'Unauthenticated.' },
        403: { description: 'Forbidden: Admin role required.' },
        409: { description: 'Conflict: Email already exists.' },
    },
});
export const updateUserRoute = createRoute({
    method: 'patch',
    path: '/{id}',
    summary: 'Update User (Admin Only)',
    description: 'Updates an existing user role, status, or password.',
    tags: ['Admin Users'],
    security: [{ bearerAuth: [] }],
    request: {
        params: userIdParamSchema,
        body: {
            content: {
                'application/json': {
                    schema: updateUserRequestSchema,
                },
            },
            required: true,
        },
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: userProfileSchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'User updated successfully.',
        },
        400: { description: 'Validation error.' },
        401: { description: 'Unauthenticated.' },
        403: { description: 'Forbidden: Admin role required.' },
        404: { description: 'User not found.' },
        409: { description: 'Conflict: Cannot demote or deactivate the last admin.' },
    },
});
export const deleteUserRoute = createRoute({
    method: 'delete',
    path: '/{id}',
    summary: 'Delete User (Admin Only)',
    description: 'Deletes a user account.',
    tags: ['Admin Users'],
    security: [{ bearerAuth: [] }],
    request: {
        params: userIdParamSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: z.object({ message: z.string() }),
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'User deleted successfully.',
        },
        401: { description: 'Unauthenticated.' },
        403: { description: 'Forbidden: Admin role required.' },
        404: { description: 'User not found.' },
        409: { description: 'Conflict: Cannot delete the last admin.' },
    },
});
export const usersRouter = new OpenAPIHono();
// Admin write rate limiter
const adminLimiter = rateLimitMiddleware({
    windowMs: rateLimitConfig.admin.windowMs,
    max: rateLimitConfig.admin.max,
    keyGenerator: (c) => `admin:${c.get('userId') ?? c.get('clientIp')}`,
});
// Protect all admin user routes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
usersRouter.use('*', authenticate(), requireRole('ADMIN'), adminLimiter);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
usersRouter.openapi(listUsersRoute, usersController.list);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
usersRouter.openapi(getUserRoute, usersController.get);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
usersRouter.openapi(createUserRoute, usersController.create);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
usersRouter.openapi(updateUserRoute, usersController.update);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
usersRouter.openapi(deleteUserRoute, usersController.delete);
