import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import type { AppEnv } from '../../core/http/context.js';
import { mediaController } from './media.controller.js';
import {
  mediaSchema,
  mediaDetailSchema,
  listMediaQuerySchema,
  getMediaQuerySchema,
  mediaIdParamSchema,
  createMediaRequestSchema,
  updateMediaRequestSchema,
  linkMediaEquipmentSchema,
} from './media.schemas.js';
import { authenticate } from '../../core/security/index.js';

// ==========================================
// PUBLIC ROUTES
// ==========================================

export const listMediaRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List Media',
  description:
    'Retrieves a paginated list of media assets (photos, 3D models, audio, videos) with computed AI label requirement.',
  tags: ['Media'],
  request: {
    query: listMediaQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(mediaSchema),
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
      description: 'Paginated list of media assets.',
    },
  },
});

export const getMediaRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get Media By ID',
  description:
    'Retrieves details for a single media asset by UUID with computed requiresAiLabel flag and optional includes.',
  tags: ['Media'],
  request: {
    params: mediaIdParamSchema,
    query: getMediaQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: mediaDetailSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Media details with requested relations.',
    },
    404: { description: 'Media not found.' },
    422: { description: 'Unprocessable query parameters.' },
  },
});

export const publicMediaRouter = new OpenAPIHono<AppEnv>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicMediaRouter.openapi(listMediaRoute, mediaController.list as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicMediaRouter.openapi(getMediaRoute, mediaController.get as any);

// ==========================================
// ADMIN ROUTES
// ==========================================

export const createMediaRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create Media',
  description:
    'Adds a new media asset to the repository. If provenance is AI_GENERATED_ILLUSTRATION, requiresAiLabel is automatically set to true.',
  tags: ['Admin Media'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createMediaRequestSchema },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: mediaSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Media successfully created.',
    },
    401: { description: 'Unauthenticated.' },
    422: { description: 'Validation failed.' },
  },
});

export const updateMediaRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update Media',
  description: 'Modifies attributes of an existing media asset.',
  tags: ['Admin Media'],
  security: [{ bearerAuth: [] }],
  request: {
    params: mediaIdParamSchema,
    body: {
      content: {
        'application/json': { schema: updateMediaRequestSchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: mediaSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Media successfully updated.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Media not found.' },
    422: { description: 'Validation failed.' },
  },
});

export const deleteMediaRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete Media',
  description: 'Permanently removes a media asset (Admin only).',
  tags: ['Admin Media'],
  security: [{ bearerAuth: [] }],
  request: {
    params: mediaIdParamSchema,
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
      description: 'Media deleted.',
    },
    401: { description: 'Unauthenticated.' },
    403: { description: 'Forbidden (Admin role required).' },
    404: { description: 'Media not found.' },
  },
});

export const linkMediaEquipmentRoute = createRoute({
  method: 'put',
  path: '/{id}/equipment/{equipmentId}',
  summary: 'Link Media to Equipment',
  description: 'Associates a media asset with an equipment piece.',
  tags: ['Admin Media'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), equipmentId: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: linkMediaEquipmentSchema },
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
      description: 'Equipment linked to media.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Media or Equipment not found.' },
  },
});

export const unlinkMediaEquipmentRoute = createRoute({
  method: 'delete',
  path: '/{id}/equipment/{equipmentId}',
  summary: 'Unlink Equipment from Media',
  description: 'Removes equipment association from media asset.',
  tags: ['Admin Media'],
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
      description: 'Equipment unlinked from media.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Association not found.' },
  },
});

export const adminMediaRouter = new OpenAPIHono<AppEnv>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMediaRouter.use('*', authenticate() as any);

// Read
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMediaRouter.openapi(listMediaRoute, mediaController.list as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMediaRouter.openapi(getMediaRoute, mediaController.get as any);

// Write (Admin or Editor)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMediaRouter.openapi(createMediaRoute, mediaController.create as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMediaRouter.openapi(updateMediaRoute, mediaController.update as any);

// Delete (Admin Only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMediaRouter.openapi(deleteMediaRoute, mediaController.delete as any);

// Relations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMediaRouter.openapi(linkMediaEquipmentRoute, mediaController.linkEquipment as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMediaRouter.openapi(unlinkMediaEquipmentRoute, mediaController.unlinkEquipment as any);
