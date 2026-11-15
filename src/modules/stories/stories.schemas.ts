import { z } from '@hono/zod-openapi';
import { paginationQuerySchema } from '../../core/http/pagination.js';

export const storyTypeEnum = z.enum(['LEGACY_STORY', 'BEHIND_THE_TECHNOLOGY', 'FINAL_CHAPTER', 'SPACE_FACT']);
export type StoryTypeDto = z.infer<typeof storyTypeEnum>;

export const publicationStatusEnum = z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']);
export type PublicationStatusDto = z.infer<typeof publicationStatusEnum>;

export const storySchema = z
  .object({
    storyId: z.string().uuid().openapi({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }),
    title: z.string().openapi({ example: 'The Loneliest Rover: Opportunity on Mars' }),
    slug: z.string().openapi({ example: 'the-loneliest-rover' }),
    hook: z.string().nullable().openapi({ example: 'Designed for 90 days, it survived 14 years on Mars.' }),
    content: z.string().openapi({ example: 'Full narrative text recounting Opportunity marathon exploration.' }),
    storyType: storyTypeEnum.openapi({ example: 'LEGACY_STORY' }),
    durationSeconds: z.number().int().nullable().openapi({ example: 360 }),
    language: z.string().openapi({ example: 'en' }),
    publicationStatus: publicationStatusEnum.openapi({ example: 'PUBLISHED' }),
    publishedAt: z.string().datetime().nullable().openapi({ example: '2026-11-15T00:00:00.000Z' }),
    createdAt: z.string().datetime().openapi({ example: '2026-11-15T00:00:00.000Z' }),
    updatedAt: z.string().datetime().openapi({ example: '2026-11-15T00:00:00.000Z' }),
  })
  .openapi('Story');

export type StoryDto = z.infer<typeof storySchema>;

export const storyDetailSchema = storySchema
  .extend({
    missions: z
      .array(
        z.object({
          missionId: z.string().uuid(),
          name: z.string(),
          slug: z.string(),
          displayOrder: z.number(),
        })
      )
      .optional(),
    equipments: z
      .array(
        z.object({
          equipmentId: z.string().uuid(),
          name: z.string(),
          slug: z.string(),
          displayOrder: z.number(),
          narrativeRole: z.string().nullable(),
        })
      )
      .optional(),
    events: z
      .array(
        z.object({
          eventId: z.string().uuid(),
          title: z.string(),
          eventType: z.string(),
          displayOrder: z.number(),
        })
      )
      .optional(),
    media: z
      .array(
        z.object({
          mediaId: z.string().uuid(),
          title: z.string(),
          url: z.string(),
          thumbnailUrl: z.string().nullable(),
          provenanceType: z.string(),
          requiresAiLabel: z.boolean(),
          displayOrder: z.number(),
          captionOverride: z.string().nullable(),
        })
      )
      .optional(),
    sources: z
      .array(
        z.object({
          sourceId: z.string().uuid(),
          title: z.string(),
          url: z.string(),
          displayOrder: z.number(),
          claimDescription: z.string().nullable(),
        })
      )
      .optional(),
  })
  .openapi('StoryDetail');

export type StoryDetailDto = z.infer<typeof storyDetailSchema>;

