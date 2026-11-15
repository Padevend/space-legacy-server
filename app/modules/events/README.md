# Events Module

## Purpose
Manages NASA timeline events (launches, landings, flybys, deployments, communications, mission milestones) and their associations with equipment, locations, and personnel.

## Owned Models
- `Event`
- `EventEquipment`
- `EventLocation`
- `EventPerson`

## Endpoints
### Public
- `GET /api/v1/events`
- `GET /api/v1/events/:id`

### Admin
- `POST /api/v1/admin/events`
- `PUT /api/v1/admin/events/:id`
- `DELETE /api/v1/admin/events/:id`
- `POST /api/v1/admin/events/:eventId/equipment/:equipmentId`
- `DELETE /api/v1/admin/events/:eventId/equipment/:equipmentId`
- `POST /api/v1/admin/events/:eventId/locations/:locationId`
- `DELETE /api/v1/admin/events/:eventId/locations/:locationId`
- `POST /api/v1/admin/events/:eventId/people/:personId`
- `DELETE /api/v1/admin/events/:eventId/people/:personId`
