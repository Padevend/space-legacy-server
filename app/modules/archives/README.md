# Archives Module

## Purpose
Manages raw scraped archival records (NASA archive JSON, historical mission manifests, provider payloads) and internal traceability associations with missions, equipment, events, and sources. Strictly internal/admin only; no public endpoints exist.

## Owned Models
- `Archive`
- `ArchiveMission`
- `ArchiveEquipment`
- `ArchiveEvent`
- `ArchiveSource`

## Endpoints
### Public
- None (strictly internal)

### Admin
- `GET /api/v1/admin/archives`
- `GET /api/v1/admin/archives/:id`
- `POST /api/v1/admin/archives`
- `DELETE /api/v1/admin/archives/:id`
- `POST /api/v1/admin/archives/:archiveId/missions/:missionId`
- `DELETE /api/v1/admin/archives/:archiveId/missions/:missionId`
- `POST /api/v1/admin/archives/:archiveId/equipment/:equipmentId`
- `DELETE /api/v1/admin/archives/:archiveId/equipment/:equipmentId`
- `POST /api/v1/admin/archives/:archiveId/events/:eventId`
- `DELETE /api/v1/admin/archives/:archiveId/events/:eventId`
- `POST /api/v1/admin/archives/:archiveId/sources/:sourceId`
- `DELETE /api/v1/admin/archives/:archiveId/sources/:sourceId`
