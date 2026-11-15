# Stories Module Endpoints

This document describes all endpoints for editorial stories and narratives under `/api/v1/stories` and `/api/v1/admin/stories`.

---

## 1. `GET /api/v1/stories`

### Purpose
Retrieves a paginated list of **published** educational stories. Unpublished content (`DRAFT`, `REVIEW`, `ARCHIVED`) is strictly excluded from public listings.

### Authentication & Authorization
- **Auth:** Public (anonymous read)
- **Rate Limit Tier:** `publicRead` (120 req/min per IP)
- **Caching:** Public GET, cacheable with `ETag`.

### Query Parameters
- `page` (number, default: 1)
- `pageSize` (number, default: 20, max: 100)
- `search` (string, optional: search in title, hook, and content)
- `storyType` (`LEGACY_STORY` | `BEHIND_THE_TECHNOLOGY` | `FINAL_CHAPTER` | `SPACE_FACT`)
- `language` (string, optional, e.g. `en`)
- `equipmentId` (UUID, optional: stories linked to specific equipment)
- `orderBy` (`title` | `publishedAt` | `createdAt`, default: `publishedAt`)
- `order` (`asc` | `desc`, default: `desc`)

---

## 2. `GET /api/v1/stories/:idOrSlug`

### Purpose
Retrieves a single published story by either its UUID or unique slug.

> [!IMPORTANT]
> If the requested story exists in the database but its status is not `PUBLISHED` (e.g. `DRAFT`, `REVIEW`, `ARCHIVED`), the endpoint returns `404 NOT_FOUND` to prevent leaking editorial existence.

### Query Parameters
- `include` (comma-separated, max 3): `missions`, `equipments`, `events`, `media`, `sources`

---

## 3. `GET /api/v1/admin/stories`

### Purpose
Retrieves all stories across all publication statuses for back-office editorial review. Requires `ADMIN` or `EDITOR` role.

### Query Parameters
- Supports all public filters plus `publicationStatus` (`DRAFT` | `REVIEW` | `PUBLISHED` | `ARCHIVED`).

---

## 4. `POST /api/v1/admin/stories`

### Purpose
Creates a new story in `DRAFT` status with `publishedAt = null`. Requires `ADMIN` or `EDITOR` role. Input fields (`title`, `hook`, `content`) are sanitized against XSS.

### Request Body
```json
{
  "title": "Silent Monuments of the Moon",
  "slug": "silent-monuments",
  "hook": "Historical equipment resting in eternal tranquility.",
  "content": "Full narrative recount of the lunar equipment...",
  "storyType": "LEGACY_STORY",
  "durationSeconds": 240,
  "language": "en"
}
```

---

## 5. `PATCH /api/v1/admin/stories/:id`

### Purpose
Updates story content and metadata. Publication status cannot be changed directly via `PATCH`; editorial transitions must go through `POST /transitions`.

---

## 6. `POST /api/v1/admin/stories/:id/transitions`

### Purpose
Executes a formal editorial state machine transition.

### Allowed Transitions
| From Status | Allowed Targets | Notes |
|---|---|---|
| `DRAFT` | `REVIEW`, `ARCHIVED` | Cannot publish directly without review |
| `REVIEW` | `DRAFT`, `PUBLISHED`, `ARCHIVED` | Approving moves to `PUBLISHED` |
| `PUBLISHED` | `ARCHIVED`, `DRAFT` | Unpublishing or archiving |
| `ARCHIVED` | `DRAFT` | Restoring to draft for re-editing |

> [!NOTE]
> Transitioning to `PUBLISHED` automatically sets `publishedAt = new Date()`.
> Attempting an invalid transition returns `409 CONFLICT`.

### Request Body
```json
{
  "to": "REVIEW"
}
```

---

## 7. `DELETE /api/v1/admin/stories/:id`

### Purpose
Deletes a story. Restricted strictly to `ADMIN` role (`EDITOR` returns `403 FORBIDDEN`).

---

## 8. Relation Endpoints
- `PUT /api/v1/admin/stories/:id/missions/:missionId` with `{ "displayOrder": 1 }`
- `DELETE /api/v1/admin/stories/:id/missions/:missionId`
- `PUT /api/v1/admin/stories/:id/equipment/:equipmentId` with `{ "displayOrder": 1, "narrativeRole": "Central Subject" }`
- `DELETE /api/v1/admin/stories/:id/equipment/:equipmentId`
- `PUT /api/v1/admin/stories/:id/events/:eventId` with `{ "displayOrder": 1 }`
- `DELETE /api/v1/admin/stories/:id/events/:eventId`
- `PUT /api/v1/admin/stories/:id/media/:mediaId` with `{ "displayOrder": 1, "captionOverride": "Custom caption" }`
- `DELETE /api/v1/admin/stories/:id/media/:mediaId`
- `PUT /api/v1/admin/stories/:id/sources/:sourceId` with `{ "displayOrder": 1, "claimDescription": "Primary document" }`
- `DELETE /api/v1/admin/stories/:id/sources/:sourceId`
