import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import type { AppEnv } from '../../core/http/context.js';
import { equipmentController } from './equipment.controller.js';
import {
  equipmentSchema,
  equipmentDetailSchema,
  listEquipmentQuerySchema,
  getEquipmentQuerySchema,
  equipmentIdOrSlugParamSchema,
  equipmentIdParamSchema,
  createEquipmentRequestSchema,
  updateEquipmentRequestSchema,
  linkEquipmentLocationSchema,
  linkEquipmentPersonSchema,
  linkEquipmentSourceSchema,
} from './equipment.schemas.js';
import { linkMissionEquipmentSchema } from '../missions/missions.schemas.js';
import { authenticate } from '../../core/security/index.js';

// ==========================================
// PUBLIC ROUTES
// ==========================================

export const listEquipmentRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List Equipment',
  description: 'Retrieves a paginated list of equipment left in space, on the Moon, or Mars.',
  tags: ['Equipment'],
  request: {
    query: listEquipmentQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(equipmentSchema),
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
      description: 'Paginated list of equipment.',
    },
  },
});

export const getEquipmentRoute = createRoute({
  method: 'get',
  path: '/{idOrSlug}',
  summary: 'Get Equipment By ID or Slug',
  description: 'Retrieves details for a single equipment piece by UUID or slug with optional includes.',
  tags: ['Equipment'],
  request: {
    params: equipmentIdOrSlugParamSchema,
    query: getEquipmentQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: equipmentDetailSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Equipment details with requested relations.',
    },
    404: { description: 'Equipment not found.' },
    422: { description: 'Unprocessable query parameters.' },
  },
});

export const getEquipmentChildrenRoute = createRoute({
  method: 'get',
  path: '/{idOrSlug}/children',
  summary: 'Get Equipment Sub-Assemblies (Children)',
  description: 'Retrieves child equipment / sub-components of an equipment piece.',
  tags: ['Equipment'],
  request: {
    params: equipmentIdOrSlugParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(equipmentSchema),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'List of child equipment items.',
    },
    404: { description: 'Equipment not found.' },
  },
});

export const getEquipmentEventsRoute = createRoute({
  method: 'get',
  path: '/{idOrSlug}/events',
  summary: 'Get Equipment Events',
  description: 'Retrieves timeline events associated with this equipment piece.',
  tags: ['Equipment'],
  request: {
    params: equipmentIdOrSlugParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(
              z.object({
                eventId: z.string().uuid(),
                title: z.string(),
                eventType: z.string(),
                eventDate: z.string().nullable(),
                roleInEvent: z.string().nullable(),
                description: z.string().nullable(),
              })
            ),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Events linked to equipment.',
    },
    404: { description: 'Equipment not found.' },
  },
});

export const getEquipmentLocationsRoute = createRoute({
  method: 'get',
  path: '/{idOrSlug}/locations',
  summary: 'Get Equipment Locations',
  description: 'Retrieves historical and current locations of this equipment.',
  tags: ['Equipment'],
  request: {
    params: equipmentIdOrSlugParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(
              z.object({
                equipmentLocationId: z.string().uuid(),
                locationId: z.string().uuid(),
                name: z.string(),
                latitude: z.number().nullable(),
                longitude: z.number().nullable(),
                startDate: z.string().nullable(),
                endDate: z.string().nullable(),
                locationPrecision: z.string(),
              })
            ),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Locations linked to equipment.',
    },
    404: { description: 'Equipment not found.' },
  },
});

export const getEquipmentMeasurementsRoute = createRoute({
  method: 'get',
  path: '/{idOrSlug}/measurements',
  summary: 'Get Equipment Measurements',
  description: 'Retrieves scientific measurements recorded by or for this equipment.',
  tags: ['Equipment'],
  request: {
    params: equipmentIdOrSlugParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(
              z.object({
                measurementId: z.string().uuid(),
                name: z.string(),
                value: z.string(),
                unit: z.string(),
                measurementType: z.string(),
                context: z.string(),
                measurementDate: z.string().nullable(),
                isApproximate: z.boolean(),
                uncertainty: z.string().nullable(),
              })
            ),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Measurements linked to equipment.',
    },
    404: { description: 'Equipment not found.' },
  },
});

