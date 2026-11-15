import { z } from 'zod';

export const ingestionStatusEnum = z.enum(['PENDING', 'RUNNING', 'COMPLETED', 'FAILED']);

export const ingestionRunSchema = z.object({
  ingestionRunId: z.string().uuid(),
  status: ingestionStatusEnum,
  countsSummary: z.record(z.string(), z.number()).nullable(),
  errorSummary: z.string().nullable(),
  dryRun: z.boolean(),
  contentHash: z.string().nullable(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type IngestionRunDto = z.infer<typeof ingestionRunSchema>;

export const listIngestionRunsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: ingestionStatusEnum.optional(),
  orderBy: z.enum(['startedAt', 'createdAt']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ListIngestionRunsQueryDto = z.infer<typeof listIngestionRunsQuerySchema>;

export const triggerIngestRequestSchema = z
  .object({
    directory: z.string().optional().default('/results'),
    dryRun: z.boolean().optional().default(false),
  })
  .strict();

export type TriggerIngestRequestDto = z.infer<typeof triggerIngestRequestSchema>;
