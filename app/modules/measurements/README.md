# Measurements Module

## Purpose
Manages scientific telemetry and physical dimensions (mass, distance, duration, temperature, frequency, speed, force, pressure, power, voltage) recorded by or describing NASA space equipment and events.

## Owned Models
- `Measurement`

## Endpoints
### Public
- `GET /api/v1/measurements`
- `GET /api/v1/measurements/:id`

### Admin
- `POST /api/v1/admin/measurements`
- `PUT /api/v1/admin/measurements/:id`
- `DELETE /api/v1/admin/measurements/:id`
