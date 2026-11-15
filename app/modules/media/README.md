# Media Module

## Purpose
Manages visual and audio media assets (photos, video, audio, 3D models, documents, animations) with mandatory provenance tracking, AI generation labeling, and equipment association.

## Owned Models
- `Media`
- `EquipmentMedia`

## Endpoints
### Public
- `GET /api/v1/media`
- `GET /api/v1/media/:id`

### Admin
- `POST /api/v1/admin/media`
- `PUT /api/v1/admin/media/:id`
- `DELETE /api/v1/admin/media/:id`
- `POST /api/v1/admin/media/:mediaId/equipment/:equipmentId`
- `DELETE /api/v1/admin/media/:mediaId/equipment/:equipmentId`
