# Source Entity Contract

The `Source` entity provides provenance, academic citations, archival links, and bibliographic tracing for equipment, measurements, and missions.

## 1. Natural Keys & Constraints
- `url` is globally unique in the database.
- Scheme validation restricts URLs to HTTP and HTTPS protocols.

## 2. Endpoints
- Public:
  - `GET /api/v1/sources`: List sources with pagination, search, publisher, and sourceType filters.
  - `GET /api/v1/sources/:id`: Get single source details.
- Admin:
  - `GET /api/v1/admin/sources`: Admin list.
  - `POST /api/v1/admin/sources`: Create source reference (`ADMIN` or `EDITOR`).
  - `GET /api/v1/admin/sources/:id`: Get single source.
  - `PATCH /api/v1/admin/sources/:id`: Update source reference (`ADMIN` or `EDITOR`).
  - `DELETE /api/v1/admin/sources/:id`: Delete source reference (`ADMIN` only).
