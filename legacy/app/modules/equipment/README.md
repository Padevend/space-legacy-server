# Equipment Module

## Purpose
Manages NASA equipment items left on celestial bodies or deep space (rovers, landers, modules, stages, instruments, components, artifacts), their self-referencing hierarchy (parent/children with cycle prevention), and personnel associations.

## Owned Models
- `Equipment`
- `EquipmentPerson`

## Endpoints
### Public
- `GET /api/v1/equipment`
- `GET /api/v1/equipment/:idOrSlug`

### Admin
- `POST /api/v1/admin/equipment`
- `PUT /api/v1/admin/equipment/:id`
- `DELETE /api/v1/admin/equipment/:id`
- `POST /api/v1/admin/equipment/:equipmentId/people/:personId`
- `DELETE /api/v1/admin/equipment/:equipmentId/people/:personId`
