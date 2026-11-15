import { z } from 'zod';
import { CelestialBodyType } from '#shared/enums';

export const CelestialBodyTypeEnum = z.enum(['STAR', 'PLANET', 'MOON', 'ASTEROID', 'DWARF_PLANET', 'COMET', 'OTHER']);

export const celestialBodySchema = z.object({
  celestialBodyId: z.string().uuid(),
  name: z.string(),
  bodyType: CelestialBodyTypeEnum,
  description: z.string().nullable(),
});

export type CelestialBodyDto = z.infer<typeof celestialBodySchema>;

export const listCelestialBodiesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  bodyType: CelestialBodyTypeEnum.optional(),
  sort: z.enum(['name', 'bodyType']).default('name'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export type ListCelestialBodiesQueryDto = z.infer<typeof listCelestialBodiesQuerySchema>;

export const createCelestialBodyRequestSchema = z
  .object({
    name: z.string().min(1, 'Name is required.').max(100),
    bodyType: CelestialBodyTypeEnum,
    description: z.string().max(2000).optional(),
  })
  .strict();

export type CreateCelestialBodyRequestDto = z.infer<typeof createCelestialBodyRequestSchema>;

export const updateCelestialBodyRequestSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    bodyType: CelestialBodyTypeEnum.optional(),
    description: z.string().max(2000).nullable().optional(),
  })
  .strict();

export type UpdateCelestialBodyRequestDto = z.infer<typeof updateCelestialBodyRequestSchema>;

export const celestialBodyIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CelestialBodyIdParamDto = z.infer<typeof celestialBodyIdParamSchema>;
