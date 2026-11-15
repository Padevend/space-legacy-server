import { z } from '@hono/zod-openapi';

export const LocationTypeEnum = z.enum([
  'LAUNCH_SITE',
  'LANDING_SITE',
  'SURFACE_LOCATION',
  'ORBIT',
  'SPACE_REGION',
  'FACILITY',
  'OTHER',
]);

export type LocationType = z.infer<typeof LocationTypeEnum>;

export const datePrecisionEnum = z.enum([
  'EXACT',
  'ESTIMATED',
  'YEAR_ONLY',
  'MONTH_ONLY',
  'UNKNOWN',
]);

export type DatePrecisionDto = z.infer<typeof datePrecisionEnum>;

export const locationSchema = z
  .object({
    locationId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    celestialBodyId: z.string().uuid().nullable().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' }),
    name: z.string().openapi({ example: 'Mare Tranquillitatis' }),
    locationType: LocationTypeEnum.openapi({ example: 'LANDING_SITE' }),
    latitude: z.number().nullable().openapi({ example: 0.67408 }),
    longitude: z.number().nullable().openapi({ example: 23.47297 }),
    altitude: z.number().nullable().openapi({ example: -2.573 }),
    referenceSystem: z.string().nullable().openapi({ example: 'IAU2000' }),
    description: z.string().nullable().openapi({ example: 'Apollo 11 landing site on the Moon.' }),
  })
  .openapi('Location');

export type LocationDto = z.infer<typeof locationSchema>;

export const listLocationsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
    pageSize: z.coerce.number().int().min(1).max(100).default(20).openapi({ example: 20 }),
    search: z.string().optional().openapi({ example: 'Tranquillitatis' }),
    celestialBodyId: z.string().uuid().optional().openapi({ example: '123e4567-e89b-12d3-a456-426614174001' }),
    locationType: LocationTypeEnum.optional().openapi({ example: 'LANDING_SITE' }),
    sort: z.enum(['name', 'locationType']).default('name').openapi({ example: 'name' }),
    order: z.enum(['asc', 'desc']).default('asc').openapi({ example: 'asc' }),
  })
  .openapi('ListLocationsQuery');

export type ListLocationsQueryDto = z.infer<typeof listLocationsQuerySchema>;

export const createLocationRequestSchema = z
  .object({
    celestialBodyId: z
      .string()
      .uuid()
      .nullable()
      .optional()
      .openapi({ example: '123e4567-e89b-12d3-a456-426614174001' }),
    name: z.string().min(1, 'Name is required.').max(150).openapi({ example: 'Mare Tranquillitatis' }),
    locationType: LocationTypeEnum.openapi({ example: 'LANDING_SITE' }),
    latitude: z.number().min(-90).max(90).nullable().optional().openapi({ example: 0.67408 }),
    longitude: z.number().min(-180).max(180).nullable().optional().openapi({ example: 23.47297 }),
    altitude: z.number().nullable().optional().openapi({ example: -2.573 }),
    referenceSystem: z.string().max(100).nullable().optional().openapi({ example: 'IAU2000' }),
    description: z.string().max(2000).nullable().optional().openapi({ example: 'Apollo 11 landing site.' }),
  })
  .strict()
  .openapi('CreateLocationRequest');

export type CreateLocationRequestDto = z.infer<typeof createLocationRequestSchema>;

export const updateLocationRequestSchema = z
  .object({
    celestialBodyId: z
      .string()
      .uuid()
      .nullable()
      .optional()
      .openapi({ example: '123e4567-e89b-12d3-a456-426614174001' }),
    name: z.string().min(1).max(150).optional().openapi({ example: 'Mare Tranquillitatis Updated' }),
    locationType: LocationTypeEnum.optional().openapi({ example: 'LANDING_SITE' }),
    latitude: z.number().min(-90).max(90).nullable().optional().openapi({ example: 0.67408 }),
    longitude: z.number().min(-180).max(180).nullable().optional().openapi({ example: 23.47297 }),
    altitude: z.number().nullable().optional().openapi({ example: -2.573 }),
    referenceSystem: z.string().max(100).nullable().optional().openapi({ example: 'IAU2000' }),
    description: z.string().max(2000).nullable().optional().openapi({ example: 'Updated description.' }),
  })
  .strict()
  .openapi('UpdateLocationRequest');

export type UpdateLocationRequestDto = z.infer<typeof updateLocationRequestSchema>;

export const locationIdParamSchema = z
  .object({
    id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  })
  .openapi('LocationIdParam');

export type LocationIdParamDto = z.infer<typeof locationIdParamSchema>;
