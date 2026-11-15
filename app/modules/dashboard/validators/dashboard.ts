import { z } from 'zod';

export const dashboardOverviewSchema = z.object({
  counters: z.object({
    machines: z.object({
      total: z.number().int(),
      published: z.number().int(),
      unpublished: z.number().int(),
    }),
    celestialBodies: z.object({
      total: z.number().int(),
      published: z.number().int(),
      unpublished: z.number().int(),
    }),
    logbook: z.object({
      total: z.number().int(),
      published: z.number().int(),
      unpublished: z.number().int(),
    }),
    quizzes: z.object({
      total: z.number().int(),
      published: z.number().int(),
      unpublished: z.number().int(),
    }),
  }),
  latestIngestion: z
    .object({
      id: z.string().uuid(),
      filename: z.string(),
      status: z.string(),
      createdAt: z.date(),
      finishedAt: z.date().nullable(),
    })
    .nullable(),
  failedJobsCount: z.number().int(),
  unpublishedContent: z.object({
    machines: z.array(
      z.object({
        id: z.string().uuid(),
        slug: z.string(),
        name: z.string(),
      })
    ),
    logbook: z.array(
      z.object({
        id: z.string().uuid(),
        slug: z.string(),
        title: z.string(),
      })
    ),
  }),
});
