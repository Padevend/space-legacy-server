import { z } from 'zod';

export const dashboardStatsSchema = z.object({
  counts: z.object({
    equipment: z.number().int(),
    missions: z.number().int(),
    events: z.number().int(),
    stories: z.number().int(),
    media: z.number().int(),
    sources: z.number().int(),
    users: z.number().int(),
  }),
  storiesByStatus: z.object({
    draft: z.number().int(),
    review: z.number().int(),
    published: z.number().int(),
    archived: z.number().int(),
  }),
  mediaAiCount: z.number().int(),
});

export type DashboardStatsDto = z.infer<typeof dashboardStatsSchema>;
