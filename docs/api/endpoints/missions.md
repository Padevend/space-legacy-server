# Missions Module Endpoints

This document describes all endpoints for space missions under `/api/v1/missions` and `/api/v1/admin/missions`.

---

## 1. `GET /api/v1/missions`

### Purpose
Retrieves a paginated list of space missions with optional filtering and sorting.

### Authentication & Authorization
- **Auth:** Public (anonymous read)
- **Rate Limit Tier:** `publicRead` (120 req/min per IP)
- **Caching:** Public GET, cacheable with `ETag`.

### Query Parameters
- `page` (number, default: 1)
- `pageSize` (number, default: 20, max: 100)
- `search` (string, optional: search in name and description)
- `missionStatus` (`PLANNED` | `ACTIVE` | `COMPLETED` | `PARTIALLY_COMPLETED` | `FAILED` | `UNKNOWN`)
- `agency` (string, optional)
- `orderBy` (`name` | `createdAt` | `updatedAt`, default: `name`)
- `order` (`asc` | `desc`, default: `asc`)

---

## 2. `GET /api/v1/missions/:idOrSlug`

### Purpose
Retrieves details for a single mission by either its UUID or unique alphanumeric slug (e.g., `apollo-11`).

### Query Parameters
- `include` (comma-separated, max 3): `equipment`, `people`, `sources`

---

## 3. `POST /api/v1/admin/missions`

### Purpose
Creates a new mission. Requires `ADMIN` or `EDITOR` role.

### Request Body
```json
{
  "name": "Apollo 11",
  "slug": "apollo-11",
  "description": "First manned lunar landing.",
  "agency": "NASA",
  "missionStatus": "COMPLETED"
}
```

---

## 4. `PATCH /api/v1/admin/missions/:id`

### Purpose
Updates an existing mission. Requires `ADMIN` or `EDITOR` role.

---

## 5. `DELETE /api/v1/admin/missions/:id`

### Purpose
Deletes a mission. Restricted strictly to `ADMIN` role. Blocked with `409 CONFLICT` if child equipment or events are active.

---

## 6. Relation Endpoints
- `PUT /api/v1/admin/missions/:id/people/:personId` with `{ "roleInMission": "Commander" }`
- `DELETE /api/v1/admin/missions/:id/people/:personId`
- `PUT /api/v1/admin/missions/:id/sources/:sourceId` with `{ "claimDescription": "Mission report" }`
- `DELETE /api/v1/admin/missions/:id/sources/:sourceId`
- `PUT /api/v1/admin/missions/:id/equipment/:equipmentId` with `{ "missionRole": "Lunar Module", "participationDescription": "Descent stage left on surface" }`
- `DELETE /api/v1/admin/missions/:id/equipment/:equipmentId`
