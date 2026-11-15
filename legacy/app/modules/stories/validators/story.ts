import { z } from 'zod';
import { StoryType, PublicationStatus } from '#shared/enums';

export const storyTypeEnum = z.enum(['LEGACY_STORY', 'BEHIND_THE_TECHNOLOGY', 'FINAL_CHAPTER', 'SPACE_FACT']);

export const publicationStatusEnum = z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']);

export const storySchema = z.object({
  storyId: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  hook: z.string().nullable(),
  content: z.string(),
  storyType: storyTypeEnum,
  durationSeconds: z.number().int().nullable(),
  language: z.string(),
  publicationStatus: publicationStatusEnum,
  publishedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type StoryDto = z.infer<typeof storySchema>;

export const storyDetailSchema = storySchema.extend({
  missions: z
    .array(
      z.object({
        missionId: z.string().uuid(),
        name: z.string().optional(),
        slug: z.string().optional(),
        displayOrder: z.number(),
      })
    )
    .optional(),
  equipments: z
    .array(
      z.object({
        equipmentId: z.string().uuid(),
        name: z.string().optional(),
        slug: z.string().optional(),
        displayOrder: z.number(),
        narrativeRole: z.string().nullable(),
      })
    )
    .optional(),
  events: z
    .array(
      z.object({
        eventId: z.string().uuid(),
        title: z.string().optional(),
        eventType: z.string().optional(),
        displayOrder: z.number(),
      })
    )
    .optional(),
  sources: z
    .array(
      z.object({
        sourceId: z.string().uuid(),
        title: z.string().optional(),
        url: z.string().optional(),
        displayOrder: z.number(),
        claimDescription: z.string().nullable(),
      })
    )
    .optional(),
});

export type StoryDetailDto = z.infer<typeof storyDetailSchema>;

export const listPublicStoriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  storyType: storyTypeEnum.optional(),
  language: z.string().optional(),
  equipmentId: z.string().uuid().optional(),
  search: z.string().optional(),
  orderBy: z.enum(['title', 'publishedAt', 'createdAt']).optional().default('publishedAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ListPublicStoriesQueryDto = z.infer<typeof listPublicStoriesQuerySchema>;

export const listAdminStoriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  publicationStatus: publicationStatusEnum.optional(),
  storyType: storyTypeEnum.optional(),
  language: z.string().optional(),
  equipmentId: z.string().uuid().optional(),
  search: z.string().optional(),
  orderBy: z.enum(['title', 'publishedAt', 'createdAt', 'updatedAt']).optional().default('updatedAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ListAdminStoriesQueryDto = z.infer<typeof listAdminStoriesQuerySchema>;

export const getStoryQuerySchema = z.object({
  include: z.string().optional(),
});

export type GetStoryQueryDto = z.infer<typeof getStoryQuerySchema>;

export const createStoryRequestSchema = z
  .object({
    title: z.string().min(1).max(255),
    slug: z
      .string()
      .min(1)
      .max(255)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lower-case alphanumeric with hyphens'),
    hook: z.string().max(2000).nullable().optional(),
    content: z.string().min(1).max(50000),
    storyType: storyTypeEnum,
    durationSeconds: z.number().int().positive().nullable().optional(),
    language: z.string().min(2).max(10).optional().default('en'),
  })
  .strict();

export type CreateStoryRequestDto = z.infer<typeof createStoryRequestSchema>;

export const updateStoryRequestSchema = createStoryRequestSchema.partial().strict();

export type UpdateStoryRequestDto = z.infer<typeof updateStoryRequestSchema>;

export const storyTransitionRequestSchema = z
  .object({
    to: publicationStatusEnum,
  })
  .strict();

export type StoryTransitionRequestDto = z.infer<typeof storyTransitionRequestSchema>;

// Relations
export const linkStoryMissionSchema = z
  .object({
    displayOrder: z.number().int().min(0).optional().default(0),
  })
  .strict();

export type LinkStoryMissionRequestDto = z.infer<typeof linkStoryMissionSchema>;

export const linkStoryEquipmentSchema = z
  .object({
    displayOrder: z.number().int().min(0).optional().default(0),
    narrativeRole: z.string().max(255).nullable().optional(),
  })
  .strict();

export type LinkStoryEquipmentRequestDto = z.infer<typeof linkStoryEquipmentSchema>;

export const linkStoryEventSchema = z
  .object({
    displayOrder: z.number().int().min(0).optional().default(0),
  })
  .strict();

export type LinkStoryEventRequestDto = z.infer<typeof linkStoryEventSchema>;

export const linkStorySourceSchema = z
  .object({
    displayOrder: z.number().int().min(0).optional().default(0),
    claimDescription: z.string().max(2000).nullable().optional(),
  })
  .strict();

export type LinkStorySourceRequestDto = z.infer<typeof linkStorySourceSchema>;
