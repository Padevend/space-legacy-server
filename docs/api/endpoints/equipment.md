# Equipment Module Endpoints

This document describes all endpoints for equipment under `/api/v1/equipment` and `/api/v1/admin/equipment`.

---

## 1. `GET /api/v1/equipment`

### Purpose
Retrieves a paginated list of equipment items left in space or on surfaces.

### Authentication & Authorization
- **Auth:** Public (anonymous read)
- **Rate Limit Tier:** `publicRead` (120 req/min per IP)

### Query Parameters
- `page` (number, default: 1)
- `pageSize` (number, default: 20, max: 100)
- `search` (string, optional: search in name, description, manufacturer)
- `equipmentType` (enum)
- `operationalStatus` (enum)
- `physicalStatus` (enum)
- `missionId` (uuid, filter by linked mission)
- `celestialBodyId` (uuid, filter by celestial body location)
- `parentEquipmentId` (uuid, filter by parent component)
- `orderBy` (`name` | `equipmentType` | `createdAt` | `updatedAt`, default: `name`)
- `order` (`asc` | `desc`, default: `asc`)

---

## 2. `GET /api/v1/equipment/:idOrSlug`

### Purpose
Retrieves details for a single equipment item by UUID or slug (e.g. `lrv-3-apollo-17`).

### Query Parameters
- `include` (comma-separated, max 3): `parent`, `children`, `missions`, `locations`

---

## 3. Sub-Resource Endpoints
- `GET /api/v1/equipment/:idOrSlug/children`: Sub-assemblies and attached components.
- `GET /api/v1/equipment/:idOrSlug/events`: Chronological mission and timeline events.
- `GET /api/v1/equipment/:idOrSlug/locations`: Surface and orbital location history.
- `GET /api/v1/equipment/:idOrSlug/measurements`: Physical parameters and scientific measurements.
- `GET /api/v1/equipment/:idOrSlug/media`: Photos, 3D models, audio, and visual assets.
- `GET /api/v1/equipment/:idOrSlug/sources`: Primary historical sources and documentation.

---

## 4. `POST /api/v1/admin/equipment` & `PATCH /api/v1/admin/equipment/:id`

### Hierarchy Cycle Prevention
Setting `parentEquipmentId` enforces strict cycle checks:
- An item cannot be its own parent (`422 UNPROCESSABLE_ENTITY`).
- An item cannot be an ancestor of its parent (`422 UNPROCESSABLE_ENTITY`).

---

## 5. `DELETE /api/v1/admin/equipment/:id`
Admin role required. Blocked with `409 CONFLICT` if child components or events are active.

---

## 6. Relation Endpoints
- `PUT /api/v1/admin/equipment/:id/missions/:missionId`
- `DELETE /api/v1/admin/equipment/:id/missions/:missionId`
- `PUT /api/v1/admin/equipment/:id/locations/:locationId`
- `DELETE /api/v1/admin/equipment/:id/locations/:equipmentLocationId`
- `PUT /api/v1/admin/equipment/:id/people/:personId`
- `DELETE /api/v1/admin/equipment/:id/people/:personId`
- `PUT /api/v1/admin/equipment/:id/sources/:sourceId`
- `DELETE /api/v1/admin/equipment/:id/sources/:sourceId`
