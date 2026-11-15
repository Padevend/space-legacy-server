# Media Module Endpoints

This document describes all endpoints for digital media assets under `/api/v1/media` and `/api/v1/admin/media`.

---

## 1. `GET /api/v1/media`

### Purpose
Retrieves a paginated list of media assets (photos, 3D reconstructions, audio recordings, video footage, technical diagrams, animations) with computed `requiresAiLabel` indicators.

### Authentication & Authorization
- **Auth:** Public (anonymous read)
- **Rate Limit Tier:** `publicRead` (120 req/min per IP)
- **Caching:** Public GET, cacheable with `ETag`.

### Query Parameters
- `page` (number, default: 1)
- `pageSize` (number, default: 20, max: 100)
- `search` (string, optional: search in title and caption)
- `mediaType` (`IMAGE` | `VIDEO` | `AUDIO` | `MODEL_3D` | `DOCUMENT` | `ANIMATION` | `OTHER`)
- `provenanceType` (`NASA_ARCHIVE` | `RECONSTRUCTION_3D` | `AI_GENERATED_ILLUSTRATION` | `DATA_VISUALIZATION` | `OTHER`)
- `orderBy` (`title` | `mediaType` | `provenanceType`, default: `title`)
- `order` (`asc` | `desc`, default: `asc`)

---

## 2. `GET /api/v1/media/:id`

### Purpose
Retrieves details for a single media asset by its UUID. Automatically computes `requiresAiLabel: true` when `provenanceType === 'AI_GENERATED_ILLUSTRATION'`.

### Query Parameters
- `include` (comma-separated, max 3): `equipments`, `stories`

---

## 3. `POST /api/v1/admin/media`

### Purpose
Creates a new media asset. Requires `ADMIN` or `EDITOR` role.

### Request Body
```json
{
  "title": "Surveyor 3 Footpad on the Moon",
  "mediaType": "IMAGE",
  "url": "https://images.nasa.gov/details-AS12-48-7121.jpg",
  "thumbnailUrl": "https://images.nasa.gov/thumb-AS12-48-7121.jpg",
  "caption": "Apollo 12 astronaut Pete Conrad inspects Surveyor 3 footpad.",
  "credit": "NASA / Pete Conrad",
  "creditUrl": "https://nasa.gov",
  "provenanceType": "NASA_ARCHIVE",
  "altText": "Astronaut in spacesuit examining robotic footpad",
  "downloadStatus": "EXTERNAL_ONLY"
}
```

---

## 4. `PATCH /api/v1/admin/media/:id`

### Purpose
Updates attributes of an existing media asset. Requires `ADMIN` or `EDITOR` role.

---

## 5. `DELETE /api/v1/admin/media/:id`

### Purpose
Deletes a media asset. Restricted strictly to `ADMIN` role (`EDITOR` returns `403 FORBIDDEN`).

---

## 6. Relation Endpoints
- `PUT /api/v1/admin/media/:id/equipment/:equipmentId` with `{ "representationType": "PRIMARY_PHOTO" }`
- `DELETE /api/v1/admin/media/:id/equipment/:equipmentId`
