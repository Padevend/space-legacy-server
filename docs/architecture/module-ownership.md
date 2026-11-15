# Module Table Ownership Matrix

As established by Section 2.4 of the v3 refoundation brief, **every Prisma model is strictly owned by exactly one module**. A repository may only query the tables owned by its module. Foreign keys to other modules are treated as plain identifiers, and database integrity is enforced by PostgreSQL foreign key constraints.

---

## 1. Ownership Table

| Prisma Model | Owner Module | Rationale / Rules |
|---|---|---|
| `Mission` | `missions` | Core mission campaigns & flights |
| `Equipment` | `equipment` | Equipment entities and self-referential hierarchy |
| `Event` | `events` | Mission timeline events |
| `CelestialBody` | `celestial_bodies` | Stars, planets, moons, asteroids |
| `Location` | `locations` | Planetary landing/surface coordinates |
| `Person` | `people` | Astronauts, scientists, engineers |
| `Source` | `sources` | Verifying bibliography & reference sources |
| `Archive` | `archives` | Raw scraped archive records (strictly internal) |
| `Story` | `stories` | Editorial narratives & publication workflow |
| `Media` | `media` | Visual and audio assets with AI provenance tracking |
| `Measurement` | `measurements` | Scientific telemetry & physical dimensions |
| `User` | `auth` | Back-office administrator & editor accounts |
| `RefreshToken` | `auth` | Authentication session token family rotation |
| `AuditLog` | `audit` | Immutable security & mutation audit trail |
| `IngestionRun` | `ingestion` | Bulk data integration execution records |

---

## 2. Join Tables Ownership

Join tables belong to the module whose entity is returned or governed by the relation:

| Join Table Model | Owner Module | Ownership Reason |
|---|---|---|
| `MissionEquipment` | `missions` | Mission participation role |
| `MissionPerson` | `missions` | Mission personnel role |
| `MissionSource` | `sources` | Bibliography link carrying `claimDescription` |
| `ArchiveMission` | `archives` | Raw archive association |
| `EventEquipment` | `events` | Equipment involvement in timeline milestone |
| `EquipmentLocation` | `locations` | Spatial location association with temporal bounds |
| `EquipmentPerson` | `equipment` | Personnel association with equipment |
| `EquipmentSource` | `sources` | Source link carrying `claimDescription` |
| `ArchiveEquipment` | `archives` | Raw archive association |
| `EventLocation` | `events` | Event occurrence location |
| `EventPerson` | `events` | Participant role in timeline event |
| `EventSource` | `sources` | Source link carrying `claimDescription` |
| `ArchiveEvent` | `archives` | Raw archive association |
| `ArchiveSource` | `archives` | Raw archive association |
| `StoryMission` | `stories` | Story narrative link to mission |
| `StoryEquipment` | `stories` | Story narrative link to equipment with `narrativeRole` |
| `StoryEvent` | `stories` | Story narrative link to event |
| `StoryMedia` | `stories` | Story narrative link to media with `captionOverride` |
| `StorySource` | `stories` | Story narrative citation link |
| `EquipmentMedia` | `media` | Visual representation of equipment (`representationType`) |
| `MeasurementSource` | `sources` | Source link carrying `claimDescription` |

---

## 3. Query Modules (No Table Ownership)

- `catalog`: Read-only projections combining equipment, timeline events, locations, celestial bodies, and media.
- `dashboard`: Read-only aggregation counters for back-office overview.
