import { z } from '@hono/zod-openapi';
import { paginationQuerySchema } from '../../core/http/pagination.js';

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
export type MeasurementTypeDto = z.infer<typeof measurementTypeEnum>;

export const measurementSchema = z
  .object({
    measurementId: z.string().uuid().openapi({ example: 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a' }),
    equipmentId: z.string().uuid().nullable().openapi({ example: 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e' }),
    eventId: z.string().uuid().nullable().openapi({ example: null }),
    name: z.string().openapi({ example: 'Rover Total Mass' }),
    value: z.string().openapi({ example: '210.00000000', description: 'Exact decimal string to prevent precision loss' }),
    unit: z.string().openapi({ example: 'kg' }),
    measurementType: measurementTypeEnum.openapi({ example: 'MASS' }),
    context: z.string().openapi({ example: 'Earth weight at launch including battery systems.' }),
    measurementDate: z.string().datetime().nullable().openapi({ example: '1972-12-07T05:33:00.000Z' }),
    isApproximate: z.boolean().openapi({ example: false }),
    uncertainty: z.string().nullable().openapi({ example: '0.50000000' }),
  })
  .openapi('Measurement');

export type MeasurementDto = z.infer<typeof measurementSchema>;

export const measurementDetailSchema = measurementSchema
  .extend({
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
          title: z.string(),
          url: z.string(),
          claimDescription: z.string().nullable(),
        })
      )
      .optional(),
  })
  .openapi('MeasurementDetail');

export type MeasurementDetailDto = z.infer<typeof measurementDetailSchema>;

export const listMeasurementsQuerySchema = paginationQuerySchema
  .extend({
    equipmentId: z.string().uuid().optional().openapi({ description: 'Filter by equipment UUID' }),
    eventId: z.string().uuid().optional().openapi({ description: 'Filter by event UUID' }),
    measurementType: measurementTypeEnum.optional().openapi({ description: 'Filter by measurement type' }),
    search: z.string().optional().openapi({ description: 'Search term for measurement name or context' }),
    orderBy: z.enum(['name', 'measurementType', 'measurementDate']).optional().default('name'),
    order: z.enum(['asc', 'desc']).optional().default('asc'),
  })
  .strict()
  .openapi('ListMeasurementsQuery');

export type ListMeasurementsQueryDto = z.infer<typeof listMeasurementsQuerySchema>;

export const measurementIdParamSchema = z
  .object({
    id: z.string().uuid().openapi({ example: 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a' }),
  })
  .openapi('MeasurementIdParam');

export const getMeasurementQuerySchema = z
  .object({
    include: z
      .string()
      .optional()
      .openapi({
        description: 'Comma-separated relations (max 3): equipment,event,sources',
        example: 'equipment,sources',
      }),
  })
  .strict()
  .openapi('GetMeasurementQuery');

export type GetMeasurementQueryDto = z.infer<typeof getMeasurementQuerySchema>;

export const createMeasurementRequestSchema = z
  .object({
    equipmentId: z.string().uuid().nullable().optional(),
    eventId: z.string().uuid().nullable().optional(),
    name: z.string().min(1).max(255).openapi({ example: 'Rover Total Mass' }),
    value: z
      .string()
      .regex(/^-?\d+(?:\.\d+)?$/, 'value must be a valid numeric string')
      .openapi({ example: '210.00000000' }),
    unit: z.string().min(1).max(50).openapi({ example: 'kg' }),
    measurementType: measurementTypeEnum.openapi({ example: 'MASS' }),
    context: z.string().min(1).openapi({ example: 'Earth weight at launch' }),
    measurementDate: z.string().datetime().nullable().optional(),
    isApproximate: z.boolean().optional().default(false),
    uncertainty: z
      .string()
      .regex(/^-?\d+(?:\.\d+)?$/, 'uncertainty must be a valid numeric string')
      .nullable()
      .optional(),
  })
  .strict()
  .openapi('CreateMeasurementRequest');

export type CreateMeasurementRequestDto = z.infer<typeof createMeasurementRequestSchema>;

export const updateMeasurementRequestSchema = createMeasurementRequestSchema
  .partial()
  .strict()
  .openapi('UpdateMeasurementRequest');

export type UpdateMeasurementRequestDto = z.infer<typeof updateMeasurementRequestSchema>;

export const linkMeasurementSourceSchema = z
  .object({
    claimDescription: z.string().max(2000).nullable().optional().openapi({ example: 'NASA SP-4029 Table 3-1' }),
  })
  .strict()
  .openapi('LinkMeasurementSourceRequest');

export type LinkMeasurementSourceRequestDto = z.infer<typeof linkMeasurementSourceSchema>;
