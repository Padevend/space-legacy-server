# Measurements Module Endpoints

This document describes all endpoints for scientific and engineering measurements under `/api/v1/measurements` and `/api/v1/admin/measurements`.

---

## 1. `GET /api/v1/measurements`

### Purpose
Retrieves a paginated list of scientific measurements.

### Precision Protection
- `value` and `uncertainty` are returned as **exact strings** to preserve full 8-decimal scientific precision without IEEE 754 floating-point rounding.

### Query Parameters
- `page` (number, default: 1)
- `pageSize` (number, default: 20, max: 100)
- `search` (string, optional: search in name and context)
- `equipmentId` (uuid)
- `eventId` (uuid)
- `measurementType` (`MASS` | `DISTANCE` | `DURATION` | `TEMPERATURE` | `FREQUENCY` | `SPEED` | `FORCE` | `PRESSURE` | `POWER` | `VOLTAGE` | `OTHER`)
- `orderBy` (`name` | `measurementType` | `measurementDate`, default: `name`)
- `order` (`asc` | `desc`, default: `asc`)

---

## 2. `GET /api/v1/measurements/:id`

### Purpose
Retrieves details for a single measurement by UUID.

### Query Parameters
- `include` (comma-separated, max 3): `equipment`, `event`, `sources`

---

## 3. `POST /api/v1/admin/measurements` & `PATCH /api/v1/admin/measurements/:id`
Records or updates scientific measurements. Requires `ADMIN` or `EDITOR` role.

---

## 4. `DELETE /api/v1/admin/measurements/:id`
Deletes a measurement record. Admin role required.

---

## 5. Relation Endpoints
- `PUT /api/v1/admin/measurements/:id/sources/:sourceId` with `{ "claimDescription": "Primary NASA document citation" }`
- `DELETE /api/v1/admin/measurements/:id/sources/:sourceId`
