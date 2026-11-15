import { z } from '@hono/zod-openapi';
import { paginationQuerySchema } from '../../core/http/pagination.js';
export const missionStatusEnum = z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'PARTIALLY_COMPLETED', 'FAILED', 'UNKNOWN']);
export const missionSchema = z
    .object({
    missionId: z.string().uuid().openapi({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' }),
    name: z.string().openapi({ example: 'Apollo 11' }),
    slug: z.string().openapi({ example: 'apollo-11' }),
    description: z.string().nullable().openapi({ example: 'First manned landing on the Moon.' }),
    agency: z.string().nullable().openapi({ example: 'NASA' }),
    missionStatus: missionStatusEnum.openapi({ example: 'COMPLETED' }),
    createdAt: z.string().datetime().openapi({ example: '2026-11-15T00:00:00.000Z' }),
    updatedAt: z.string().datetime().openapi({ example: '2026-11-15T00:00:00.000Z' }),
})
    .openapi('Mission');
// Detailed Mission with optional relations
export const missionDetailSchema = missionSchema
    .extend({
    equipment: z
        .array(z.object({
        equipmentId: z.string().uuid(),
        name: z.string(),
        slug: z.string(),
        missionRole: z.string(),
        participationDescription: z.string().nullable(),
    }))
        .optional(),
    people: z
        .array(z.object({
        personId: z.string().uuid(),
        fullName: z.string(),
        roleInMission: z.string(),
    }))
        .optional(),
    sources: z
        .array(z.object({
        sourceId: z.string().uuid(),
        title: z.string(),
        url: z.string(),
        claimDescription: z.string().nullable(),
    }))
        .optional(),
})
    .openapi('MissionDetail');
export const listMissionsQuerySchema = paginationQuerySchema
    .extend({
    missionStatus: missionStatusEnum.optional().openapi({ description: 'Filter by mission status' }),
    agency: z.string().optional().openapi({ description: 'Filter by agency name' }),
    search: z.string().optional().openapi({ description: 'Search term for mission name or description' }),
    orderBy: z.enum(['name', 'createdAt', 'updatedAt']).optional().default('name'),
    order: z.enum(['asc', 'desc']).optional().default('asc'),
})
    .strict()
    .openapi('ListMissionsQuery');
export const missionIdOrSlugParamSchema = z
    .object({
    idOrSlug: z.string().min(1).openapi({ example: 'apollo-11', description: 'UUID or unique slug' }),
})
    .openapi('MissionIdOrSlugParam');
export const missionIdParamSchema = z
    .object({
    id: z.string().uuid().openapi({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' }),
})
    .openapi('MissionIdParam');
export const getMissionQuerySchema = z
    .object({
    include: z.string().optional().openapi({
        description: 'Comma-separated relations to include (max 3): equipment,people,sources',
        example: 'equipment,people',
    }),
})
    .strict()
    .openapi('GetMissionQuery');
export const createMissionRequestSchema = z
    .object({
    name: z.string().min(1).max(255).openapi({ example: 'Apollo 11' }),
    slug: z
        .string()
        .min(1)
        .max(255)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lower-case alphanumeric with hyphens')
        .openapi({ example: 'apollo-11' }),
    description: z.string().nullable().optional().openapi({ example: 'First manned landing on the Moon.' }),
    agency: z.string().max(255).nullable().optional().openapi({ example: 'NASA' }),
    missionStatus: missionStatusEnum.optional().default('UNKNOWN').openapi({ example: 'COMPLETED' }),
})
    .strict()
    .openapi('CreateMissionRequest');
export const updateMissionRequestSchema = createMissionRequestSchema.partial().strict().openapi('UpdateMissionRequest');
// Relation schemas
export const linkMissionPersonSchema = z
    .object({
    roleInMission: z.string().min(1).max(255).openapi({ example: 'Commander' }),
})
    .strict()
    .openapi('LinkMissionPersonRequest');
export const linkMissionSourceSchema = z
    .object({
    claimDescription: z.string().max(2000).nullable().optional().openapi({ example: 'Official mission report' }),
})
    .strict()
    .openapi('LinkMissionSourceRequest');
export const linkMissionEquipmentSchema = z
    .object({
    missionRole: z.string().min(1).max(255).openapi({ example: 'Lunar Module' }),
    participationDescription: z
        .string()
        .max(2000)
        .nullable()
        .optional()
        .openapi({ example: 'Landed on the Sea of Tranquility' }),
})
    .strict()
    .openapi('LinkMissionEquipmentRequest');
