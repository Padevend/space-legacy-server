# Catalog Module

## Purpose
Provides read-only composed projection views for the public frontend:
- Home feed combining published stories, timeline events, and highlight equipment.
- Destinations listing celestial bodies with aggregate equipment and mission counters.
- Full composite equipment details with geographic coordinates, media gallery, mission participation, and timeline events.

## Owned Models
None (read-only query projection module).

## Endpoints
### Public
- `GET /api/v1/catalog/feed`
- `GET /api/v1/catalog/destinations`
- `GET /api/v1/catalog/equipment/:idOrSlug`

### Admin
- None
