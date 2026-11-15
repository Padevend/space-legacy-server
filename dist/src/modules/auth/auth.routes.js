import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { authController } from './auth.controller.js';
import { loginRequestSchema, loginResponseDataSchema, refreshResponseDataSchema, userProfileSchema, changePasswordRequestSchema, } from './auth.schemas.js';
import { authenticate, strictCookieCsrfMiddleware, rateLimitMiddleware } from '../../core/security/index.js';
import { rateLimitConfig } from '../../../config/rate-limit.js';
export const loginRoute = createRoute({
    method: 'post',
    path: '/login',
    summary: 'User Authentication',
    description: 'Authenticates user credentials using Argon2id, issues a short-lived JWT access token, and sets an HttpOnly refresh cookie.',
    tags: ['Auth'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: loginRequestSchema,
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
                        data: loginResponseDataSchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'Login successful.',
        },
        401: {
            description: 'Invalid email, password, or account locked.',
        },
        429: {
            description: 'Too many login attempts.',
        },
    },
});
export const refreshRoute = createRoute({
    method: 'post',
    path: '/refresh',
    summary: 'Rotate Access and Refresh Tokens',
    description: 'Exchanges the refresh cookie for a new JWT access token and rotates the refresh token. Detects token reuse to prevent replay attacks.',
    tags: ['Auth'],
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: refreshResponseDataSchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'Token refreshed successfully.',
        },
        401: {
            description: 'Invalid, expired, or reused refresh token.',
        },
        403: {
            description: 'Disallowed origin or missing CSRF token.',
        },
    },
});
export const logoutRoute = createRoute({
    method: 'post',
    path: '/logout',
    summary: 'User Logout',
    description: 'Revokes the active refresh token family and clears the refresh cookie.',
    tags: ['Auth'],
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
            description: 'Logged out successfully.',
        },
        403: {
            description: 'Disallowed origin or missing CSRF token.',
        },
    },
});
export const meRoute = createRoute({
    method: 'get',
    path: '/me',
    summary: 'Current User Profile',
    description: 'Retrieves the authenticated user profile from the Bearer access token.',
    tags: ['Auth'],
    security: [{ bearerAuth: [] }],
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
            description: 'Authenticated user profile.',
        },
        401: {
            description: 'Unauthenticated or invalid token.',
        },
    },
});
export const changePasswordRoute = createRoute({
    method: 'post',
    path: '/change-password',
    summary: 'Change User Password',
    description: 'Changes password for the authenticated user and terminates all other active sessions.',
    tags: ['Auth'],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: changePasswordRequestSchema,
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
                        data: z.object({ message: z.string() }),
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'Password changed successfully.',
        },
        400: {
            description: 'Invalid current password or weak new password.',
        },
        401: {
            description: 'Unauthenticated.',
        },
    },
});
export const authRouter = new OpenAPIHono();
// Route specific rate limiters
const loginLimiter = rateLimitMiddleware({
    windowMs: rateLimitConfig.loginAttempt.windowMs,
    max: rateLimitConfig.loginAttempt.maxIp,
    keyGenerator: (c) => `login:${c.get('clientIp')}`,
});
const refreshLimiter = rateLimitMiddleware({
    windowMs: rateLimitConfig.refresh.windowMs,
    max: rateLimitConfig.refresh.max,
    keyGenerator: (c) => `refresh:${c.get('clientIp')}`,
});
// Mount routes with respective security middlewares
// eslint-disable-next-line @typescript-eslint/no-explicit-any
authRouter.use('/login', loginLimiter);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
authRouter.openapi(loginRoute, authController.login);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
authRouter.use('/refresh', refreshLimiter, strictCookieCsrfMiddleware());
// eslint-disable-next-line @typescript-eslint/no-explicit-any
authRouter.openapi(refreshRoute, authController.refresh);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
authRouter.use('/logout', strictCookieCsrfMiddleware(), authenticate(true));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
authRouter.openapi(logoutRoute, authController.logout);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
authRouter.use('/me', authenticate());
// eslint-disable-next-line @typescript-eslint/no-explicit-any
authRouter.openapi(meRoute, authController.me);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
authRouter.use('/change-password', authenticate());
// eslint-disable-next-line @typescript-eslint/no-explicit-any
authRouter.openapi(changePasswordRoute, authController.changePassword);
