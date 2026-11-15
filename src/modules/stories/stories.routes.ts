import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import type { AppEnv } from '../../core/http/context.js';
import { storiesController } from './stories.controller.js';
import {
  storySchema,
  storyDetailSchema,
  listPublicStoriesQuerySchema,
  listAdminStoriesQuerySchema,
  getStoryQuerySchema,
  storyIdOrSlugParamSchema,
  storyIdParamSchema,
  createStoryRequestSchema,
  updateStoryRequestSchema,
  storyTransitionRequestSchema,
  linkStoryMissionSchema,
  linkStoryEquipmentSchema,
  linkStoryEventSchema,
  linkStoryMediaSchema,
  linkStorySourceSchema,
} from './stories.schemas.js';
import { authenticate } from '../../core/security/index.js';

// ==========================================
// PUBLIC ROUTES
// ==========================================

export const listPublicStoriesRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List Published Stories',
  description:
    'Retrieves a paginated list of published educational and narrative stories. Unpublished stories (draft, review, archived) are strictly filtered out.',
  tags: ['Stories'],
  request: {
    query: listPublicStoriesQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(storySchema),
            meta: z.object({
              requestId: z.string(),
              page: z.number(),
              pageSize: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
      description: 'Paginated list of published stories.',
    },
  },
});

export const getPublicStoryRoute = createRoute({
  method: 'get',
  path: '/{idOrSlug}',
  summary: 'Get Published Story By ID or Slug',
  description:
    'Retrieves details for a single published story by UUID or unique slug. Returns 404 if the story does not exist or is not in PUBLISHED status.',
  tags: ['Stories'],
  request: {
    params: storyIdOrSlugParamSchema,
    query: getStoryQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: storyDetailSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Published story details with requested relations.',
    },
    404: { description: 'Story not found or not published.' },
    422: { description: 'Unprocessable query parameters.' },
  },
});

export const publicStoriesRouter = new OpenAPIHono<AppEnv>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicStoriesRouter.openapi(listPublicStoriesRoute, storiesController.listPublic as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
publicStoriesRouter.openapi(getPublicStoryRoute, storiesController.getPublic as any);

// ==========================================
// ADMIN ROUTES
// ==========================================

export const listAdminStoriesRoute = createRoute({
  method: 'get',
  path: '/',
  summary: 'List All Stories (Admin)',
  description: 'Retrieves a paginated list of all stories regardless of publication status.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    query: listAdminStoriesQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(storySchema),
            meta: z.object({
              requestId: z.string(),
              page: z.number(),
              pageSize: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
      description: 'Paginated list of all stories.',
    },
    401: { description: 'Unauthenticated.' },
  },
});

export const getAdminStoryRoute = createRoute({
  method: 'get',
  path: '/{id}',
  summary: 'Get Story By ID (Admin)',
  description: 'Retrieves any story by UUID with relations regardless of publication status.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    params: storyIdParamSchema,
    query: getStoryQuerySchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: storyDetailSchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Story details.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Story not found.' },
  },
});

export const createStoryRoute = createRoute({
  method: 'post',
  path: '/',
  summary: 'Create Story',
  description: 'Creates a new story in DRAFT status. Content is sanitized against XSS.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: createStoryRequestSchema },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: storySchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Story created in DRAFT status.',
    },
    401: { description: 'Unauthenticated.' },
    409: { description: 'Slug conflict.' },
    422: { description: 'Validation failed.' },
  },
});

export const updateStoryRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  summary: 'Update Story',
  description:
    'Updates content and metadata of a story. Status transitions must use the dedicated transitions endpoint.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    params: storyIdParamSchema,
    body: {
      content: {
        'application/json': { schema: updateStoryRequestSchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: storySchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Story updated.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Story not found.' },
    409: { description: 'Slug conflict.' },
    422: { description: 'Validation failed.' },
  },
});

export const transitionStoryRoute = createRoute({
  method: 'post',
  path: '/{id}/transitions',
  summary: 'Transition Story Publication Status',
  description:
    'Transitions a story between editorial lifecycle states (DRAFT -> REVIEW -> PUBLISHED -> ARCHIVED). Enforces valid transitions and updates publishedAt when transitioning to PUBLISHED.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    params: storyIdParamSchema,
    body: {
      content: {
        'application/json': { schema: storyTransitionRequestSchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: storySchema,
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Status successfully transitioned.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Story not found.' },
    409: { description: 'Invalid status transition.' },
    422: { description: 'Validation failed.' },
  },
});

export const deleteStoryRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: 'Delete Story',
  description: 'Permanently removes a story (Admin only).',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    params: storyIdParamSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ message: z.string() }),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Story deleted.',
    },
    401: { description: 'Unauthenticated.' },
    403: { description: 'Forbidden (Admin role required).' },
    404: { description: 'Story not found.' },
  },
});

