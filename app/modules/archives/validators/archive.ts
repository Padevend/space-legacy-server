import { z } from 'zod';

export const archiveSchema = z.object({
  archiveId: z.string().uuid(),
  externalId: z.string(),
  archiveTitle: z.string(),
  archiveProvider: z.string(),
  originalUrl: z.string(),
  rawContent: z.unknown(),
  retrievedAt: z.string().datetime(),
  archiveVersion: z.string().nullable(),
  contentHash: z.string().nullable(),
});

export type ArchiveDto = z.infer<typeof archiveSchema>;

export const listArchivesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  archiveProvider: z.string().optional(),
  search: z.string().optional(),
  orderBy: z.enum(['archiveTitle', 'archiveProvider', 'retrievedAt']).optional().default('retrievedAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ListArchivesQueryDto = z.infer<typeof listArchivesQuerySchema>;

export const createArchiveRequestSchema = z
  .object({
    externalId: z.string().min(1).max(255),
    archiveTitle: z.string().min(1).max(500),
    archiveProvider: z.string().min(1).max(255),
    originalUrl: z.string().url().max(2048),
    rawContent: z.record(z.string(), z.unknown()),
    archiveVersion: z.string().max(100).nullable().optional(),
    contentHash: z.string().max(255).nullable().optional(),
  })
  .strict();

export type CreateArchiveRequestDto = z.infer<typeof createArchiveRequestSchema>;

export const linkArchiveMissionSchema = z
  .object({
    sectionName: z.string().max(255).nullable().optional(),
  })
  .strict();

export type LinkArchiveMissionRequestDto = z.infer<typeof linkArchiveMissionSchema>;

export const linkArchiveEquipmentSchema = z
  .object({
    sectionName: z.string().max(255).nullable().optional(),
    extractedReference: z.string().max(500).nullable().optional(),
  })
  .strict();

export type LinkArchiveEquipmentRequestDto = z.infer<typeof linkArchiveEquipmentSchema>;

export const linkArchiveEventSchema = z
  .object({
    sectionName: z.string().max(255).nullable().optional(),
    extractedReference: z.string().max(500).nullable().optional(),
  })
  .strict();

export type LinkArchiveEventRequestDto = z.infer<typeof linkArchiveEventSchema>;

export const linkArchiveSourceSchema = z
  .object({
    referenceContext: z.string().max(500).nullable().optional(),
  })
  .strict();

export type LinkArchiveSourceRequestDto = z.infer<typeof linkArchiveSourceSchema>;
