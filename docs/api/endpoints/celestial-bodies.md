# Celestial Bodies Module Endpoints

This document describes all endpoints for astronomical bodies under `/api/v1/celestial-bodies` and `/api/v1/admin/celestial-bodies`.

---

## 1. `GET /api/v1/celestial-bodies`

### Purpose
Retrieves a paginated list of celestial bodies (Moon, Mars, asteroids, etc.) with optional filtering and sorting.

### Authentication & Authorization
- **Auth:** Public (anonymous read)
- **Rate Limit Tier:** `publicRead` (120 req/min per IP)
- **Caching:** Public GET, cacheable with `ETag`.

### Query Parameters
- `page` (number, default: 1)
- `pageSize` (number, default: 20, max: 100)
- `search` (string, optional: name search)
- `bodyType` (enum: `STAR` | `PLANET` | `MOON` | `ASTEROID` | `DWARF_PLANET` | `COMET` | `OTHER`, optional)
- `sort` (enum: `name` | `bodyType`, default: `name`)
- `order` (enum: `asc` | `desc`, default: `asc`)

### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "celestialBodyId": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Moon",
      "bodyType": "MOON",
      "description": "Earth natural satellite."
    }
  ],
  "meta": {
    "requestId": "req-12345",
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## 2. `GET /api/v1/celestial-bodies/:id`

### Purpose
Retrieves details for a single celestial body by UUID.

---

## 3. `POST /api/v1/admin/celestial-bodies`

### Purpose
Creates a new celestial body. Requires `ADMIN` or `EDITOR` role.

### Request Body
```json
{
  "name": "Titan",
  "bodyType": "MOON",
  "description": "The largest moon of Saturn."
}
```

### Success Response (`201 Created`)
**Header:** `Location: /api/v1/celestial-bodies/<id>`

---

## 4. `PATCH /api/v1/admin/celestial-bodies/:id`

### Purpose
Updates an existing celestial body. Requires `ADMIN` or `EDITOR` role.

---

## 5. `DELETE /api/v1/admin/celestial-bodies/:id`

### Purpose
Deletes a celestial body. Restricted strictly to `ADMIN` role (`EDITOR` returns `403 FORBIDDEN`). Blocked with `409 CONFLICT` if referenced by locations.
