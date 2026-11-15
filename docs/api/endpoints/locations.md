# Locations Module Endpoints

This document describes all endpoints for spatial and geographical locations under `/api/v1/locations` and `/api/v1/admin/locations`.

---

## 1. `GET /api/v1/locations`

### Purpose
Retrieves a paginated list of locations (surface landing sites, orbital regions, facilities) with optional filtering by celestial body and location type.

### Authentication & Authorization
- **Auth:** Public
- **Rate Limit Tier:** `publicRead` (120 req/min per IP)
- **Caching:** Public GET, cacheable with `ETag`.

### Query Parameters
- `page` (number, default: 1)
- `pageSize` (number, default: 20, max: 100)
- `search` (string, optional: name search)
- `celestialBodyId` (UUID, optional)
- `locationType` (enum: `LAUNCH_SITE` | `LANDING_SITE` | `SURFACE_LOCATION` | `ORBIT` | `SPACE_REGION` | `FACILITY` | `OTHER`, optional)
- `sort` (enum: `name` | `locationType`, default: `name`)
- `order` (enum: `asc` | `desc`, default: `asc`)

### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": [
    {
      "locationId": "123e4567-e89b-12d3-a456-426614174000",
      "celestialBodyId": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Mare Tranquillitatis",
      "locationType": "LANDING_SITE",
      "latitude": 0.67408,
      "longitude": 23.47297,
      "altitude": -2.573,
      "referenceSystem": "IAU2000",
      "description": "Apollo 11 landing site."
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

## 2. `GET /api/v1/locations/:id`

### Purpose
Retrieves single location details by UUID.

---

## 3. `POST /api/v1/admin/locations`

### Purpose
Creates a new location. Requires `ADMIN` or `EDITOR` role.

### Request Body
```json
{
  "name": "Jezero Crater",
  "locationType": "LANDING_SITE",
  "celestialBodyId": "...",
  "latitude": 18.38,
  "longitude": 77.58,
  "referenceSystem": "IAU2000",
  "description": "Perseverance rover landing site."
}
```

### Success Response (`201 Created`)
**Header:** `Location: /api/v1/locations/<id>`

---

## 4. `PATCH /api/v1/admin/locations/:id`

### Purpose
Updates an existing location. Requires `ADMIN` or `EDITOR` role.

---

## 5. `DELETE /api/v1/admin/locations/:id`

### Purpose
Deletes a location. Restricted strictly to `ADMIN` role. Blocked with `409 CONFLICT` if referenced by events or equipment.
