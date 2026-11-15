# Celestial Body Entity Contract

The `CelestialBody` entity represents astronomical bodies (e.g. Moon, Mars) where missions and equipment are located or operated.

## 1. Natural Keys & Constraints
- `name` is unique in the database (`Moon`, `Mars`, etc.).
- Linked to `Location` records via foreign key relationship.
- Deleting a celestial body that has linked locations is blocked with `409 CONFLICT`.

## 2. Endpoints
- Public:
  - `GET /api/v1/celestial-bodies`: List celestial bodies with pagination, search, and bodyType filter.
  - `GET /api/v1/celestial-bodies/:id`: Get single celestial body by UUID.
- Admin:
  - `GET /api/v1/admin/celestial-bodies`: Admin listing.
  - `POST /api/v1/admin/celestial-bodies`: Create celestial body (`ADMIN` or `EDITOR`).
  - `GET /api/v1/admin/celestial-bodies/:id`: Get by ID.
  - `PATCH /api/v1/admin/celestial-bodies/:id`: Update celestial body (`ADMIN` or `EDITOR`).
  - `DELETE /api/v1/admin/celestial-bodies/:id`: Delete celestial body (`ADMIN` only).
