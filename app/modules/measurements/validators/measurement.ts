import { z } from 'zod';
import { MeasurementType } from '#shared/enums';

export const measurementTypeEnum = z.enum([
  'MASS',
  'DISTANCE',
  'DURATION',
  'TEMPERATURE',
  'FREQUENCY',
  'SPEED',
  'FORCE',
  'PRESSURE',
  'POWER',
  'VOLTAGE',
  'OTHER',
]);

export const measurementSchema = z.object({
  measurementId: z.string().uuid(),
  equipmentId: z.string().uuid().nullable(),
  eventId: z.string().uuid().nullable(),
  name: z.string(),
  value: z.string(),
  unit: z.string(),
  measurementType: measurementTypeEnum,
  context: z.string(),
  measurementDate: z.string().datetime().nullable(),
  isApproximate: z.boolean(),
  uncertainty: z.string().nullable(),
});

export type MeasurementDto = z.infer<typeof measurementSchema>;

export const measurementDetailSchema = measurementSchema.extend({
  equipment: z
    .object({
      equipmentId: z.string().uuid(),
      name: z.string(),
      slug: z.string(),
    })
    .nullable()
    .optional(),
  event: z
    .object({
      eventId: z.string().uuid(),
      title: z.string(),
    })
    .nullable()
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

export type MeasurementDetailDto = z.infer<typeof measurementDetailSchema>;

export const listMeasurementsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  equipmentId: z.string().uuid().optional(),
  eventId: z.string().uuid().optional(),
  measurementType: measurementTypeEnum.optional(),
  search: z.string().optional(),
  orderBy: z.enum(['name', 'measurementType', 'measurementDate']).optional().default('name'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type ListMeasurementsQueryDto = z.infer<typeof listMeasurementsQuerySchema>;

export const getMeasurementQuerySchema = z.object({
  include: z.string().optional(),
});

export type GetMeasurementQueryDto = z.infer<typeof getMeasurementQuerySchema>;

export const createMeasurementRequestSchema = z
  .object({
    equipmentId: z.string().uuid().nullable().optional(),
    eventId: z.string().uuid().nullable().optional(),
    name: z.string().min(1).max(255),
    value: z.string().regex(/^-?\d+(?:\.\d+)?$/, 'value must be a valid numeric string'),
    unit: z.string().min(1).max(50),
    measurementType: measurementTypeEnum,
    context: z.string().min(1),
    measurementDate: z.string().datetime().nullable().optional(),
    isApproximate: z.boolean().optional().default(false),
    uncertainty: z
      .string()
      .regex(/^-?\d+(?:\.\d+)?$/, 'uncertainty must be a valid numeric string')
      .nullable()
      .optional(),
  })
  .strict();

export type CreateMeasurementRequestDto = z.infer<typeof createMeasurementRequestSchema>;

export const updateMeasurementRequestSchema = createMeasurementRequestSchema.partial().strict();

export type UpdateMeasurementRequestDto = z.infer<typeof updateMeasurementRequestSchema>;
