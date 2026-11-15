import { z } from 'zod';

export const machineLogbookParamsSchema = z.object({
  slug: z.string().min(1).max(100),
});

export const machineLogbookEntryParamsSchema = z.object({
  slug: z.string().min(1).max(100),
  entry: z.string().min(1).max(100),
});

export type MachineLogbookParams = z.infer<typeof machineLogbookParamsSchema>;
export type MachineLogbookEntryParams = z.infer<typeof machineLogbookEntryParamsSchema>;

// Admin Validation Schemas
export const logbookIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const listAdminLogbookQuerySchema = z.object({
  machineId: z.string().uuid().optional(),
  isPublished: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  q: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const createLogbookEntrySchema = z.object({
  machineId: z.string().uuid(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case'),
  title: z.string().min(1),
  summary: z.string().min(1),
  articleMarkdown: z.string().nullable().optional(),
  articleOrigin: z.enum(['AUTHORED', 'GENERATED']).nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  videoOrigin: z.enum(['AUTHORED', 'GENERATED']).nullable().optional(),
  videoDurationSec: z.number().int().positive().nullable().optional(),
  isPublished: z.boolean().default(false),
});

export const updateLogbookEntrySchema = z
  .object({
    machineId: z.string().uuid().optional(),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
      .optional(),
    title: z.string().min(1).optional(),
    summary: z.string().min(1).optional(),
    articleMarkdown: z.string().nullable().optional(),
    articleOrigin: z.enum(['AUTHORED', 'GENERATED']).nullable().optional(),
    videoUrl: z.string().url().nullable().optional(),
    videoOrigin: z.enum(['AUTHORED', 'GENERATED']).nullable().optional(),
    videoDurationSec: z.number().int().positive().nullable().optional(),
    isPublished: z.boolean().optional(),
    publishedAt: z
      .string()
      .datetime()
      .nullable()
      .optional()
      .transform((v) => (v ? new Date(v) : null)),
  })
  .strict();
