import { z } from 'zod';
import { SourceType } from '#shared/enums';

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

export const sourceSchema = z.object({
  sourceId: z.string().uuid(),
  title: z.string(),
  url: z.string().url(),
  publisher: z.string(),
  author: z.string().nullable(),
  publicationDate: z.string().nullable(),
  sourceType: SourceTypeEnum,
  accessedAt: z.string().datetime(),
});

export type SourceDto = z.infer<typeof sourceSchema>;

export const listSourcesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sourceType: SourceTypeEnum.optional(),
  publisher: z.string().optional(),
  sort: z.enum(['title', 'publicationDate', 'accessedAt']).default('title'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export type ListSourcesQueryDto = z.infer<typeof listSourcesQuerySchema>;

export const createSourceRequestSchema = z
  .object({
    title: z.string().min(1, 'Title is required.').max(250),
    url: z
      .string()
      .url('Invalid URL format.')
      .regex(/^https?:\/\//i, 'URL must use HTTP or HTTPS protocol.'),
    publisher: z.string().min(1, 'Publisher is required.').max(150),
    author: z.string().max(150).nullable().optional(),
    publicationDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD.')
      .nullable()
      .optional(),
    sourceType: SourceTypeEnum,
  })
  .strict();

export type CreateSourceRequestDto = z.infer<typeof createSourceRequestSchema>;

export const updateSourceRequestSchema = z
  .object({
    title: z.string().min(1).max(250).optional(),
    url: z
      .string()
      .url('Invalid URL format.')
      .regex(/^https?:\/\//i, 'URL must use HTTP or HTTPS protocol.')
      .optional(),
    publisher: z.string().min(1).max(150).optional(),
    author: z.string().max(150).nullable().optional(),
    publicationDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD.')
      .nullable()
      .optional(),
    sourceType: SourceTypeEnum.optional(),
  })
  .strict();

export type UpdateSourceRequestDto = z.infer<typeof updateSourceRequestSchema>;

export const linkSourceSchema = z
  .object({
    sourceId: z.string().uuid().optional(),
    claimDescription: z.string().max(2000).nullable().optional(),
  })
  .strict();

export type LinkSourceDto = z.infer<typeof linkSourceSchema>;
