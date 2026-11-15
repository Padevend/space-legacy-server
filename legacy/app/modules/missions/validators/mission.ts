import { z } from 'zod';
import { MissionStatus } from '#shared/enums';

export const missionStatusEnum = z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'PARTIALLY_COMPLETED', 'FAILED', 'UNKNOWN']);

export const missionSchema = z.object({
  missionId: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  agency: z.string().nullable(),
  missionStatus: missionStatusEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type MissionDto = z.infer<typeof missionSchema>;

export const missionDetailSchema = missionSchema.extend({
  equipment: z
    .array(
      z.object({
        equipmentId: z.string().uuid(),
        name: z.string().optional(),
        slug: z.string().optional(),
        missionRole: z.string().optional(),
        participationDescription: z.string().nullable().optional(),
        role: z.string().nullable().optional(),
      })
    )
    .optional(),
  sources: z
    .array(
      z.object({
        sourceId: z.string().uuid(),
        title: z.string(),
        url: z.string(),
        claimDescription: z.string().nullable().optional(),
      })
    )
    .optional(),
});

export type MissionDetailDto = z.infer<typeof missionDetailSchema>;

export const listMissionsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  missionStatus: missionStatusEnum.optional(),
  agency: z.string().optional(),
  search: z.string().optional(),
  orderBy: z.enum(['name', 'createdAt', 'updatedAt']).optional().default('name'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type ListMissionsQueryDto = z.infer<typeof listMissionsQuerySchema>;

export const getMissionQuerySchema = z.object({
  include: z.string().optional(),
});

export type GetMissionQueryDto = z.infer<typeof getMissionQuerySchema>;

export const createMissionRequestSchema = z
  .object({
    name: z.string().min(1).max(255),
    slug: z
      .string()
      .min(1)
      .max(255)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lower-case alphanumeric with hyphens'),
    description: z.string().nullable().optional(),
    agency: z.string().max(255).nullable().optional(),
    missionStatus: missionStatusEnum.optional().default('UNKNOWN'),
  })
  .strict();

export type CreateMissionRequestDto = z.infer<typeof createMissionRequestSchema>;

export const updateMissionRequestSchema = createMissionRequestSchema.partial().strict();

export type UpdateMissionRequestDto = z.infer<typeof updateMissionRequestSchema>;

export const linkMissionEquipmentSchema = z
  .object({
    equipmentId: z.string().uuid().optional(),
    role: z.string().max(255).nullable().optional(),
    missionRole: z.string().max(255).optional(),
    participationDescription: z.string().max(2000).nullable().optional(),
  })
  .strict();

export type LinkMissionEquipmentDto = z.infer<typeof linkMissionEquipmentSchema>;
