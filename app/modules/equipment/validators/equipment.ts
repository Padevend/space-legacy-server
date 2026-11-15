import { z } from 'zod';
import { EquipmentType, OperationalStatus, PhysicalStatus } from '#shared/enums';

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

export const operationalStatusEnum = z.enum(['OPERATIONAL', 'INACTIVE', 'MISSION_ENDED', 'FAILED', 'UNKNOWN']);

export const physicalStatusEnum = z.enum([
  'LEFT_ON_SURFACE',
  'IN_ORBIT',
  'RETURNED_TO_EARTH',
  'DESTROYED',
  'LOST',
  'UNKNOWN',
]);

export const equipmentSchema = z.object({
  equipmentId: z.string().uuid(),
  parentEquipmentId: z.string().uuid().nullable(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  equipmentType: equipmentTypeEnum,
  manufacturer: z.string().nullable(),
  operationalStatus: operationalStatusEnum,
  physicalStatus: physicalStatusEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type EquipmentDto = z.infer<typeof equipmentSchema>;

export const equipmentDetailSchema = equipmentSchema.extend({
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
        missionRole: z.string().optional(),
      })
    )
    .optional(),
  locations: z
    .array(
      z.object({
        equipmentLocationId: z.string().uuid().optional(),
        locationId: z.string().uuid().optional(),
        name: z.string().optional(),
        latitude: z.number().nullable().optional(),
        longitude: z.number().nullable().optional(),
        startDate: z.string().nullable().optional(),
        endDate: z.string().nullable().optional(),
      })
    )
    .optional(),
});

export type EquipmentDetailDto = z.infer<typeof equipmentDetailSchema>;

export const listEquipmentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  equipmentType: equipmentTypeEnum.optional(),
  operationalStatus: operationalStatusEnum.optional(),
  physicalStatus: physicalStatusEnum.optional(),
  missionId: z.string().uuid().optional(),
  celestialBodyId: z.string().uuid().optional(),
  parentEquipmentId: z.string().uuid().optional(),
  search: z.string().optional(),
  orderBy: z.enum(['name', 'equipmentType', 'createdAt', 'updatedAt']).optional().default('name'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type ListEquipmentQueryDto = z.infer<typeof listEquipmentQuerySchema>;

export const getEquipmentQuerySchema = z.object({
  include: z.string().optional(),
});

export type GetEquipmentQueryDto = z.infer<typeof getEquipmentQuerySchema>;

export const createEquipmentRequestSchema = z
  .object({
    parentEquipmentId: z.string().uuid().nullable().optional(),
    name: z.string().min(1).max(255),
    slug: z
      .string()
      .min(1)
      .max(255)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lower-case alphanumeric with hyphens'),
    description: z.string().nullable().optional(),
    equipmentType: equipmentTypeEnum,
    manufacturer: z.string().max(255).nullable().optional(),
    operationalStatus: operationalStatusEnum.optional().default('UNKNOWN'),
    physicalStatus: physicalStatusEnum.optional().default('UNKNOWN'),
  })
  .strict();

export type CreateEquipmentRequestDto = z.infer<typeof createEquipmentRequestSchema>;

export const updateEquipmentRequestSchema = createEquipmentRequestSchema.partial().strict();

export type UpdateEquipmentRequestDto = z.infer<typeof updateEquipmentRequestSchema>;
