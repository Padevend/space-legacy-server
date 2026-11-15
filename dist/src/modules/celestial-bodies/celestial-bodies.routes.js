import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { celestialBodiesController } from './celestial-bodies.controller.js';
import { celestialBodySchema, listCelestialBodiesQuerySchema, createCelestialBodyRequestSchema, updateCelestialBodyRequestSchema, celestialBodyIdParamSchema, } from './celestial-bodies.schemas.js';
import { authenticate, requireRole } from '../../core/security/index.js';
// ==========================================
// PUBLIC ROUTES
// ==========================================
export const listCelestialBodiesRoute = createRoute({
    method: 'get',
    path: '/',
    summary: 'List Celestial Bodies',
    description: 'Retrieves a paginated list of celestial bodies (Moon, Mars, etc.).',
    tags: ['Celestial Bodies'],
    request: {
        query: listCelestialBodiesQuerySchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: z.array(celestialBodySchema),
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
            description: 'Paginated list of celestial bodies.',
        },
    },
});
export const getCelestialBodyRoute = createRoute({
    method: 'get',
    path: '/{id}',
    summary: 'Get Celestial Body By ID',
    description: 'Retrieves details for a single celestial body by UUID.',
    tags: ['Celestial Bodies'],
    request: {
        params: celestialBodyIdParamSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: celestialBodySchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'Celestial body details.',
        },
        404: { description: 'Celestial body not found.' },
    },
});
export const publicCelestialBodiesRouter = new OpenAPIHono();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicCelestialBodiesRouter.openapi(listCelestialBodiesRoute, celestialBodiesController.list);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicCelestialBodiesRouter.openapi(getCelestialBodyRoute, celestialBodiesController.get);
// ==========================================
// ADMIN ROUTES
// ==========================================
export const createCelestialBodyRoute = createRoute({
    method: 'post',
    path: '/',
    summary: 'Create Celestial Body (Admin/Editor)',
    description: 'Creates a new celestial body.',
    tags: ['Admin Celestial Bodies'],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: createCelestialBodyRequestSchema,
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
                        data: celestialBodySchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'Celestial body created successfully.',
        },
        401: { description: 'Unauthenticated.' },
        403: { description: 'Forbidden.' },
        409: { description: 'Conflict: Celestial body already exists.' },
    },
});
export const updateCelestialBodyRoute = createRoute({
    method: 'patch',
    path: '/{id}',
    summary: 'Update Celestial Body (Admin/Editor)',
    description: 'Updates an existing celestial body.',
    tags: ['Admin Celestial Bodies'],
    security: [{ bearerAuth: [] }],
    request: {
        params: celestialBodyIdParamSchema,
        body: {
            content: {
                'application/json': {
                    schema: updateCelestialBodyRequestSchema,
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
                        data: celestialBodySchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'Celestial body updated successfully.',
        },
        401: { description: 'Unauthenticated.' },
        403: { description: 'Forbidden.' },
        404: { description: 'Celestial body not found.' },
        409: { description: 'Conflict: Name already exists.' },
    },
});
export const deleteCelestialBodyRoute = createRoute({
    method: 'delete',
    path: '/{id}',
    summary: 'Delete Celestial Body (Admin Only)',
    description: 'Deletes a celestial body. Admin role required.',
    tags: ['Admin Celestial Bodies'],
    security: [{ bearerAuth: [] }],
    request: {
        params: celestialBodyIdParamSchema,
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
            description: 'Celestial body deleted successfully.',
        },
        401: { description: 'Unauthenticated.' },
        403: { description: 'Forbidden: Admin role required.' },
        404: { description: 'Celestial body not found.' },
        409: { description: 'Conflict: Cannot delete celestial body with linked locations.' },
    },
});
export const adminCelestialBodiesRouter = new OpenAPIHono();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminCelestialBodiesRouter.use('*', authenticate());
// Read
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminCelestialBodiesRouter.openapi(listCelestialBodiesRoute, celestialBodiesController.list);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminCelestialBodiesRouter.openapi(getCelestialBodyRoute, celestialBodiesController.get);
// Write (Admin or Editor)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminCelestialBodiesRouter.openapi(createCelestialBodyRoute, celestialBodiesController.create);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminCelestialBodiesRouter.openapi(updateCelestialBodyRoute, celestialBodiesController.update);
// Delete (Admin Only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminCelestialBodiesRouter.openapi(deleteCelestialBodyRoute, celestialBodiesController.delete);
