import { z } from '@hono/zod-openapi';

export const SourceTypeEnum = z.enum([
  'OFFICIAL_DOCUMENT',
  'SCIENTIFIC_PAPER',
  'NASA_WEBPAGE',
  'DATASET',
  'BOOK',
  'ARTICLE',
  'VIDEO',
  'OTHER',
]);

export type SourceType = z.infer<typeof SourceTypeEnum>;

export const sourceSchema = z
  .object({
    sourceId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    title: z.string().openapi({ example: 'Apollo 11 Mission Report' }),
    url: z.string().url().openapi({ example: 'https://archive.nasa.gov/details/apollo11' }),
    publisher: z.string().openapi({ example: 'NASA MSC' }),
    author: z.string().nullable().openapi({ example: 'Mission Evaluation Team' }),
    publicationDate: z.string().nullable().openapi({ example: '1969-11-01' }),
    sourceType: SourceTypeEnum.openapi({ example: 'OFFICIAL_DOCUMENT' }),
    accessedAt: z.string().datetime().openapi({ example: '2026-01-01T00:00:00.000Z' }),
  })
  .openapi('Source');

export type SourceDto = z.infer<typeof sourceSchema>;

export const listSourcesQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
    pageSize: z.coerce.number().int().min(1).max(100).default(20).openapi({ example: 20 }),
    search: z.string().optional().openapi({ example: 'Apollo' }),
    sourceType: SourceTypeEnum.optional().openapi({ example: 'OFFICIAL_DOCUMENT' }),
    publisher: z.string().optional().openapi({ example: 'NASA' }),
    sort: z.enum(['title', 'publicationDate', 'accessedAt']).default('title').openapi({ example: 'title' }),
    order: z.enum(['asc', 'desc']).default('asc').openapi({ example: 'asc' }),
  })
  .openapi('ListSourcesQuery');

export type ListSourcesQueryDto = z.infer<typeof listSourcesQuerySchema>;

export const createSourceRequestSchema = z
  .object({
    title: z.string().min(1, 'Title is required.').max(250).openapi({ example: 'Apollo 11 Mission Report' }),
    url: z
      .string()
      .url('Invalid URL format.')
      .regex(/^https?:\/\//i, 'URL must use HTTP or HTTPS protocol.')
      .openapi({ example: 'https://archive.nasa.gov/details/apollo11' }),
    publisher: z.string().min(1, 'Publisher is required.').max(150).openapi({ example: 'NASA MSC' }),
    author: z.string().max(150).nullable().optional().openapi({ example: 'Mission Evaluation Team' }),
    publicationDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD.')
      .nullable()
      .optional()
      .openapi({ example: '1969-11-01' }),
    sourceType: SourceTypeEnum.openapi({ example: 'OFFICIAL_DOCUMENT' }),
  })
  .strict()
  .openapi('CreateSourceRequest');

export type CreateSourceRequestDto = z.infer<typeof createSourceRequestSchema>;

export const updateSourceRequestSchema = z
  .object({
    title: z.string().min(1).max(250).optional().openapi({ example: 'Apollo 11 Mission Report (Revised)' }),
    url: z
      .string()
      .url('Invalid URL format.')
      .regex(/^https?:\/\//i, 'URL must use HTTP or HTTPS protocol.')
      .optional()
      .openapi({ example: 'https://archive.nasa.gov/details/apollo11-rev1' }),
    publisher: z.string().min(1).max(150).optional().openapi({ example: 'NASA MSC' }),
    author: z.string().max(150).nullable().optional().openapi({ example: 'NASA Technical Staff' }),
    publicationDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD.')
      .nullable()
      .optional()
      .openapi({ example: '1969-11-01' }),
    sourceType: SourceTypeEnum.optional().openapi({ example: 'OFFICIAL_DOCUMENT' }),
  })
  .strict()
  .openapi('UpdateSourceRequest');

export type UpdateSourceRequestDto = z.infer<typeof updateSourceRequestSchema>;

export const sourceIdParamSchema = z
  .object({
    id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  })
  .openapi('SourceIdParam');

export type SourceIdParamDto = z.infer<typeof sourceIdParamSchema>;
