# Sources Module

## Purpose
Manages bibliographic and documentary sources (academic papers, official reports, NASA webpages, telemetry datasets, books) that provide rigorous citation and traceability for all space legacy claims.

## Owned Models
- `Source`
- `MissionSource`
- `EquipmentSource`
- `EventSource`
- `MeasurementSource`

## Endpoints
### Public
- `GET /api/v1/sources`
- `GET /api/v1/sources/:id`

### Admin
- `POST /api/v1/admin/sources`
- `PUT /api/v1/admin/sources/:id`
- `DELETE /api/v1/admin/sources/:id`
- `POST /api/v1/admin/equipment/:equipmentId/sources`
- `DELETE /api/v1/admin/equipment/:equipmentId/sources/:sourceId`
- `POST /api/v1/admin/missions/:missionId/sources`
- `DELETE /api/v1/admin/missions/:missionId/sources/:sourceId`
- `POST /api/v1/admin/events/:eventId/sources`
- `DELETE /api/v1/admin/events/:eventId/sources/:sourceId`
- `POST /api/v1/admin/measurements/:measurementId/sources`
- `DELETE /api/v1/admin/measurements/:measurementId/sources/:sourceId`
