import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import type { AppEnv } from '../../core/http/context.js';
import { measurementsController } from './measurements.controller.js';
import {
  measurementSchema,
  measurementDetailSchema,
  listMeasurementsQuerySchema,
  getMeasurementQuerySchema,
  measurementIdParamSchema,
  createMeasurementRequestSchema,
  updateMeasurementRequestSchema,
  linkMeasurementSourceSchema,
} from './measurements.schemas.js';
import { authenticate } from '../../core/security/index.js';

// ==========================================
// PUBLIC ROUTES
// ==========================================

export const listMeasurementsRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List Measurements',
  description: 'Retrieves scientific measurements recorded by equipment or events with exact decimal values.',
  tags: ['Measurements'],
  request: {
    query: listMeasurementsQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(measurementSchema),
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
      description: 'Paginated list of measurements.',
    },
  },
});

export const getMeasurementRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get Measurement By ID',
  description: 'Retrieves details for a single scientific measurement by UUID with optional includes.',
  tags: ['Measurements'],
  request: {
    params: measurementIdParamSchema,
    query: getMeasurementQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: measurementDetailSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Measurement details with requested relations.',
    },
    404: { description: 'Measurement not found.' },
    422: { description: 'Unprocessable query parameters.' },
  },
});

export const publicMeasurementsRouter = new OpenAPIHono<AppEnv>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicMeasurementsRouter.openapi(listMeasurementsRoute, measurementsController.list as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicMeasurementsRouter.openapi(getMeasurementRoute, measurementsController.get as any);

// ==========================================
// ADMIN ROUTES
// ==========================================

export const createMeasurementRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create Measurement',
  description: 'Records a new scientific measurement. String decimals preserve scientific precision.',
  tags: ['Admin Measurements'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createMeasurementRequestSchema },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: measurementSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Measurement recorded successfully.',
    },
    400: { description: 'Invalid request body.' },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Linked equipment or event not found.' },
  },
});

export const updateMeasurementRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update Measurement',
  description: 'Updates an existing measurement.',
  tags: ['Admin Measurements'],
  security: [{ bearerAuth: [] }],
  request: {
    params: measurementIdParamSchema,
    body: {
      content: {
        'application/json': { schema: updateMeasurementRequestSchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: measurementSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Measurement updated successfully.',
    },
    400: { description: 'Invalid request body.' },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Measurement not found.' },
  },
});

export const deleteMeasurementRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete Measurement (Admin Only)',
  description: 'Deletes a measurement. Admin role required.',
  tags: ['Admin Measurements'],
  security: [{ bearerAuth: [] }],
  request: {
    params: measurementIdParamSchema,
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
      description: 'Measurement deleted successfully.',
    },
    401: { description: 'Unauthenticated.' },
    403: { description: 'Forbidden: Admin role required.' },
    404: { description: 'Measurement not found.' },
  },
});

// Admin Relations
export const linkMeasurementSourceRoute = createRoute({
  method: 'put',
  path: '/{id}/sources/{sourceId}',
  summary: 'Link Source to Measurement',
  description: 'Associates a primary source with a measurement.',
  tags: ['Admin Measurements'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), sourceId: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: linkMeasurementSourceSchema },
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
      description: 'Source linked to measurement.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Measurement or Source not found.' },
  },
});

export const unlinkMeasurementSourceRoute = createRoute({
  method: 'delete',
  path: '/{id}/sources/{sourceId}',
  summary: 'Unlink Source from Measurement',
  description: 'Removes source association from measurement.',
  tags: ['Admin Measurements'],
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
      description: 'Source unlinked from measurement.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Association not found.' },
  },
});

export const adminMeasurementsRouter = new OpenAPIHono<AppEnv>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMeasurementsRouter.use('*', authenticate() as any);

// Read
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMeasurementsRouter.openapi(listMeasurementsRoute, measurementsController.list as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMeasurementsRouter.openapi(getMeasurementRoute, measurementsController.get as any);

// Write (Admin or Editor)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMeasurementsRouter.openapi(createMeasurementRoute, measurementsController.create as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMeasurementsRouter.openapi(updateMeasurementRoute, measurementsController.update as any);

// Delete (Admin Only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMeasurementsRouter.openapi(deleteMeasurementRoute, measurementsController.delete as any);

// Relations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMeasurementsRouter.openapi(linkMeasurementSourceRoute, measurementsController.linkSource as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminMeasurementsRouter.openapi(unlinkMeasurementSourceRoute, measurementsController.unlinkSource as any);
