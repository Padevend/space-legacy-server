# Sources Module Endpoints

This document describes all endpoints for literature, archive documents, and citations under `/api/v1/sources` and `/api/v1/admin/sources`.

---

## 1. `GET /api/v1/sources`

### Purpose
Retrieves a paginated list of authoritative literature and documentation sources.

### Authentication & Authorization
- **Auth:** Public
- **Rate Limit Tier:** `publicRead` (120 req/min per IP)
- **Caching:** Public GET, cacheable with `ETag`.

### Query Parameters
- `page` (number, default: 1)
- `pageSize` (number, default: 20, max: 100)
- `search` (string, optional: title / publisher)
- `sourceType` (enum, optional)
- `publisher` (string, optional)
- `sort` (enum: `title` | `publicationDate` | `accessedAt`, default: `title`)
- `order` (enum: `asc` | `desc`, default: `asc`)

---

## 2. `GET /api/v1/sources/:id`

### Purpose
Retrieves single source reference details by UUID.

---

## 3. `POST /api/v1/admin/sources`

### Purpose
Creates a new source reference. Requires `ADMIN` or `EDITOR` role. URL must be unique (`409 CONFLICT` if duplicate).

---

## 4. `PATCH /api/v1/admin/sources/:id`

### Purpose
Updates an existing source reference. Requires `ADMIN` or `EDITOR` role.

---

## 5. `DELETE /api/v1/admin/sources/:id`

### Purpose
Deletes a source reference. Restricted strictly to `ADMIN` role. Blocked with `409 CONFLICT` if linked to equipment or missions.
