import { z } from 'zod';
import { LocationType, DatePrecision } from '#shared/enums';

export const LocationTypeEnum = z.enum([
  'LAUNCH_SITE',
  'LANDING_SITE',
  'SURFACE_LOCATION',
  'ORBIT',
  'SPACE_REGION',
  'FACILITY',
  'OTHER',
]);

export const DatePrecisionEnum = z.enum(['EXACT', 'ESTIMATED', 'YEAR_ONLY', 'MONTH_ONLY', 'UNKNOWN']);

export const locationSchema = z.object({
  locationId: z.string().uuid(),
  celestialBodyId: z.string().uuid().nullable(),
  name: z.string(),
  locationType: LocationTypeEnum,
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  altitude: z.number().nullable(),
  referenceSystem: z.string().nullable(),
  description: z.string().nullable(),
});

export type LocationDto = z.infer<typeof locationSchema>;

export const listLocationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  celestialBodyId: z.string().uuid().optional(),
  locationType: LocationTypeEnum.optional(),
  sort: z.enum(['name', 'locationType']).default('name'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export type ListLocationsQueryDto = z.infer<typeof listLocationsQuerySchema>;

export const createLocationRequestSchema = z
  .object({
    celestialBodyId: z.string().uuid().nullable().optional(),
    name: z.string().min(1, 'Name is required.').max(150),
    locationType: LocationTypeEnum,
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
    altitude: z.number().nullable().optional(),
    referenceSystem: z.string().max(100).nullable().optional(),
    description: z.string().max(2000).nullable().optional(),
  })
  .strict();

export type CreateLocationRequestDto = z.infer<typeof createLocationRequestSchema>;

export const updateLocationRequestSchema = z
  .object({
    celestialBodyId: z.string().uuid().nullable().optional(),
    name: z.string().min(1).max(150).optional(),
    locationType: LocationTypeEnum.optional(),
    latitude: z.number().min(-90).max(90).nullable().optional(),
    longitude: z.number().min(-180).max(180).nullable().optional(),
    altitude: z.number().nullable().optional(),
    referenceSystem: z.string().max(100).nullable().optional(),
    description: z.string().max(2000).nullable().optional(),
  })
  .strict();

export type UpdateLocationRequestDto = z.infer<typeof updateLocationRequestSchema>;

export const linkEquipmentLocationSchema = z
  .object({
    locationId: z.string().uuid().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    locationPrecision: DatePrecisionEnum.optional().default('UNKNOWN'),
    dateArrival: z.string().nullable().optional(),
    datePrecisionArrival: DatePrecisionEnum.nullable().optional(),
    dateDeparture: z.string().nullable().optional(),
    datePrecisionDeparture: DatePrecisionEnum.nullable().optional(),
  })
  .strict();

export type LinkEquipmentLocationDto = z.infer<typeof linkEquipmentLocationSchema>;
