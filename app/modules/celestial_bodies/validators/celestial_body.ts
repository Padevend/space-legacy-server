import { z } from 'zod';

export const celestialBodySchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  summary: z.string(),
  imagePath: z.string().nullable(),
  sortOrder: z.number().int(),
});

export type CelestialBodyDto = z.infer<typeof celestialBodySchema>;