// Relation routes
export const linkStoryMissionRoute = createRoute({
  method: 'put',
  path: '/{id}/missions/{missionId}',
  summary: 'Link Mission to Story',
  description: 'Associates a mission with an editorial story.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), missionId: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: linkStoryMissionSchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ message: z.string() }),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Mission linked to story.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Story or Mission not found.' },
  },
});

export const unlinkStoryMissionRoute = createRoute({
  method: 'delete',
  path: '/{id}/missions/{missionId}',
  summary: 'Unlink Mission from Story',
  description: 'Removes mission association from story.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), missionId: z.string().uuid() }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ message: z.string() }),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Mission unlinked from story.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Association not found.' },
  },
});

export const linkStoryEquipmentRoute = createRoute({
  method: 'put',
  path: '/{id}/equipment/{equipmentId}',
  summary: 'Link Equipment to Story',
  description: 'Associates an equipment piece with an editorial story.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), equipmentId: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: linkStoryEquipmentSchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ message: z.string() }),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Equipment linked to story.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Story or Equipment not found.' },
  },
});

export const unlinkStoryEquipmentRoute = createRoute({
  method: 'delete',
  path: '/{id}/equipment/{equipmentId}',
  summary: 'Unlink Equipment from Story',
  description: 'Removes equipment association from story.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), equipmentId: z.string().uuid() }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ message: z.string() }),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Equipment unlinked from story.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Association not found.' },
  },
});

export const linkStoryEventRoute = createRoute({
  method: 'put',
  path: '/{id}/events/{eventId}',
  summary: 'Link Event to Story',
  description: 'Associates a timeline event with an editorial story.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), eventId: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: linkStoryEventSchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ message: z.string() }),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Event linked to story.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Story or Event not found.' },
  },
});

export const unlinkStoryEventRoute = createRoute({
  method: 'delete',
  path: '/{id}/events/{eventId}',
  summary: 'Unlink Event from Story',
  description: 'Removes event association from story.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), eventId: z.string().uuid() }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ message: z.string() }),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Event unlinked from story.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Association not found.' },
  },
});

export const linkStoryMediaRoute = createRoute({
  method: 'put',
  path: '/{id}/media/{mediaId}',
  summary: 'Link Media to Story',
  description: 'Associates a media item (photo/video/model) with an editorial story.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), mediaId: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: linkStoryMediaSchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ message: z.string() }),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Media linked to story.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Story or Media not found.' },
  },
});

export const unlinkStoryMediaRoute = createRoute({
  method: 'delete',
  path: '/{id}/media/{mediaId}',
  summary: 'Unlink Media from Story',
  description: 'Removes media association from story.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), mediaId: z.string().uuid() }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ message: z.string() }),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Media unlinked from story.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Association not found.' },
  },
});

export const linkStorySourceRoute = createRoute({
  method: 'put',
  path: '/{id}/sources/{sourceId}',
  summary: 'Link Source to Story',
  description: 'Associates a reference source with an editorial story.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), sourceId: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: linkStorySourceSchema },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ message: z.string() }),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Source linked to story.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Story or Source not found.' },
  },
});

export const unlinkStorySourceRoute = createRoute({
  method: 'delete',
  path: '/{id}/sources/{sourceId}',
  summary: 'Unlink Source from Story',
  description: 'Removes source association from story.',
  tags: ['Admin Stories'],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid(), sourceId: z.string().uuid() }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({ message: z.string() }),
            meta: z.object({ requestId: z.string() }),
          }),
        },
      },
      description: 'Source unlinked from story.',
    },
    401: { description: 'Unauthenticated.' },
    404: { description: 'Association not found.' },
  },
});

export const adminStoriesRouter = new OpenAPIHono<AppEnv>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.use('*', authenticate() as any);

// Read
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(listAdminStoriesRoute, storiesController.listAdmin as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(getAdminStoryRoute, storiesController.getAdmin as any);

// Write (Admin or Editor)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(createStoryRoute, storiesController.create as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(updateStoryRoute, storiesController.update as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(transitionStoryRoute, storiesController.transition as any);

// Delete (Admin Only)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(deleteStoryRoute, storiesController.delete as any);

// Relations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(linkStoryMissionRoute, storiesController.linkMission as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(unlinkStoryMissionRoute, storiesController.unlinkMission as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(linkStoryEquipmentRoute, storiesController.linkEquipment as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(unlinkStoryEquipmentRoute, storiesController.unlinkEquipment as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(linkStoryEventRoute, storiesController.linkEvent as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(unlinkStoryEventRoute, storiesController.unlinkEvent as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(linkStoryMediaRoute, storiesController.linkMedia as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(unlinkStoryMediaRoute, storiesController.unlinkMedia as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(linkStorySourceRoute, storiesController.linkSource as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
adminStoriesRouter.openapi(unlinkStorySourceRoute, storiesController.unlinkSource as any);
