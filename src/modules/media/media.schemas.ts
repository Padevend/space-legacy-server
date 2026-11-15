import { z } from '@hono/zod-openapi';
import { paginationQuerySchema } from '../../core/http/pagination.js';

export const mediaTypeEnum = z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'MODEL_3D', 'DOCUMENT', 'ANIMATION', 'OTHER']);
export type MediaTypeDto = z.infer<typeof mediaTypeEnum>;

export const mediaProvenanceEnum = z.enum([
  'NASA_ARCHIVE',
  'RECONSTRUCTION_3D',
  'AI_GENERATED_ILLUSTRATION',
  'DATA_VISUALIZATION',
  'OTHER',
]);
export type MediaProvenanceDto = z.infer<typeof mediaProvenanceEnum>;

export const downloadStatusEnum = z.enum(['AVAILABLE', 'PENDING', 'FAILED', 'EXTERNAL_ONLY']);
export type DownloadStatusDto = z.infer<typeof downloadStatusEnum>;

export const mediaSchema = z
  .object({
    mediaId: z.string().uuid().openapi({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }),
    title: z.string().openapi({ example: 'Apollo 11 Eagle Lunar Module on the Moon' }),
    mediaType: mediaTypeEnum.openapi({ example: 'IMAGE' }),
    url: z.string().openapi({ example: 'https://images.nasa.gov/details-AS11-40-5922' }),
    thumbnailUrl: z.string().nullable().openapi({ example: 'https://images.nasa.gov/thumb-AS11-40-5922.jpg' }),
    caption: z.string().nullable().openapi({ example: 'Buzz Aldrin walks on the surface of the Moon.' }),
    credit: z.string().nullable().openapi({ example: 'NASA / Neil Armstrong' }),
    creditUrl: z.string().nullable().openapi({ example: 'https://nasa.gov' }),
    provenanceType: mediaProvenanceEnum.openapi({ example: 'NASA_ARCHIVE' }),
    requiresAiLabel: z.boolean().openapi({
      example: false,
      description: 'Mandatory label indicator; true when provenanceType is AI_GENERATED_ILLUSTRATION.',
    }),
    altText: z.string().nullable().openapi({ example: 'Astronaut in spacesuit standing on lunar surface.' }),
    downloadStatus: downloadStatusEnum.openapi({ example: 'EXTERNAL_ONLY' }),
  })
  .openapi('Media');

export type MediaDto = z.infer<typeof mediaSchema>;

export const mediaDetailSchema = mediaSchema
  .extend({
    equipments: z
      .array(
        z.object({
          equipmentId: z.string().uuid(),
          name: z.string(),
          slug: z.string(),
          representationType: z.string().nullable(),
        })
      )
      .optional(),
    stories: z
      .array(
        z.object({
          storyId: z.string().uuid(),
          title: z.string(),
          slug: z.string(),
          captionOverride: z.string().nullable(),
          displayOrder: z.number(),
        })
      )
      .optional(),
  })
  .openapi('MediaDetail');

export type MediaDetailDto = z.infer<typeof mediaDetailSchema>;

export const listMediaQuerySchema = paginationQuerySchema
  .extend({
    mediaType: mediaTypeEnum.optional().openapi({ description: 'Filter by media type' }),
    provenanceType: mediaProvenanceEnum.optional().openapi({ description: 'Filter by provenance type' }),
    search: z.string().optional().openapi({ description: 'Search term for media title or caption' }),
    orderBy: z.enum(['title', 'mediaType', 'provenanceType']).optional().default('title'),
    order: z.enum(['asc', 'desc']).optional().default('asc'),
  })
  .strict()
  .openapi('ListMediaQuery');

export type ListMediaQueryDto = z.infer<typeof listMediaQuerySchema>;

export const mediaIdParamSchema = z
  .object({
    id: z.string().uuid().openapi({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }),
  })
  .openapi('MediaIdParam');

export const getMediaQuerySchema = z
  .object({
    include: z.string().optional().openapi({
      description: 'Comma-separated relations to include (max 3): equipments,stories',
      example: 'equipments,stories',
    }),
  })
  .strict()
  .openapi('GetMediaQuery');

export type GetMediaQueryDto = z.infer<typeof getMediaQuerySchema>;

export const createMediaRequestSchema = z
  .object({
    title: z.string().min(1, 'Title is required.').max(255).openapi({ example: 'Apollo 11 Eagle Lunar Module' }),
    mediaType: mediaTypeEnum.openapi({ example: 'IMAGE' }),
    url: z
      .string()
      .url('Invalid URL format.')
      .regex(/^https?:\/\//i, 'URL must use HTTP or HTTPS protocol.')
      .max(2048)
      .openapi({ example: 'https://images.nasa.gov/details-AS11-40-5922' }),
    thumbnailUrl: z
      .string()
      .url('Invalid URL format.')
      .regex(/^https?:\/\//i, 'URL must use HTTP or HTTPS protocol.')
      .max(2048)
      .nullable()
      .optional()
      .openapi({ example: 'https://images.nasa.gov/thumb-AS11-40-5922.jpg' }),
    caption: z
      .string()
      .max(5000)
      .nullable()
      .optional()
      .openapi({ example: 'Buzz Aldrin walks on the surface of the Moon.' }),
    credit: z.string().max(255).nullable().optional().openapi({ example: 'NASA / Neil Armstrong' }),
    creditUrl: z
      .string()
      .url('Invalid URL format.')
      .regex(/^https?:\/\//i, 'URL must use HTTP or HTTPS protocol.')
      .max(2048)
      .nullable()
      .optional()
      .openapi({ example: 'https://nasa.gov' }),
    provenanceType: mediaProvenanceEnum.openapi({ example: 'NASA_ARCHIVE' }),
    altText: z.string().max(1000).nullable().optional().openapi({ example: 'Astronaut in spacesuit on Moon' }),
    downloadStatus: downloadStatusEnum.optional().default('EXTERNAL_ONLY').openapi({ example: 'EXTERNAL_ONLY' }),
  })
  .strict()
  .openapi('CreateMediaRequest');

export type CreateMediaRequestDto = z.infer<typeof createMediaRequestSchema>;

export const updateMediaRequestSchema = createMediaRequestSchema.partial().strict().openapi('UpdateMediaRequest');
export type UpdateMediaRequestDto = z.infer<typeof updateMediaRequestSchema>;

export const linkMediaEquipmentSchema = z
  .object({
    representationType: z.string().max(255).nullable().optional().openapi({ example: 'PRIMARY_PHOTO' }),
  })
  .strict()
  .openapi('LinkMediaEquipmentRequest');

export type LinkMediaEquipmentRequestDto = z.infer<typeof linkMediaEquipmentSchema>;
