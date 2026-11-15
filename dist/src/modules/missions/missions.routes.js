import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import { missionsController } from './missions.controller.js';
import { missionSchema, missionDetailSchema, listMissionsQuerySchema, getMissionQuerySchema, missionIdOrSlugParamSchema, missionIdParamSchema, createMissionRequestSchema, updateMissionRequestSchema, linkMissionPersonSchema, linkMissionSourceSchema, linkMissionEquipmentSchema, } from './missions.schemas.js';
import { authenticate } from '../../core/security/index.js';
// ==========================================
// PUBLIC ROUTES
// ==========================================
export const listMissionsRoute = createRoute({
    method: 'get',
    path: '/',
    summary: 'List Missions',
    description: 'Retrieves a paginated list of space missions with optional filtering and search.',
    tags: ['Missions'],
    request: {
        query: listMissionsQuerySchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: z.array(missionSchema),
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
            description: 'Paginated list of missions.',
        },
    },
});
export const getMissionRoute = createRoute({
    method: 'get',
    path: '/{idOrSlug}',
    summary: 'Get Mission By ID or Slug',
    description: 'Retrieves details for a single mission by UUID or slug with optional includes.',
    tags: ['Missions'],
    request: {
        params: missionIdOrSlugParamSchema,
        query: getMissionQuerySchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: missionDetailSchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'Mission details with requested relations.',
        },
        404: { description: 'Mission not found.' },
        422: { description: 'Unprocessable query parameters.' },
    },
});
export const publicMissionsRouter = new OpenAPIHono();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicMissionsRouter.openapi(listMissionsRoute, missionsController.list);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicMissionsRouter.openapi(getMissionRoute, missionsController.get);
// ==========================================
// ADMIN ROUTES
// ==========================================
export const createMissionRoute = createRoute({
    method: 'post',
    path: '/',
    summary: 'Create Mission',
    description: 'Creates a new mission. Editor or Admin role required.',
    tags: ['Admin Missions'],
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                'application/json': { schema: createMissionRequestSchema },
            },
        },
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: missionSchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'Mission created successfully.',
        },
        400: { description: 'Invalid request body.' },
        401: { description: 'Unauthenticated.' },
        409: { description: 'Conflict: Slug already exists.' },
    },
});
export const updateMissionRoute = createRoute({
    method: 'patch',
    path: '/{id}',
    summary: 'Update Mission',
    description: 'Updates an existing mission. Editor or Admin role required.',
    tags: ['Admin Missions'],
    security: [{ bearerAuth: [] }],
    request: {
        params: missionIdParamSchema,
        body: {
            content: {
                'application/json': { schema: updateMissionRequestSchema },
            },
        },
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        success: z.literal(true),
                        data: missionSchema,
                        meta: z.object({ requestId: z.string() }),
                    }),
                },
            },
            description: 'Mission updated successfully.',
        },
        400: { description: 'Invalid request body.' },
        401: { description: 'Unauthenticated.' },
        404: { description: 'Mission not found.' },
        409: { description: 'Conflict: Slug already in use.' },
    },
});
export const deleteMissionRoute = createRoute({
    method: 'delete',
    path: '/{id}',
    summary: 'Delete Mission (Admin Only)',
    description: 'Deletes a mission. Admin role required.',
    tags: ['Admin Missions'],
    security: [{ bearerAuth: [] }],
    request: {
        params: missionIdParamSchema,
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
            description: 'Mission deleted successfully.',
        },
        401: { description: 'Unauthenticated.' },
        403: { description: 'Forbidden: Admin role required.' },
        404: { description: 'Mission not found.' },
        409: { description: 'Conflict: Cannot delete mission with active associated records.' },
    },
});
// Relation route definitions
export const linkMissionPersonRoute = createRoute({
    method: 'put',
    path: '/{id}/people/{personId}',
    summary: 'Link Person to Mission',
    description: 'Associates a person with a mission, specifying their role.',
    tags: ['Admin Missions'],
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({ id: z.string().uuid(), personId: z.string().uuid() }),
        body: {
            content: {
                'application/json': { schema: linkMissionPersonSchema },
            },
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
            description: 'Person linked to mission.',
        },
        401: { description: 'Unauthenticated.' },
        404: { description: 'Mission or Person not found.' },
    },
});
export const unlinkMissionPersonRoute = createRoute({
    method: 'delete',
    path: '/{id}/people/{personId}',
    summary: 'Unlink Person from Mission',
    description: 'Removes association between person and mission.',
    tags: ['Admin Missions'],
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({ id: z.string().uuid(), personId: z.string().uuid() }),
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
            description: 'Person unlinked from mission.',
        },
        401: { description: 'Unauthenticated.' },
        404: { description: 'Association not found.' },
    },
});
export const linkMissionSourceRoute = createRoute({
    method: 'put',
    path: '/{id}/sources/{sourceId}',
    summary: 'Link Source to Mission',
    description: 'Associates a primary source with a mission with claim description.',
    tags: ['Admin Missions'],
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({ id: z.string().uuid(), sourceId: z.string().uuid() }),
        body: {
            content: {
                'application/json': { schema: linkMissionSourceSchema },
            },
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
            description: 'Source linked to mission.',
        },
        401: { description: 'Unauthenticated.' },
        404: { description: 'Mission or Source not found.' },
    },
});
export const unlinkMissionSourceRoute = createRoute({
    method: 'delete',
    path: '/{id}/sources/{sourceId}',
    summary: 'Unlink Source from Mission',
    description: 'Removes source association from mission.',
    tags: ['Admin Missions'],
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({ id: z.string().uuid(), sourceId: z.string().uuid() }),
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
            description: 'Source unlinked from mission.',
        },
        401: { description: 'Unauthenticated.' },
        404: { description: 'Association not found.' },
    },
});
export const linkMissionEquipmentRoute = createRoute({
    method: 'put',
    path: '/{id}/equipment/{equipmentId}',
    summary: 'Link Equipment to Mission',
    description: 'Associates an equipment piece with a mission.',
    tags: ['Admin Missions'],
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({ id: z.string().uuid(), equipmentId: z.string().uuid() }),
        body: {
            content: {
                'application/json': { schema: linkMissionEquipmentSchema },
            },
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
            description: 'Equipment linked to mission.',
        },
        401: { description: 'Unauthenticated.' },
        404: { description: 'Mission or Equipment not found.' },
    },
});
export const unlinkMissionEquipmentRoute = createRoute({
    method: 'delete',
    path: '/{id}/equipment/{equipmentId}',
    summary: 'Unlink Equipment from Mission',
    description: 'Removes equipment association from mission.',
    tags: ['Admin Missions'],
    security: [{ bearerAuth: [] }],
    request: {
        params: z.object({ id: z.string().uuid(), equipmentId: z.string().uuid() }),
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
            description: 'Equipment unlinked from mission.',
        },
        401: { description: 'Unauthenticated.' },
        404: { description: 'Association not found.' },
    },
});
export const adminMissionsRouter = new OpenAPIHono();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMissionsRouter.use('*', authenticate());
// Read
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMissionsRouter.openapi(listMissionsRoute, missionsController.list);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMissionsRouter.openapi(getMissionRoute, missionsController.get);
// Write (Admin or Editor)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMissionsRouter.openapi(createMissionRoute, missionsController.create);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMissionsRouter.openapi(updateMissionRoute, missionsController.update);
// Delete (Admin Only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMissionsRouter.openapi(deleteMissionRoute, missionsController.delete);
// Relations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMissionsRouter.openapi(linkMissionPersonRoute, missionsController.linkPerson);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMissionsRouter.openapi(unlinkMissionPersonRoute, missionsController.unlinkPerson);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMissionsRouter.openapi(linkMissionSourceRoute, missionsController.linkSource);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMissionsRouter.openapi(unlinkMissionSourceRoute, missionsController.unlinkSource);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMissionsRouter.openapi(linkMissionEquipmentRoute, missionsController.linkEquipment);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMissionsRouter.openapi(unlinkMissionEquipmentRoute, missionsController.unlinkEquipment);
