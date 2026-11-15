import { z } from 'zod';
import { EventType, DatePrecision } from '#shared/enums';

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

export const datePrecisionEnum = z.enum(['EXACT', 'ESTIMATED', 'YEAR_ONLY', 'MONTH_ONLY', 'UNKNOWN']);

export const eventSchema = z.object({
  eventId: z.string().uuid(),
  missionId: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  eventType: eventTypeEnum,
  eventDate: z.string().nullable(),
  eventTime: z.string().nullable(),
  timeStandard: z.string().nullable(),
  datePrecision: datePrecisionEnum,
  isEstimated: z.boolean(),
  sequenceOrder: z.number().int(),
  createdAt: z.string().datetime(),
});

export type EventDto = z.infer<typeof eventSchema>;

export const eventDetailSchema = eventSchema.extend({
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
        name: z.string().optional(),
        slug: z.string().optional(),
        roleInEvent: z.string().nullable(),
        description: z.string().nullable().optional(),
      })
    )
    .optional(),
  locations: z
    .array(
      z.object({
        locationId: z.string().uuid(),
        name: z.string().optional(),
        locationRole: z.string().nullable(),
      })
    )
    .optional(),
  sources: z
    .array(
      z.object({
        sourceId: z.string().uuid(),
        title: z.string().optional(),
        url: z.string().optional(),
        claimDescription: z.string().nullable().optional(),
      })
    )
    .optional(),
});

export type EventDetailDto = z.infer<typeof eventDetailSchema>;

export const listEventsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  missionId: z.string().uuid().optional(),
  equipmentId: z.string().uuid().optional(),
  eventType: eventTypeEnum.optional(),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'from must be YYYY-MM-DD')
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'to must be YYYY-MM-DD')
    .optional(),
  search: z.string().optional(),
  orderBy: z.enum(['eventDate', 'sequenceOrder', 'title', 'createdAt']).optional().default('eventDate'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type ListEventsQueryDto = z.infer<typeof listEventsQuerySchema>;

export const getEventQuerySchema = z.object({
  include: z.string().optional(),
});

export type GetEventQueryDto = z.infer<typeof getEventQuerySchema>;

export const createEventRequestSchema = z
  .object({
    missionId: z.string().uuid(),
    title: z.string().min(1).max(255),
    description: z.string().nullable().optional(),
    eventType: eventTypeEnum,
    eventDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'eventDate must be YYYY-MM-DD')
      .nullable()
      .optional(),
    eventTime: z
      .string()
      .regex(/^\d{2}:\d{2}:\d{2}$/, 'eventTime must be HH:mm:ss')
      .nullable()
      .optional(),
    timeStandard: z.string().max(50).nullable().optional(),
    datePrecision: datePrecisionEnum.optional().default('UNKNOWN'),
    isEstimated: z.boolean().optional().default(false),
    sequenceOrder: z.number().int().optional().default(0),
  })
  .strict();

export type CreateEventRequestDto = z.infer<typeof createEventRequestSchema>;

export const updateEventRequestSchema = createEventRequestSchema.partial().strict();

export type UpdateEventRequestDto = z.infer<typeof updateEventRequestSchema>;

export const linkEventEquipmentSchema = z
  .object({
    roleInEvent: z.string().max(255).nullable().optional(),
    description: z.string().max(2000).nullable().optional(),
  })
  .strict();

export type LinkEventEquipmentRequestDto = z.infer<typeof linkEventEquipmentSchema>;

export const linkEventLocationSchema = z
  .object({
    locationRole: z.string().max(255).nullable().optional(),
  })
  .strict();

export type LinkEventLocationRequestDto = z.infer<typeof linkEventLocationSchema>;
