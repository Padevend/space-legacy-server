# Stories Module

## Purpose
Manages educational narratives and editorial content with a formal state machine (`DRAFT` -> `REVIEW` -> `PUBLISHED` / `ARCHIVED`), strict privacy guarantees (zero public visibility for unpublished drafts), and cross-domain associations with missions, equipment, events, media, and sources.

## Owned Models
- `Story`
- `StoryMission`
- `StoryEquipment`
- `StoryEvent`
- `StoryMedia`
- `StorySource`

## Endpoints
### Public
- `GET /api/v1/stories` (published only)
- `GET /api/v1/stories/:idOrSlug` (published only)

### Admin
- `GET /api/v1/admin/stories` (all states)
- `GET /api/v1/admin/stories/:idOrSlug` (all states)
- `POST /api/v1/admin/stories`
- `PUT /api/v1/admin/stories/:id`
- `POST /api/v1/admin/stories/:id/transition`
- `DELETE /api/v1/admin/stories/:id`
- `POST /api/v1/admin/stories/:storyId/missions/:missionId`
- `DELETE /api/v1/admin/stories/:storyId/missions/:missionId`
- `POST /api/v1/admin/stories/:storyId/equipment/:equipmentId`
- `DELETE /api/v1/admin/stories/:storyId/equipment/:equipmentId`
- `POST /api/v1/admin/stories/:storyId/events/:eventId`
- `DELETE /api/v1/admin/stories/:storyId/events/:eventId`
- `POST /api/v1/admin/stories/:storyId/media/:mediaId`
- `DELETE /api/v1/admin/stories/:storyId/media/:mediaId`
- `POST /api/v1/admin/stories/:storyId/sources/:sourceId`
- `DELETE /api/v1/admin/stories/:storyId/sources/:sourceId`
