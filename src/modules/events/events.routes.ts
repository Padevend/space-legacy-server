import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import type { AppEnv } from '../../core/http/context.js';
import { eventsController } from './events.controller.js';
import {
  eventSchema,
  eventDetailSchema,
  listEventsQuerySchema,
  getEventQuerySchema,
  eventIdParamSchema,
  createEventRequestSchema,
  updateEventRequestSchema,
  linkEventEquipmentSchema,
  linkEventLocationSchema,
  linkEventPersonSchema,
  linkEventSourceSchema,
} from './events.schemas.js';
import { authenticate } from '../../core/security/index.js';

// ==========================================
// PUBLIC ROUTES
// ==========================================

export const listEventsRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List Events',
  description: 'Retrieves a paginated list of mission and equipment events with date and type filters.',
  tags: ['Events'],
  request: {
    query: listEventsQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(eventSchema),
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
      description: 'Paginated list of events.',
    },
  },
});

export const getEventRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get Event By ID',
  description: 'Retrieves details for a single event by UUID with optional includes.',
  tags: ['Events'],
  request: {
    params: eventIdParamSchema,
    query: getEventQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: eventDetailSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Event details with requested relations.',
    },
    404: { description: 'Event not found.' },
    422: { description: 'Unprocessable query parameters.' },
  },
});

export const publicEventsRouter = new OpenAPIHono<AppEnv>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicEventsRouter.openapi(listEventsRoute, eventsController.list as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicEventsRouter.openapi(getEventRoute, eventsController.get as any);

// ==========================================
// ADMIN ROUTES
// ==========================================

export const createEventRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create Event',
  description: 'Creates a new event for a mission.',
  tags: ['Admin Events'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createEventRequestSchema },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: eventSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Event created successfully.',
    },
    400: { description: 'Invalid request body.' },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Mission not found.' },
  },
});

export const updateEventRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update Event',
  description: 'Updates an existing event.',
  tags: ['Admin Events'],
  security: [{ bearerAuth: [] }],
  request: {
    params: eventIdParamSchema,
    body: {
      content: {
        'application/json': { schema: updateEventRequestSchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: eventSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Event updated successfully.',
    },
    400: { description: 'Invalid request body.' },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Event not found.' },
  },
});

export const deleteEventRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete Event (Admin Only)',
  description: 'Deletes an event. Admin role required.',
  tags: ['Admin Events'],
  security: [{ bearerAuth: [] }],
  request: {
    params: eventIdParamSchema,
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
      description: 'Event deleted successfully.',
    },
    401: { description: 'Unauthenticated.' },
    403: { description: 'Forbidden: Admin role required.' },
    404: { description: 'Event not found.' },
    409: { description: 'Conflict: Cannot delete event with active measurements or stories.' },
  },
});

// Admin Relations
export const linkEventEquipmentRoute = createRoute({
  method: 'put',
  path: '/{id}/equipment/{equipmentId}',
  summary: 'Link Equipment to Event',
  description: 'Associates equipment with an event.',
  tags: ['Admin Events'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), equipmentId: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: linkEventEquipmentSchema },
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
      description: 'Equipment linked to event.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Event or Equipment not found.' },
  },
});

export const unlinkEventEquipmentRoute = createRoute({
  method: 'delete',
  path: '/{id}/equipment/{equipmentId}',
  summary: 'Unlink Equipment from Event',
  description: 'Removes equipment association from event.',
  tags: ['Admin Events'],
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
      description: 'Equipment unlinked from event.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Association not found.' },
  },
});

export const linkEventLocationRoute = createRoute({
  method: 'put',
  path: '/{id}/locations/{locationId}',
  summary: 'Link Location to Event',
  description: 'Associates a location with an event.',
  tags: ['Admin Events'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), locationId: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: linkEventLocationSchema },
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
      description: 'Location linked to event.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Event or Location not found.' },
  },
});

export const unlinkEventLocationRoute = createRoute({
  method: 'delete',
  path: '/{id}/locations/{locationId}',
  summary: 'Unlink Location from Event',
  description: 'Removes location association from event.',
  tags: ['Admin Events'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), locationId: z.string().uuid() }),
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
      description: 'Location unlinked from event.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Association not found.' },
  },
});

export const linkEventPersonRoute = createRoute({
  method: 'put',
  path: '/{id}/people/{personId}',
  summary: 'Link Person to Event',
  description: 'Associates a person with an event.',
  tags: ['Admin Events'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), personId: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: linkEventPersonSchema },
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
      description: 'Person linked to event.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Event or Person not found.' },
  },
});

export const unlinkEventPersonRoute = createRoute({
  method: 'delete',
  path: '/{id}/people/{personId}',
  summary: 'Unlink Person from Event',
  description: 'Removes person association from event.',
  tags: ['Admin Events'],
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
      description: 'Person unlinked from event.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Association not found.' },
  },
});

export const linkEventSourceRoute = createRoute({
  method: 'put',
  path: '/{id}/sources/{sourceId}',
  summary: 'Link Source to Event',
  description: 'Associates a primary source with an event.',
  tags: ['Admin Events'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), sourceId: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: linkEventSourceSchema },
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
      description: 'Source linked to event.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Event or Source not found.' },
  },
});

export const unlinkEventSourceRoute = createRoute({
  method: 'delete',
  path: '/{id}/sources/{sourceId}',
  summary: 'Unlink Source from Event',
  description: 'Removes source association from event.',
  tags: ['Admin Events'],
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
      description: 'Source unlinked from event.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Association not found.' },
  },
});

export const adminEventsRouter = new OpenAPIHono<AppEnv>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEventsRouter.use('*', authenticate() as any);

// Read
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEventsRouter.openapi(listEventsRoute, eventsController.list as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEventsRouter.openapi(getEventRoute, eventsController.get as any);

// Write (Admin or Editor)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEventsRouter.openapi(createEventRoute, eventsController.create as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEventsRouter.openapi(updateEventRoute, eventsController.update as any);

// Delete (Admin Only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEventsRouter.openapi(deleteEventRoute, eventsController.delete as any);

// Relations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEventsRouter.openapi(linkEventEquipmentRoute, eventsController.linkEquipment as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEventsRouter.openapi(unlinkEventEquipmentRoute, eventsController.unlinkEquipment as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEventsRouter.openapi(linkEventLocationRoute, eventsController.linkLocation as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEventsRouter.openapi(unlinkEventLocationRoute, eventsController.unlinkLocation as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEventsRouter.openapi(linkEventPersonRoute, eventsController.linkPerson as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEventsRouter.openapi(unlinkEventPersonRoute, eventsController.unlinkPerson as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEventsRouter.openapi(linkEventSourceRoute, eventsController.linkSource as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminEventsRouter.openapi(unlinkEventSourceRoute, eventsController.unlinkSource as any);
