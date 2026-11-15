import { z } from '@hono/zod-openapi';
export const CelestialBodyTypeEnum = z.enum(['STAR', 'PLANET', 'MOON', 'ASTEROID', 'DWARF_PLANET', 'COMET', 'OTHER']);
export const celestialBodySchema = z
    .object({
    celestialBodyId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    name: z.string().openapi({ example: 'Moon' }),
    bodyType: CelestialBodyTypeEnum.openapi({ example: 'MOON' }),
    description: z.string().nullable().openapi({ example: 'Earth natural satellite.' }),
})
    .openapi('CelestialBody');
export const listCelestialBodiesQuerySchema = z
    .object({
    page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
    pageSize: z.coerce.number().int().min(1).max(100).default(20).openapi({ example: 20 }),
    search: z.string().optional().openapi({ example: 'Moon' }),
    bodyType: CelestialBodyTypeEnum.optional().openapi({ example: 'MOON' }),
    sort: z.enum(['name', 'bodyType']).default('name').openapi({ example: 'name' }),
    order: z.enum(['asc', 'desc']).default('asc').openapi({ example: 'asc' }),
})
    .openapi('ListCelestialBodiesQuery');
export const createCelestialBodyRequestSchema = z
    .object({
    name: z.string().min(1, 'Name is required.').max(100).openapi({ example: 'Mars' }),
    bodyType: CelestialBodyTypeEnum.openapi({ example: 'PLANET' }),
    description: z.string().max(2000).optional().openapi({ example: 'The fourth planet from the Sun.' }),
})
    .strict()
    .openapi('CreateCelestialBodyRequest');
export const updateCelestialBodyRequestSchema = z
    .object({
    name: z.string().min(1).max(100).optional().openapi({ example: 'Mars' }),
    bodyType: CelestialBodyTypeEnum.optional().openapi({ example: 'PLANET' }),
    description: z.string().max(2000).nullable().optional().openapi({ example: 'Updated description.' }),
})
    .strict()
    .openapi('UpdateCelestialBodyRequest');
export const celestialBodyIdParamSchema = z
    .object({
    id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
})
    .openapi('CelestialBodyIdParam');
