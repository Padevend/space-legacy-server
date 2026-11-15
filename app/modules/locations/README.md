# Locations Module

## Purpose
Manages planetary landing sites, crash sites, craters, facilities, and orbital locations where equipment is situated, as well as the equipment-location association.

## Owned Models
- `Location`
- `EquipmentLocation`

## Endpoints
### Public
- `GET /api/v1/locations`
- `GET /api/v1/locations/:id`

### Admin
- `POST /api/v1/admin/locations`
- `PUT /api/v1/admin/locations/:id`
- `DELETE /api/v1/admin/locations/:id`
- `POST /api/v1/admin/equipment/:equipmentId/locations`
- `DELETE /api/v1/admin/equipment/:equipmentId/locations/:locationId`
