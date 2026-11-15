import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { locationsController } from './locations.controller.js';
import { locationSchema, listLocationsQuerySchema, createLocationRequestSchema, updateLocationRequestSchema, locationIdParamSchema, } from './locations.schemas.js';
import { authenticate, requireRole } from '../../core/security/index.js';
// ==========================================
// PUBLIC ROUTES
// ==========================================
export const listLocationsRoute = createRoute({
    method: 'get',
    path: '/',
    summary: 'List Locations',
    description: 'Retrieves a paginated list of equipment and mission locations.',
    tags: ['Locations'],
    request: {
        query: listLocationsQuerySchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: z.array(locationSchema),
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
            description: 'Paginated list of locations.',
        },
    },
});
export const getLocationRoute = createRoute({
    method: 'get',
    path: '/{id}',
    summary: 'Get Location By ID',
    description: 'Retrieves single location details by UUID.',
    tags: ['Locations'],
    request: {
        params: locationIdParamSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: locationSchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'Location details.',
        },
        404: { description: 'Location not found.' },
    },
});
export const publicLocationsRouter = new OpenAPIHono();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicLocationsRouter.openapi(listLocationsRoute, locationsController.list);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicLocationsRouter.openapi(getLocationRoute, locationsController.get);
// ==========================================
// ADMIN ROUTES
// ==========================================
export const createLocationRoute = createRoute({
    method: 'post',
    path: '/',
    summary: 'Create Location (Admin/Editor)',
    description: 'Creates a new location.',
    tags: ['Admin Locations'],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: createLocationRequestSchema,
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
                        data: locationSchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'Location created successfully.',
        },
        401: { description: 'Unauthenticated.' },
        403: { description: 'Forbidden.' },
    },
});
export const updateLocationRoute = createRoute({
    method: 'patch',
    path: '/{id}',
    summary: 'Update Location (Admin/Editor)',
    description: 'Updates an existing location.',
    tags: ['Admin Locations'],
    security: [{ bearerAuth: [] }],
    request: {
        params: locationIdParamSchema,
        body: {
            content: {
                'application/json': {
                    schema: updateLocationRequestSchema,
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
                        data: locationSchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'Location updated successfully.',
        },
        401: { description: 'Unauthenticated.' },
        403: { description: 'Forbidden.' },
        404: { description: 'Location not found.' },
    },
});
export const deleteLocationRoute = createRoute({
    method: 'delete',
    path: '/{id}',
    summary: 'Delete Location (Admin Only)',
    description: 'Deletes a location. Admin role required.',
    tags: ['Admin Locations'],
    security: [{ bearerAuth: [] }],
    request: {
        params: locationIdParamSchema,
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
            description: 'Location deleted successfully.',
        },
        401: { description: 'Unauthenticated.' },
        403: { description: 'Forbidden: Admin role required.' },
        404: { description: 'Location not found.' },
        409: { description: 'Conflict: Cannot delete location referenced by events or equipment.' },
    },
});
export const adminLocationsRouter = new OpenAPIHono();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminLocationsRouter.use('*', authenticate());
// Read
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminLocationsRouter.openapi(listLocationsRoute, locationsController.list);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminLocationsRouter.openapi(getLocationRoute, locationsController.get);
// Write (Admin or Editor)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminLocationsRouter.openapi(createLocationRoute, locationsController.create);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminLocationsRouter.openapi(updateLocationRoute, locationsController.update);
// Delete (Admin Only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminLocationsRouter.openapi(deleteLocationRoute, locationsController.delete);
