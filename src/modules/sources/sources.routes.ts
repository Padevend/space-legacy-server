import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import type { AppEnv } from '../../core/http/context.js';
import { sourcesController } from './sources.controller.js';
import {
  sourceSchema,
  listSourcesQuerySchema,
  createSourceRequestSchema,
  updateSourceRequestSchema,
  sourceIdParamSchema,
} from './sources.schemas.js';
import { authenticate, requireRole } from '../../core/security/index.js';

// ==========================================
// PUBLIC ROUTES
// ==========================================

export const listSourcesRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List Sources',
  description: 'Retrieves a paginated list of authoritative sources and literature references.',
  tags: ['Sources'],
  request: {
    query: listSourcesQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(sourceSchema),
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
      description: 'Paginated list of sources.',
    },
  },
});

export const getSourceRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get Source By ID',
  description: 'Retrieves single source reference details by UUID.',
  tags: ['Sources'],
  request: {
    params: sourceIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: sourceSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Source details.',
    },
    404: { description: 'Source not found.' },
  },
});

export const publicSourcesRouter = new OpenAPIHono<AppEnv>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicSourcesRouter.openapi(listSourcesRoute, sourcesController.list as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicSourcesRouter.openapi(getSourceRoute, sourcesController.get as any);

// ==========================================
// ADMIN ROUTES
// ==========================================

export const createSourceRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create Source (Admin/Editor)',
  description: 'Creates a new reference source.',
  tags: ['Admin Sources'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createSourceRequestSchema,
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
            data: sourceSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Source created successfully.',
    },
    400: { description: 'Validation error.' },
    401: { description: 'Unauthenticated.' },
    403: { description: 'Forbidden.' },
    409: { description: 'Conflict: Source URL already exists.' },
  },
});

export const updateSourceRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update Source (Admin/Editor)',
  description: 'Updates an existing reference source.',
  tags: ['Admin Sources'],
  security: [{ bearerAuth: [] }],
  request: {
    params: sourceIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: updateSourceRequestSchema,
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
            data: sourceSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Source updated successfully.',
    },
    400: { description: 'Validation error.' },
    401: { description: 'Unauthenticated.' },
    403: { description: 'Forbidden.' },
    404: { description: 'Source not found.' },
    409: { description: 'Conflict: Source URL already exists.' },
  },
});

export const deleteSourceRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete Source (Admin Only)',
  description: 'Deletes a source. Admin role required.',
  tags: ['Admin Sources'],
  security: [{ bearerAuth: [] }],
  request: {
    params: sourceIdParamSchema,
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
      description: 'Source deleted successfully.',
    },
    401: { description: 'Unauthenticated.' },
    403: { description: 'Forbidden: Admin role required.' },
    404: { description: 'Source not found.' },
    409: { description: 'Conflict: Cannot delete source linked to equipment or missions.' },
  },
});

export const adminSourcesRouter = new OpenAPIHono<AppEnv>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminSourcesRouter.use('*', authenticate() as any);

// Read
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminSourcesRouter.openapi(listSourcesRoute, sourcesController.list as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminSourcesRouter.openapi(getSourceRoute, sourcesController.get as any);

// Write (Admin or Editor)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminSourcesRouter.openapi(createSourceRoute, sourcesController.create as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminSourcesRouter.openapi(updateSourceRoute, sourcesController.update as any);

// Delete (Admin Only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminSourcesRouter.openapi(deleteSourceRoute, sourcesController.delete as any);
