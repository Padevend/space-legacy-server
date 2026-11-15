# People Module Endpoints

This document describes all endpoints for historical figures, astronauts, and engineers under `/api/v1/people` and `/api/v1/admin/people`.

---

## 1. `GET /api/v1/people`

### Purpose
Retrieves a paginated list of people with optional name search and affiliation filtering.

### Authentication & Authorization
- **Auth:** Public
- **Rate Limit Tier:** `publicRead` (120 req/min per IP)
- **Caching:** Public GET, cacheable with `ETag`.

### Query Parameters
- `page` (number, default: 1)
- `pageSize` (number, default: 20, max: 100)
- `search` (string, optional)
- `affiliation` (string, optional)
- `sort` (enum: `fullName` | `affiliation`, default: `fullName`)
- `order` (enum: `asc` | `desc`, default: `asc`)

---

## 2. `GET /api/v1/people/:id`

### Purpose
Retrieves single person details by UUID.

---

## 3. `POST /api/v1/admin/people`

### Purpose
Creates a new person profile. Requires `ADMIN` or `EDITOR` role.

---

## 4. `PATCH /api/v1/admin/people/:id`

### Purpose
Updates an existing person profile. Requires `ADMIN` or `EDITOR` role.

---

## 5. `DELETE /api/v1/admin/people/:id`

### Purpose
Deletes a person profile. Restricted strictly to `ADMIN` role.
