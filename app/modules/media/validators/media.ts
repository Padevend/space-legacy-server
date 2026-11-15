import { z } from 'zod';
import { MediaType, MediaProvenance, DownloadStatus } from '#shared/enums';

export const mediaTypeEnum = z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'MODEL_3D', 'DOCUMENT', 'ANIMATION', 'OTHER']);

export const mediaProvenanceEnum = z.enum([
  'NASA_ARCHIVE',
  'RECONSTRUCTION_3D',
  'AI_GENERATED_ILLUSTRATION',
  'DATA_VISUALIZATION',
  'OTHER',
]);

export const downloadStatusEnum = z.enum(['AVAILABLE', 'PENDING', 'FAILED', 'EXTERNAL_ONLY']);

export const mediaSchema = z.object({
  mediaId: z.string().uuid(),
  title: z.string(),
  mediaType: mediaTypeEnum,
  url: z.string(),
  thumbnailUrl: z.string().nullable(),
  caption: z.string().nullable(),
  credit: z.string().nullable(),
  creditUrl: z.string().nullable(),
  provenanceType: mediaProvenanceEnum,
  requiresAiLabel: z.boolean(),
  altText: z.string().nullable(),
  downloadStatus: downloadStatusEnum,
});

export type MediaDto = z.infer<typeof mediaSchema>;

export const mediaDetailSchema = mediaSchema.extend({
  equipments: z
    .array(
      z.object({
        equipmentId: z.string().uuid(),
        name: z.string().optional(),
        slug: z.string().optional(),
        representationType: z.string().nullable(),
      })
    )
    .optional(),
  stories: z
    .array(
      z.object({
        storyId: z.string().uuid(),
        title: z.string().optional(),
        slug: z.string().optional(),
        captionOverride: z.string().nullable(),
        displayOrder: z.number(),
      })
    )
    .optional(),
});

export type MediaDetailDto = z.infer<typeof mediaDetailSchema>;

export const listMediaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  mediaType: mediaTypeEnum.optional(),
  provenanceType: mediaProvenanceEnum.optional(),
  search: z.string().optional(),
  orderBy: z.enum(['title', 'mediaType', 'provenanceType']).optional().default('title'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type ListMediaQueryDto = z.infer<typeof listMediaQuerySchema>;

export const getMediaQuerySchema = z.object({
  include: z.string().optional(),
});

export type GetMediaQueryDto = z.infer<typeof getMediaQuerySchema>;

export const createMediaRequestSchema = z
  .object({
    title: z.string().min(1).max(255),
    mediaType: mediaTypeEnum,
    url: z
      .string()
      .url()
      .regex(/^https?:\/\//i, 'URL must use HTTP or HTTPS protocol')
      .max(2048),
    thumbnailUrl: z
      .string()
      .url()
      .regex(/^https?:\/\//i, 'URL must use HTTP or HTTPS protocol')
      .max(2048)
      .nullable()
      .optional(),
    caption: z.string().max(5000).nullable().optional(),
    credit: z.string().max(255).nullable().optional(),
    creditUrl: z
      .string()
      .url()
      .regex(/^https?:\/\//i, 'URL must use HTTP or HTTPS protocol')
      .max(2048)
      .nullable()
      .optional(),
    provenanceType: mediaProvenanceEnum,
    altText: z.string().max(1000).nullable().optional(),
    downloadStatus: downloadStatusEnum.optional().default('EXTERNAL_ONLY'),
  })
  .strict();

export type CreateMediaRequestDto = z.infer<typeof createMediaRequestSchema>;

export const updateMediaRequestSchema = createMediaRequestSchema.partial().strict();

export type UpdateMediaRequestDto = z.infer<typeof updateMediaRequestSchema>;

export const linkMediaEquipmentSchema = z
  .object({
    representationType: z.string().max(255).nullable().optional(),
  })
  .strict();

export type LinkMediaEquipmentRequestDto = z.infer<typeof linkMediaEquipmentSchema>;
