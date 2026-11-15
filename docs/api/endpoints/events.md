# Events Module Endpoints

This document describes all endpoints for mission and timeline events under `/api/v1/events` and `/api/v1/admin/events`.

---

## 1. `GET /api/v1/events`

### Purpose
Retrieves a paginated list of chronological events with optional date and type filtering.

### Query Parameters
- `page` (number, default: 1)
- `pageSize` (number, default: 20, max: 100)
- `search` (string, optional: search in title and description)
- `missionId` (uuid)
- `equipmentId` (uuid)
- `eventType` (enum)
- `from` (`YYYY-MM-DD`, start date filter)
- `to` (`YYYY-MM-DD`, end date filter)
- `orderBy` (`eventDate` | `sequenceOrder` | `title` | `createdAt`, default: `eventDate`)
- `order` (`asc` | `desc`, default: `asc`)

---

## 2. `GET /api/v1/events/:id`

### Purpose
Retrieves details for a single event by UUID.

### Query Parameters
- `include` (comma-separated, max 3): `mission`, `equipment`, `locations`, `people`, `sources`

---

## 3. `POST /api/v1/admin/events` & `PATCH /api/v1/admin/events/:id`
Create and update mission events. `eventDate` is validated as `YYYY-MM-DD` and `eventTime` as `HH:mm:ss`.

---

## 4. `DELETE /api/v1/admin/events/:id`
Admin role required.

---

## 5. Relation Endpoints
- `PUT /api/v1/admin/events/:id/equipment/:equipmentId` with `{ "roleInEvent": "Lander", "description": "Landed safely" }`
- `DELETE /api/v1/admin/events/:id/equipment/:equipmentId`
- `PUT /api/v1/admin/events/:id/locations/:locationId` with `{ "locationRole": "Touchdown site" }`
- `DELETE /api/v1/admin/events/:id/locations/:locationId`
- `PUT /api/v1/admin/events/:id/people/:personId` with `{ "roleInEvent": "Commander" }`
- `DELETE /api/v1/admin/events/:id/people/:personId`
- `PUT /api/v1/admin/events/:id/sources/:sourceId` with `{ "claimDescription": "Official flight timeline" }`
- `DELETE /api/v1/admin/events/:id/sources/:sourceId`