export const getEquipmentMediaRoute = createRoute({
  method: 'get',
  path: '/{idOrSlug}/media',
  summary: 'Get Equipment Media',
  description: 'Retrieves photos, models, and audio linked to this equipment.',
  tags: ['Equipment'],
  request: {
    params: equipmentIdOrSlugParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(
              z.object({
                mediaId: z.string().uuid(),
                title: z.string(),
                mediaType: z.string(),
                url: z.string(),
                thumbnailUrl: z.string().nullable(),
                provenanceType: z.string(),
                requiresAiLabel: z.boolean(),
              })
            ),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Media linked to equipment.',
    },
    404: { description: 'Equipment not found.' },
  },
});

export const getEquipmentSourcesRoute = createRoute({
  method: 'get',
  path: '/{idOrSlug}/sources',
  summary: 'Get Equipment Sources',
  description: 'Retrieves primary sources and technical documentation verifying this equipment.',
  tags: ['Equipment'],
  request: {
    params: equipmentIdOrSlugParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(
              z.object({
                sourceId: z.string().uuid(),
                title: z.string(),
                url: z.string(),
                publisher: z.string(),
                claimDescription: z.string().nullable(),
              })
            ),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Sources linked to equipment.',
    },
    404: { description: 'Equipment not found.' },
  },
});

export const publicEquipmentRouter = new OpenAPIHono<AppEnv>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicEquipmentRouter.openapi(listEquipmentRoute, equipmentController.list as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicEquipmentRouter.openapi(getEquipmentRoute, equipmentController.get as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicEquipmentRouter.openapi(getEquipmentChildrenRoute, equipmentController.getChildren as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicEquipmentRouter.openapi(getEquipmentEventsRoute, equipmentController.getEvents as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicEquipmentRouter.openapi(getEquipmentLocationsRoute, equipmentController.getLocations as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicEquipmentRouter.openapi(getEquipmentMeasurementsRoute, equipmentController.getMeasurements as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicEquipmentRouter.openapi(getEquipmentMediaRoute, equipmentController.getMedia as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicEquipmentRouter.openapi(getEquipmentSourcesRoute, equipmentController.getSources as any);

// ==========================================
// ADMIN ROUTES
// ==========================================

export const createEquipmentRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create Equipment',
  description: 'Creates a new equipment item. Hierarchy cycle checking enforced.',
  tags: ['Admin Equipment'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createEquipmentRequestSchema },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: equipmentSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Equipment created successfully.',
    },
    400: { description: 'Invalid request body.' },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Parent equipment not found.' },
    409: { description: 'Conflict: Slug already exists.' },
    422: { description: 'Hierarchy cycle or invalid parent.' },
  },
});

export const updateEquipmentRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update Equipment',
  description: 'Updates an existing equipment item. Hierarchy cycle checking enforced.',
  tags: ['Admin Equipment'],
  security: [{ bearerAuth: [] }],
  request: {
    params: equipmentIdParamSchema,
    body: {
      content: {
        'application/json': { schema: updateEquipmentRequestSchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: equipmentSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Equipment updated successfully.',
    },
    400: { description: 'Invalid request body.' },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Equipment not found.' },
    409: { description: 'Conflict: Slug already exists.' },
    422: { description: 'Hierarchy cycle or invalid parent.' },
  },
});

export const deleteEquipmentRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete Equipment (Admin Only)',
  description: 'Deletes equipment. Admin role required.',
  tags: ['Admin Equipment'],
  security: [{ bearerAuth: [] }],
  request: {
    params: equipmentIdParamSchema,
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
      description: 'Equipment deleted successfully.',
    },
    401: { description: 'Unauthenticated.' },
    403: { description: 'Forbidden: Admin role required.' },
    404: { description: 'Equipment not found.' },
    409: { description: 'Conflict: Cannot delete equipment with active dependencies.' },
  },
});

// Admin Relations
export const linkEquipmentMissionRoute = createRoute({
  method: 'put',
  path: '/{id}/missions/{missionId}',
  summary: 'Link Mission to Equipment',
  description: 'Associates a mission with an equipment piece.',
  tags: ['Admin Equipment'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), missionId: z.string().uuid() }),
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
      description: 'Mission linked to equipment.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Equipment or Mission not found.' },
  },
});

