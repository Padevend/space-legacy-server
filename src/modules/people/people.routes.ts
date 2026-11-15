import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import type { AppEnv } from '../../core/http/context.js';
import { peopleController } from './people.controller.js';
import {
  personSchema,
  listPeopleQuerySchema,
  createPersonRequestSchema,
  updatePersonRequestSchema,
  personIdParamSchema,
} from './people.schemas.js';
import { authenticate, requireRole } from '../../core/security/index.js';

// ==========================================
// PUBLIC ROUTES
// ==========================================

export const listPeopleRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List People',
  description: 'Retrieves a paginated list of astronauts, engineers, and key historical figures.',
  tags: ['People'],
  request: {
    query: listPeopleQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(personSchema),
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
      description: 'Paginated list of people.',
    },
  },
});

export const getPersonRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get Person By ID',
  description: 'Retrieves details for a single person by UUID.',
  tags: ['People'],
  request: {
    params: personIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: personSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Person details.',
    },
    404: { description: 'Person not found.' },
  },
});

export const publicPeopleRouter = new OpenAPIHono<AppEnv>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicPeopleRouter.openapi(listPeopleRoute, peopleController.list as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicPeopleRouter.openapi(getPersonRoute, peopleController.get as any);

// ==========================================
// ADMIN ROUTES
// ==========================================

export const createPersonRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create Person (Admin/Editor)',
  description: 'Creates a new person profile.',
  tags: ['Admin People'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createPersonRequestSchema,
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
            data: personSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Person created successfully.',
    },
    401: { description: 'Unauthenticated.' },
    403: { description: 'Forbidden.' },
  },
});

export const updatePersonRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update Person (Admin/Editor)',
  description: 'Updates an existing person profile.',
  tags: ['Admin People'],
  security: [{ bearerAuth: [] }],
  request: {
    params: personIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: updatePersonRequestSchema,
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
            data: personSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Person updated successfully.',
    },
    401: { description: 'Unauthenticated.' },
    403: { description: 'Forbidden.' },
    404: { description: 'Person not found.' },
  },
});

export const deletePersonRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete Person (Admin Only)',
  description: 'Deletes a person. Admin role required.',
  tags: ['Admin People'],
  security: [{ bearerAuth: [] }],
  request: {
    params: personIdParamSchema,
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
      description: 'Person deleted successfully.',
    },
    401: { description: 'Unauthenticated.' },
    403: { description: 'Forbidden: Admin role required.' },
    404: { description: 'Person not found.' },
    409: { description: 'Conflict: Cannot delete person referenced by missions or equipment.' },
  },
});

export const adminPeopleRouter = new OpenAPIHono<AppEnv>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminPeopleRouter.use('*', authenticate() as any);

// Read
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminPeopleRouter.openapi(listPeopleRoute, peopleController.list as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminPeopleRouter.openapi(getPersonRoute, peopleController.get as any);

// Write (Admin or Editor)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminPeopleRouter.openapi(createPersonRoute, peopleController.create as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminPeopleRouter.openapi(updatePersonRoute, peopleController.update as any);

// Delete (Admin Only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminPeopleRouter.openapi(deletePersonRoute, peopleController.delete as any);
