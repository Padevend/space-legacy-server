# ADR-006: Core Domain, Hierarchy Cycles, and Relation Management

## Status
Accepted

## Context
Stage 4 implements the core domain of the SPACE LEGACY system: `missions`, `equipment`, `events`, and `measurements`.
These models possess complex inter-relationships:
1. `Equipment` is self-referential (`parentEquipmentId`), modeling hierarchical sub-assemblies (e.g. Apollo Lunar Module -> Lunar Module Ascent Stage -> Communication Antenna). An equipment must never become its own ancestor, which would create an infinite cycle in tree traversals.
2. `Mission` and `Equipment` are primary user-facing concepts that require SEO-friendly and user-friendly slug lookups alongside standard UUID lookups (`:idOrSlug`).
3. `Measurement` values are defined as `Decimal(24, 8)`. Converting large high-precision decimals into IEEE 754 floating-point numbers leads to precision loss, while geospatial coordinates (`latitude`, `longitude`, `altitude`) need to be usable by frontend mapping engines (e.g., Mapbox, Cesium, Leaflet).
4. Relational associations between domain models (e.g. `MissionEquipment`, `EventEquipment`, `EquipmentLocation`, `EquipmentPerson`, `EquipmentSource`, `EventLocation`, `EventPerson`, `EventSource`, `MeasurementSource`) carry their own metadata fields (roles, descriptions, precision, dates) that must be managed cleanly via consistent RESTful endpoints.
5. In order to prevent expensive database denial-of-service queries, eager loading through `include` query parameters must be strictly capped and validated.

## Decisions

### 1. Hierarchy Cycle Prevention
- When setting or updating `parentEquipmentId` for an `Equipment`:
  - If `parentEquipmentId === equipmentId`, reject immediately with `422 UNPROCESSABLE_ENTITY` ("Equipment cannot be its own parent").
  - Perform an iterative ancestor walk starting from the proposed `parentEquipmentId` up the chain to the root. If the target `equipmentId` is encountered in the ancestor chain, reject immediately with `422 UNPROCESSABLE_ENTITY` ("Hierarchy cycle detected: equipment cannot be an ancestor of its parent").
  - The traversal has a maximum safety depth of 50 levels to prevent infinite loops even in corrupted test states.

### 2. Identifier Resolution (`:idOrSlug`)
- Public endpoints `/api/v1/missions/:idOrSlug` and `/api/v1/equipment/:idOrSlug` inspect the route parameter:
  - If the parameter matches standard UUID v4 format (`/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i`), lookup is executed against the primary key `missionId` or `equipmentId`.
  - Otherwise, lookup is executed against the unique indexed `slug` column.
  - If not found by either key, return standard `404 NOT_FOUND`.

### 3. Precision and Type Serialization
- `latitude`, `longitude`, and `altitude` (from `Location` and `EquipmentLocation`) are parsed and serialized as IEEE-754 **numbers** (or `null`) for direct frontend mapping.
- `Measurement.value` and `Measurement.uncertainty` are preserved and serialized strictly as **strings** (e.g. `"1420.40575176"`) to maintain scientific precision.
- `Event.eventDate` is formatted as ISO `YYYY-MM-DD` string; `Event.eventTime` as `HH:mm:ss`.

### 4. Relation Endpoints Pattern
- To link domain entities and provide associated metadata:
  - `PUT /api/v1/admin/equipment/:id/missions/:missionId` with body `{ missionRole: string, participationDescription?: string }`
  - `DELETE /api/v1/admin/equipment/:id/missions/:missionId`
  - `PUT /api/v1/admin/equipment/:id/people/:personId` with body `{ roleInEquipment: string }`
  - `DELETE /api/v1/admin/equipment/:id/people/:personId`
  - `PUT /api/v1/admin/equipment/:id/sources/:sourceId` with body `{ claimDescription?: string }`
  - `DELETE /api/v1/admin/equipment/:id/sources/:sourceId`
  - `PUT /api/v1/admin/equipment/:id/locations/:locationId` with body `{ startDate?: string, endDate?: string, locationPrecision?: DatePrecision }`
  - `DELETE /api/v1/admin/equipment/:id/locations/:equipmentLocationId`
  - Identical consistent patterns for `missions`, `events`, and `measurements` associations.

### 5. Include Whitelisting and Depth Capping
- The `include` parameter on list and detail endpoints parses a comma-separated list of whitelisted relation names (e.g., `missions`, `locations`, `events`, `sources`).
- Hard limits:
  - At most **3** relation keys may be requested simultaneously.
  - Nested inclusion beyond depth 1 (e.g., `equipment.missions.people`) is strictly forbidden and rejected with `422 UNPROCESSABLE_ENTITY`.
  - Each nested relation list is bounded to at most 50 items.

## Consequences
- Prevents database deadlocks and graph cycle bugs in recursive equipment sub-assemblies.
- Enables rich, flexible frontend lookups by either human-readable slug or stable UUID.
- Completely prevents precision loss in NASA scientific measurement data.
- Standardizes relational management across all admin APIs.
