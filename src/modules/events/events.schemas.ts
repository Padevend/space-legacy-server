import { z } from '@hono/zod-openapi';
import { paginationQuerySchema } from '../../core/http/pagination.js';
import { datePrecisionEnum } from '../locations/locations.schemas.js';

export const eventTypeEnum = z.enum([
  'LAUNCH',
  'LANDING',
  'FLYBY',
  'ORBIT_INSERTION',
  'DEPLOYMENT',
  'ACTIVATION',
  'SCIENTIFIC_DISCOVERY',
  'COMMUNICATION',
  'LAST_SIGNAL',
  'MISSION_END',
  'OTHER',
]);
export type EventTypeDto = z.infer<typeof eventTypeEnum>;

export const eventSchema = z
  .object({
    eventId: z.string().uuid().openapi({ example: 'c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f' }),
    missionId: z.string().uuid().openapi({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' }),
    title: z.string().openapi({ example: 'Apollo 11 Lunar Landing' }),
    description: z.string().nullable().openapi({ example: 'LM Eagle touches down at Mare Tranquillitatis.' }),
    eventType: eventTypeEnum.openapi({ example: 'LANDING' }),
    eventDate: z.string().nullable().openapi({ example: '1969-07-20' }),
    eventTime: z.string().nullable().openapi({ example: '20:17:40' }),
    timeStandard: z.string().nullable().openapi({ example: 'UTC' }),
    datePrecision: datePrecisionEnum.openapi({ example: 'EXACT' }),
    isEstimated: z.boolean().openapi({ example: false }),
    sequenceOrder: z.number().int().openapi({ example: 4 }),
    createdAt: z.string().datetime().openapi({ example: '2026-11-15T00:00:00.000Z' }),
  })
  .openapi('Event');

export type EventDto = z.infer<typeof eventSchema>;

export const eventDetailSchema = eventSchema
  .extend({
    mission: z
      .object({
        missionId: z.string().uuid(),
        name: z.string(),
        slug: z.string(),
      })
      .optional(),
    equipment: z
      .array(
        z.object({
          equipmentId: z.string().uuid(),
          name: z.string(),
          slug: z.string(),
          roleInEvent: z.string().nullable(),
          description: z.string().nullable(),
        })
      )
      .optional(),
    locations: z
      .array(
        z.object({
          locationId: z.string().uuid(),
          name: z.string(),
          locationRole: z.string().nullable(),
        })
      )
      .optional(),
    people: z
      .array(
        z.object({
          personId: z.string().uuid(),
          fullName: z.string(),
          roleInEvent: z.string().nullable(),
        })
      )
      .optional(),
    sources: z
      .array(
        z.object({
          sourceId: z.string().uuid(),
          title: z.string(),
          url: z.string(),
          claimDescription: z.string().nullable(),
        })
      )
      .optional(),
  })
  .openapi('EventDetail');

export type EventDetailDto = z.infer<typeof eventDetailSchema>;

export const listEventsQuerySchema = paginationQuerySchema
  .extend({
    missionId: z.string().uuid().optional().openapi({ description: 'Filter by mission UUID' }),
    equipmentId: z.string().uuid().optional().openapi({ description: 'Filter by equipment UUID' }),
    eventType: eventTypeEnum.optional().openapi({ description: 'Filter by event type' }),
    from: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'from must be YYYY-MM-DD')
      .optional(),
    to: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'to must be YYYY-MM-DD')
      .optional(),
    search: z.string().optional().openapi({ description: 'Search title and description' }),
    orderBy: z.enum(['eventDate', 'sequenceOrder', 'title', 'createdAt']).optional().default('eventDate'),
    order: z.enum(['asc', 'desc']).optional().default('asc'),
  })
  .strict()
  .openapi('ListEventsQuery');

export type ListEventsQueryDto = z.infer<typeof listEventsQuerySchema>;

export const eventIdParamSchema = z
  .object({
    id: z.string().uuid().openapi({ example: 'c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f' }),
  })
  .openapi('EventIdParam');

export const getEventQuerySchema = z
  .object({
    include: z.string().optional().openapi({
      description: 'Comma-separated relations (max 3): mission,equipment,locations,people,sources',
      example: 'equipment,locations',
    }),
  })
  .strict()
  .openapi('GetEventQuery');

export type GetEventQueryDto = z.infer<typeof getEventQuerySchema>;

export const createEventRequestSchema = z
  .object({
    missionId: z.string().uuid().openapi({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' }),
    title: z.string().min(1).max(255).openapi({ example: 'Lunar Landing' }),
    description: z.string().nullable().optional().openapi({ example: 'Touchdown at Mare Tranquillitatis' }),
    eventType: eventTypeEnum.openapi({ example: 'LANDING' }),
    eventDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'eventDate must be YYYY-MM-DD')
      .nullable()
      .optional()
      .openapi({ example: '1969-07-20' }),
    eventTime: z
      .string()
      .regex(/^\d{2}:\d{2}:\d{2}$/, 'eventTime must be HH:mm:ss')
      .nullable()
      .optional()
      .openapi({ example: '20:17:40' }),
    timeStandard: z.string().max(50).nullable().optional().openapi({ example: 'UTC' }),
    datePrecision: datePrecisionEnum.optional().default('UNKNOWN'),
    isEstimated: z.boolean().optional().default(false),
    sequenceOrder: z.number().int().optional().default(0),
  })
  .strict()
  .openapi('CreateEventRequest');

export type CreateEventRequestDto = z.infer<typeof createEventRequestSchema>;

export const updateEventRequestSchema = createEventRequestSchema.partial().strict().openapi('UpdateEventRequest');

export type UpdateEventRequestDto = z.infer<typeof updateEventRequestSchema>;

// Relations
export const linkEventEquipmentSchema = z
  .object({
    roleInEvent: z.string().max(255).nullable().optional().openapi({ example: 'Lander' }),
    description: z.string().max(2000).nullable().optional(),
  })
  .strict()
  .openapi('LinkEventEquipmentRequest');

export type LinkEventEquipmentRequestDto = z.infer<typeof linkEventEquipmentSchema>;

export const linkEventLocationSchema = z
  .object({
    locationRole: z.string().max(255).nullable().optional().openapi({ example: 'Landing site' }),
  })
  .strict()
  .openapi('LinkEventLocationRequest');

export type LinkEventLocationRequestDto = z.infer<typeof linkEventLocationSchema>;

export const linkEventPersonSchema = z
  .object({
    roleInEvent: z.string().max(255).nullable().optional().openapi({ example: 'Commander' }),
  })
  .strict()
  .openapi('LinkEventPersonRequest');

export type LinkEventPersonRequestDto = z.infer<typeof linkEventPersonSchema>;

export const linkEventSourceSchema = z
  .object({
    claimDescription: z.string().max(2000).nullable().optional().openapi({ example: 'Flight journal' }),
  })
  .strict()
  .openapi('LinkEventSourceRequest');

export type LinkEventSourceRequestDto = z.infer<typeof linkEventSourceSchema>;
