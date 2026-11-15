# Missions Module

## Purpose
Manages NASA space exploration missions (Apollo, Opportunity, Viking, Ingenuity, Surveyor, etc.) and their personnel and participating equipment associations.

## Owned Models
- `Mission`
- `MissionEquipment`
- `MissionPerson`

## Endpoints
### Public
- `GET /api/v1/missions`
- `GET /api/v1/missions/:idOrSlug`

### Admin
- `POST /api/v1/admin/missions`
- `PUT /api/v1/admin/missions/:id`
- `DELETE /api/v1/admin/missions/:id`
- `POST /api/v1/admin/missions/:missionId/equipment/:equipmentId`
- `DELETE /api/v1/admin/missions/:missionId/equipment/:equipmentId`
- `POST /api/v1/admin/missions/:missionId/people/:personId`
- `DELETE /api/v1/admin/missions/:missionId/people/:personId`
