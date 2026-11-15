import { z } from 'zod';

export const celestialBodySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  summary: z.string(),
  imagePath: z.string().nullable(),
  sortOrder: z.number().int(),
});

export const celestialBodyIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const updateCelestialBodySchema = z
  .object({
    name: z.string().min(1).optional(),
    summary: z.string().min(1).optional(),
    imagePath: z.string().nullable().optional(),
    sortOrder: z.number().int().optional(),
    isPublished: z.boolean().optional(),
  })
  .strict();

export type UpdateCelestialBodyInput = z.infer<typeof updateCelestialBodySchema>;
