# API Design & Conventions

## 1. Base URL & Surfaces
- Base path: `/api/v1`
- **Public Surface** (`/api/v1/...`): Read-only (`GET` only), anonymous, cacheable with `ETag` and `Cache-Control`.
- **Admin Surface** (`/api/v1/admin/...`): Authenticated via Bearer JWT, role-based (`ADMIN`, `EDITOR`), never cached (`Cache-Control: no-store`).

## 2. Response Envelope

### Success (Single Resource)
```jsonc
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "569a32cb-0622-420d-ba1e-1a36f67d713e"
  }
}
```

### Success (Paginated List)
```jsonc
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "requestId": "569a32cb-0622-420d-ba1e-1a36f67d713e",
    "page": 1,
    "pageSize": 20,
    "total": 137,
    "totalPages": 7
  }
}
```

### Error
```jsonc
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "status": 422,
    "requestId": "569a32cb-0622-420d-ba1e-1a36f67d713e",
    "details": [
      {
        "path": "body.slug",
        "code": "invalid_string",
        "message": "Slug must contain only lowercase alphanumeric characters and hyphens."
      }
    ]
  }
}
```

## 3. Serialization Rules
- **Dates**: ISO 8601 strings (`2026-11-14T22:01:42.000Z`). `Event.eventDate` is `YYYY-MM-DD`; `Event.eventTime` is `HH:mm:ss`.
- **Decimals**: Geographic and spatial coordinates (`latitude`, `longitude`, `altitude`) are serialized as **floating-point numbers**. Scientific values (`Measurement.value`, `uncertainty`) are serialized as **strings** to prevent precision degradation in JSON.
- **Enums**: Exposed as string literals.
- **Nullable Columns**: Rendered as `null`, never omitted from response objects.

## 4. Query Parameters
- **Pagination**: `page` (default 1), `pageSize` (default 20, maximum 100).
- **Sorting**: `sort=name,-createdAt` against per-module whitelists. Unknown sort attributes trigger 422.
- **Relations**: `include=missions,locations` against per-endpoint whitelists. Maximum 3 included relations, strictly limited to 1 level depth. Unknown relations trigger 422.
- **Search**: `q` text queries (length constrained between 2 and 100 characters).
- Strict parsing: Unknown query parameters trigger a 422 `VALIDATION_ERROR`.