export const unlinkEquipmentMissionRoute = createRoute({
  method: 'delete',
  path: '/{id}/missions/{missionId}',
  summary: 'Unlink Mission from Equipment',
  description: 'Removes mission association from equipment.',
  tags: ['Admin Equipment'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), missionId: z.string().uuid() }),
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
      description: 'Mission unlinked from equipment.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Association not found.' },
  },
});

export const linkEquipmentLocationRoute = createRoute({
  method: 'put',
  path: '/{id}/locations/{locationId}',
  summary: 'Link Location to Equipment',
  description: 'Records a location entry for an equipment piece.',
  tags: ['Admin Equipment'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), locationId: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: linkEquipmentLocationSchema },
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
      description: 'Location linked to equipment.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Equipment or Location not found.' },
  },
});

export const unlinkEquipmentLocationRoute = createRoute({
  method: 'delete',
  path: '/{id}/locations/{equipmentLocationId}',
  summary: 'Unlink Location from Equipment',
  description: 'Deletes an equipment location record.',
  tags: ['Admin Equipment'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), equipmentLocationId: z.string().uuid() }),
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
      description: 'Equipment location removed.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Record not found.' },
  },
});

export const linkEquipmentPersonRoute = createRoute({
  method: 'put',
  path: '/{id}/people/{personId}',
  summary: 'Link Person to Equipment',
  description: 'Associates a person with equipment.',
  tags: ['Admin Equipment'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), personId: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: linkEquipmentPersonSchema },
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
      description: 'Person linked to equipment.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Equipment or Person not found.' },
  },
});

export const unlinkEquipmentPersonRoute = createRoute({
  method: 'delete',
  path: '/{id}/people/{personId}',
  summary: 'Unlink Person from Equipment',
  description: 'Removes person association from equipment.',
  tags: ['Admin Equipment'],
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
      description: 'Person unlinked from equipment.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Association not found.' },
  },
});

export const linkEquipmentSourceRoute = createRoute({
  method: 'put',
  path: '/{id}/sources/{sourceId}',
  summary: 'Link Source to Equipment',
  description: 'Associates a primary source with equipment.',
  tags: ['Admin Equipment'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), sourceId: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: linkEquipmentSourceSchema },
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
      description: 'Source linked to equipment.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Equipment or Source not found.' },
  },
});

export const unlinkEquipmentSourceRoute = createRoute({
  method: 'delete',
  path: '/{id}/sources/{sourceId}',
  summary: 'Unlink Source from Equipment',
  description: 'Removes source association from equipment.',
  tags: ['Admin Equipment'],
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
      description: 'Source unlinked from equipment.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Association not found.' },
  },
});

export const adminEquipmentRouter = new OpenAPIHono<AppEnv>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEquipmentRouter.use('*', authenticate() as any);

// Read
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEquipmentRouter.openapi(listEquipmentRoute, equipmentController.list as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEquipmentRouter.openapi(getEquipmentRoute, equipmentController.get as any);

// Write (Admin or Editor)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEquipmentRouter.openapi(createEquipmentRoute, equipmentController.create as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEquipmentRouter.openapi(updateEquipmentRoute, equipmentController.update as any);

// Delete (Admin Only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEquipmentRouter.openapi(deleteEquipmentRoute, equipmentController.delete as any);

// Relations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEquipmentRouter.openapi(linkEquipmentMissionRoute, equipmentController.linkMission as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEquipmentRouter.openapi(unlinkEquipmentMissionRoute, equipmentController.unlinkMission as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEquipmentRouter.openapi(linkEquipmentLocationRoute, equipmentController.linkLocation as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEquipmentRouter.openapi(unlinkEquipmentLocationRoute, equipmentController.unlinkLocation as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEquipmentRouter.openapi(linkEquipmentPersonRoute, equipmentController.linkPerson as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEquipmentRouter.openapi(unlinkEquipmentPersonRoute, equipmentController.unlinkPerson as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEquipmentRouter.openapi(linkEquipmentSourceRoute, equipmentController.linkSource as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEquipmentRouter.openapi(unlinkEquipmentSourceRoute, equipmentController.unlinkSource as any);
