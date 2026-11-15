import { z } from '@hono/zod-openapi';
import { paginationQuerySchema } from '../../core/http/pagination.js';
import { datePrecisionEnum } from '../locations/locations.schemas.js';

export const equipmentTypeEnum = z.enum([
  'SPACECRAFT',
  'LANDER',
  'ROVER',
  'ORBITER',
  'MODULE',
  'STAGE',
  'SCIENTIFIC_INSTRUMENT',
  'COMPONENT',
  'ARTIFACT',
  'OTHER',
]);
export type EquipmentTypeDto = z.infer<typeof equipmentTypeEnum>;

export const operationalStatusEnum = z.enum(['OPERATIONAL', 'INACTIVE', 'MISSION_ENDED', 'FAILED', 'UNKNOWN']);
export type OperationalStatusDto = z.infer<typeof operationalStatusEnum>;

export const physicalStatusEnum = z.enum([
  'LEFT_ON_SURFACE',
  'IN_ORBIT',
  'RETURNED_TO_EARTH',
  'DESTROYED',
  'LOST',
  'UNKNOWN',
]);
export type PhysicalStatusDto = z.infer<typeof physicalStatusEnum>;

export const equipmentSchema = z
  .object({
    equipmentId: z.string().uuid().openapi({ example: 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e' }),
    parentEquipmentId: z.string().uuid().nullable().openapi({ example: null }),
    name: z.string().openapi({ example: 'Lunar Roving Vehicle (LRV-3)' }),
    slug: z.string().openapi({ example: 'lrv-3-apollo-17' }),
    description: z.string().nullable().openapi({ example: 'Electric rover used during Apollo 17.' }),
    equipmentType: equipmentTypeEnum.openapi({ example: 'ROVER' }),
    manufacturer: z.string().nullable().openapi({ example: 'Boeing' }),
    operationalStatus: operationalStatusEnum.openapi({ example: 'INACTIVE' }),
    physicalStatus: physicalStatusEnum.openapi({ example: 'LEFT_ON_SURFACE' }),
    createdAt: z.string().datetime().openapi({ example: '2026-11-15T00:00:00.000Z' }),
    updatedAt: z.string().datetime().openapi({ example: '2026-11-15T00:00:00.000Z' }),
  })
  .openapi('Equipment');

export type EquipmentDto = z.infer<typeof equipmentSchema>;

export const equipmentDetailSchema = equipmentSchema
  .extend({
    parent: z
      .object({
        equipmentId: z.string().uuid(),
        name: z.string(),
        slug: z.string(),
      })
      .nullable()
      .optional(),
    children: z
      .array(
        z.object({
          equipmentId: z.string().uuid(),
          name: z.string(),
          slug: z.string(),
          equipmentType: equipmentTypeEnum,
        })
      )
      .optional(),
    missions: z
      .array(
        z.object({
          missionId: z.string().uuid(),
          name: z.string(),
          slug: z.string(),
          missionRole: z.string(),
        })
      )
      .optional(),
    locations: z
      .array(
        z.object({
          equipmentLocationId: z.string().uuid(),
          locationId: z.string().uuid(),
          name: z.string(),
          latitude: z.number().nullable(),
          longitude: z.number().nullable(),
          startDate: z.string().nullable(),
          endDate: z.string().nullable(),
        })
      )
      .optional(),
  })
  .openapi('EquipmentDetail');

export type EquipmentDetailDto = z.infer<typeof equipmentDetailSchema>;

export const listEquipmentQuerySchema = paginationQuerySchema
  .extend({
    equipmentType: equipmentTypeEnum.optional().openapi({ description: 'Filter by equipment type' }),
    operationalStatus: operationalStatusEnum.optional().openapi({ description: 'Filter by operational status' }),
    physicalStatus: physicalStatusEnum.optional().openapi({ description: 'Filter by physical status' }),
    missionId: z.string().uuid().optional().openapi({ description: 'Filter by linked mission UUID' }),
    celestialBodyId: z.string().uuid().optional().openapi({ description: 'Filter by celestial body UUID' }),
    parentEquipmentId: z.string().uuid().optional().openapi({ description: 'Filter by parent equipment UUID' }),
    search: z.string().optional().openapi({ description: 'Search term for name or manufacturer' }),
    orderBy: z.enum(['name', 'equipmentType', 'createdAt', 'updatedAt']).optional().default('name'),
    order: z.enum(['asc', 'desc']).optional().default('asc'),
  })
  .strict()
  .openapi('ListEquipmentQuery');

export type ListEquipmentQueryDto = z.infer<typeof listEquipmentQuerySchema>;

export const equipmentIdOrSlugParamSchema = z
  .object({
    idOrSlug: z.string().min(1).openapi({ example: 'lrv-3-apollo-17', description: 'UUID or unique slug' }),
  })
  .openapi('EquipmentIdOrSlugParam');

export const equipmentIdParamSchema = z
  .object({
    id: z.string().uuid().openapi({ example: 'b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e' }),
  })
  .openapi('EquipmentIdParam');

export const getEquipmentQuerySchema = z
  .object({
    include: z.string().optional().openapi({
      description: 'Comma-separated relations to include (max 3): parent,children,missions,locations',
      example: 'parent,children',
    }),
  })
  .strict()
  .openapi('GetEquipmentQuery');

export type GetEquipmentQueryDto = z.infer<typeof getEquipmentQuerySchema>;

export const createEquipmentRequestSchema = z
  .object({
    parentEquipmentId: z.string().uuid().nullable().optional().openapi({ example: null }),
    name: z.string().min(1).max(255).openapi({ example: 'Lunar Roving Vehicle (LRV-3)' }),
    slug: z
      .string()
      .min(1)
      .max(255)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lower-case alphanumeric with hyphens')
      .openapi({ example: 'lrv-3-apollo-17' }),
    description: z.string().nullable().optional().openapi({ example: 'Electric rover used during Apollo 17.' }),
    equipmentType: equipmentTypeEnum.openapi({ example: 'ROVER' }),
    manufacturer: z.string().max(255).nullable().optional().openapi({ example: 'Boeing' }),
    operationalStatus: operationalStatusEnum.optional().default('UNKNOWN'),
    physicalStatus: physicalStatusEnum.optional().default('UNKNOWN'),
  })
  .strict()
  .openapi('CreateEquipmentRequest');

export type CreateEquipmentRequestDto = z.infer<typeof createEquipmentRequestSchema>;

export const updateEquipmentRequestSchema = createEquipmentRequestSchema
  .partial()
  .strict()
  .openapi('UpdateEquipmentRequest');

export type UpdateEquipmentRequestDto = z.infer<typeof updateEquipmentRequestSchema>;

// Relations
export const linkEquipmentLocationSchema = z
  .object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate must be YYYY-MM-DD')
      .nullable()
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'endDate must be YYYY-MM-DD')
      .nullable()
      .optional(),
    locationPrecision: datePrecisionEnum.optional().default('UNKNOWN'),
  })
  .strict()
  .openapi('LinkEquipmentLocationRequest');

export type LinkEquipmentLocationRequestDto = z.infer<typeof linkEquipmentLocationSchema>;

export const linkEquipmentPersonSchema = z
  .object({
    roleInEquipment: z.string().min(1).max(255).openapi({ example: 'Lead Engineer' }),
  })
  .strict()
  .openapi('LinkEquipmentPersonRequest');

export type LinkEquipmentPersonRequestDto = z.infer<typeof linkEquipmentPersonSchema>;

export const linkEquipmentSourceSchema = z
  .object({
    claimDescription: z.string().max(2000).nullable().optional().openapi({ example: 'Specifications document' }),
  })
  .strict()
  .openapi('LinkEquipmentSourceRequest');

export type LinkEquipmentSourceRequestDto = z.infer<typeof linkEquipmentSourceSchema>;
