# Location Entity Contract

The `Location` entity describes geographical and spatial coordinates on celestial bodies, including launch sites, surface landing sites, and planetary orbital regions.

## 1. Serialization Rules
- **Decimal Coordinates:** `latitude`, `longitude`, and `altitude` are converted from database Decimal representations to native JavaScript `number` (or `null`) to ensure seamless frontend visualization on maps and 3D globes.
- **Reference System:** Indicates spatial frames such as `IAU2000`, `WGS84`, etc.

## 2. Endpoints
- Public:
  - `GET /api/v1/locations`: List locations with pagination, search, celestialBodyId, and locationType filters.
  - `GET /api/v1/locations/:id`: Get single location details.
- Admin:
  - `GET /api/v1/admin/locations`: Admin list.
  - `POST /api/v1/admin/locations`: Create location (`ADMIN` or `EDITOR`).
  - `GET /api/v1/admin/locations/:id`: Get single location.
  - `PATCH /api/v1/admin/locations/:id`: Update location (`ADMIN` or `EDITOR`).
  - `DELETE /api/v1/admin/locations/:id`: Delete location (`ADMIN` only).