export const listPublicStoriesQuerySchema = paginationQuerySchema
  .extend({
    storyType: storyTypeEnum.optional().openapi({ description: 'Filter by story type' }),
    language: z.string().optional().openapi({ description: 'Filter by language code (e.g. en)' }),
    equipmentId: z.string().uuid().optional().openapi({ description: 'Filter by associated equipment' }),
    search: z.string().optional().openapi({ description: 'Search term for title, hook, or content' }),
    orderBy: z.enum(['title', 'publishedAt', 'createdAt']).optional().default('publishedAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
  })
  .strict()
  .openapi('ListPublicStoriesQuery');

export type ListPublicStoriesQueryDto = z.infer<typeof listPublicStoriesQuerySchema>;

export const listAdminStoriesQuerySchema = paginationQuerySchema
  .extend({
    publicationStatus: publicationStatusEnum.optional().openapi({ description: 'Filter by publication status' }),
    storyType: storyTypeEnum.optional().openapi({ description: 'Filter by story type' }),
    language: z.string().optional().openapi({ description: 'Filter by language code' }),
    equipmentId: z.string().uuid().optional().openapi({ description: 'Filter by associated equipment' }),
    search: z.string().optional().openapi({ description: 'Search term for title, hook, or content' }),
    orderBy: z.enum(['title', 'publishedAt', 'createdAt', 'updatedAt']).optional().default('updatedAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
  })
  .strict()
  .openapi('ListAdminStoriesQuery');

export type ListAdminStoriesQueryDto = z.infer<typeof listAdminStoriesQuerySchema>;

export const storyIdOrSlugParamSchema = z
  .object({
    idOrSlug: z.string().min(1).openapi({ example: 'the-loneliest-rover', description: 'UUID or unique slug' }),
  })
  .openapi('StoryIdOrSlugParam');

export const storyIdParamSchema = z
  .object({
    id: z.string().uuid().openapi({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }),
  })
  .openapi('StoryIdParam');

export const getStoryQuerySchema = z
  .object({
    include: z.string().optional().openapi({
      description: 'Comma-separated relations to include (max 3): missions,equipments,events,media,sources',
      example: 'equipments,media',
    }),
  })
  .strict()
  .openapi('GetStoryQuery');

export type GetStoryQueryDto = z.infer<typeof getStoryQuerySchema>;

export const createStoryRequestSchema = z
  .object({
    title: z.string().min(1, 'Title is required.').max(255).openapi({ example: 'The Loneliest Rover' }),
    slug: z
      .string()
      .min(1)
      .max(255)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lower-case alphanumeric with hyphens')
      .openapi({ example: 'the-loneliest-rover' }),
    hook: z.string().max(2000).nullable().optional().openapi({ example: 'Surviving 14 years on Mars.' }),
    content: z.string().min(1, 'Content is required.').max(50000).openapi({ example: 'Full story text...' }),
    storyType: storyTypeEnum.openapi({ example: 'LEGACY_STORY' }),
    durationSeconds: z.number().int().positive().nullable().optional().openapi({ example: 300 }),
    language: z.string().min(2).max(10).optional().default('en').openapi({ example: 'en' }),
  })
  .strict()
  .openapi('CreateStoryRequest');

export type CreateStoryRequestDto = z.infer<typeof createStoryRequestSchema>;

export const updateStoryRequestSchema = createStoryRequestSchema.partial().strict().openapi('UpdateStoryRequest');
export type UpdateStoryRequestDto = z.infer<typeof updateStoryRequestSchema>;

export const storyTransitionRequestSchema = z
  .object({
    to: publicationStatusEnum.openapi({ example: 'REVIEW', description: 'Target publication status' }),
  })
  .strict()
  .openapi('StoryTransitionRequest');

export type StoryTransitionRequestDto = z.infer<typeof storyTransitionRequestSchema>;

// Relations
export const linkStoryMissionSchema = z
  .object({
    displayOrder: z.number().int().min(0).optional().default(0).openapi({ example: 0 }),
  })
  .strict()
  .openapi('LinkStoryMissionRequest');

export type LinkStoryMissionRequestDto = z.infer<typeof linkStoryMissionSchema>;

export const linkStoryEquipmentSchema = z
  .object({
    displayOrder: z.number().int().min(0).optional().default(0).openapi({ example: 0 }),
    narrativeRole: z.string().max(255).nullable().optional().openapi({ example: 'Primary subject' }),
  })
  .strict()
  .openapi('LinkStoryEquipmentRequest');

export type LinkStoryEquipmentRequestDto = z.infer<typeof linkStoryEquipmentSchema>;

export const linkStoryEventSchema = z
  .object({
    displayOrder: z.number().int().min(0).optional().default(0).openapi({ example: 0 }),
  })
  .strict()
  .openapi('LinkStoryEventRequest');

export type LinkStoryEventRequestDto = z.infer<typeof linkStoryEventSchema>;

export const linkStoryMediaSchema = z
  .object({
    displayOrder: z.number().int().min(0).optional().default(0).openapi({ example: 0 }),
    captionOverride: z.string().max(2000).nullable().optional().openapi({ example: 'Custom caption for this story' }),
  })
  .strict()
  .openapi('LinkStoryMediaRequest');

export type LinkStoryMediaRequestDto = z.infer<typeof linkStoryMediaSchema>;

export const linkStorySourceSchema = z
  .object({
    displayOrder: z.number().int().min(0).optional().default(0).openapi({ example: 0 }),
    claimDescription: z.string().max(2000).nullable().optional().openapi({ example: 'Mission log reference' }),
  })
  .strict()
  .openapi('LinkStorySourceRequest');

export type LinkStorySourceRequestDto = z.infer<typeof linkStorySourceSchema>;
