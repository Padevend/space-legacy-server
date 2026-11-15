# SPACE LEGACY API Route Map

Auto-generated route registry of all active HTTP endpoints.

| Method | Path | Module | Name | Auth | Role | Rate Limit | Summary |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/archives` | `archives` | `admin.archives.index` | user | EDITOR | admin | List raw scraped archive records |
| `POST` | `/api/v1/admin/archives` | `archives` | `admin.archives.store` | user | EDITOR | admin | Create raw archive record |
| `DELETE` | `/api/v1/admin/archives/:archiveId/equipment/:equipmentId` | `archives` | `admin.archives.unlinkEquipment` | user | EDITOR | admin | Unlink archive from equipment |
| `POST` | `/api/v1/admin/archives/:archiveId/equipment/:equipmentId` | `archives` | `admin.archives.linkEquipment` | user | EDITOR | admin | Link archive to equipment |
| `DELETE` | `/api/v1/admin/archives/:archiveId/events/:eventId` | `archives` | `admin.archives.unlinkEvent` | user | EDITOR | admin | Unlink archive from event |
| `POST` | `/api/v1/admin/archives/:archiveId/events/:eventId` | `archives` | `admin.archives.linkEvent` | user | EDITOR | admin | Link archive to event |
| `DELETE` | `/api/v1/admin/archives/:archiveId/missions/:missionId` | `archives` | `admin.archives.unlinkMission` | user | EDITOR | admin | Unlink archive from mission |
| `POST` | `/api/v1/admin/archives/:archiveId/missions/:missionId` | `archives` | `admin.archives.linkMission` | user | EDITOR | admin | Link archive to mission |
| `DELETE` | `/api/v1/admin/archives/:archiveId/sources/:sourceId` | `archives` | `admin.archives.unlinkSource` | user | EDITOR | admin | Unlink archive from source |
| `POST` | `/api/v1/admin/archives/:archiveId/sources/:sourceId` | `archives` | `admin.archives.linkSource` | user | EDITOR | admin | Link archive to source |
| `DELETE` | `/api/v1/admin/archives/:id` | `archives` | `admin.archives.destroy` | user | EDITOR | admin | Delete raw archive record |
| `GET` | `/api/v1/admin/archives/:id` | `archives` | `admin.archives.show` | user | EDITOR | admin | Get single raw archive record by UUID |
| `GET` | `/api/v1/admin/audit-logs` | `audit` | `admin.auditLogs.index` | user | ADMIN | admin | List system audit logs |
| `POST` | `/api/v1/admin/celestial-bodies` | `celestial_bodies` | `admin.celestialBodies.store` | user | EDITOR | admin | Create a new celestial body |
| `DELETE` | `/api/v1/admin/celestial-bodies/:id` | `celestial_bodies` | `admin.celestialBodies.destroy` | user | EDITOR | admin | Delete a celestial body |
| `PATCH` | `/api/v1/admin/celestial-bodies/:id` | `celestial_bodies` | `admin.celestialBodies.patch` | user | EDITOR | admin | Update an existing celestial body |
| `PUT` | `/api/v1/admin/celestial-bodies/:id` | `celestial_bodies` | `admin.celestialBodies.update` | user | EDITOR | admin | Update an existing celestial body |
| `GET` | `/api/v1/admin/dashboard` | `dashboard` | `admin.dashboard.stats` | user | EDITOR | admin | Back-office dashboard aggregate counters and editorial metrics |
| `POST` | `/api/v1/admin/equipment` | `equipment` | `admin.equipment.store` | user | EDITOR | admin | Create a new equipment item |
| `POST` | `/api/v1/admin/equipment/:equipmentId/locations` | `locations` | `admin.locations.linkEquipment` | user | EDITOR | admin | Link equipment to a surface or orbital location |
| `DELETE` | `/api/v1/admin/equipment/:equipmentId/locations/:locationId` | `locations` | `admin.locations.unlinkEquipment` | user | EDITOR | admin | Unlink equipment from a location |
| `PUT` | `/api/v1/admin/equipment/:equipmentId/locations/:locationId` | `locations` | `admin.locations.linkEquipmentPut` | user | EDITOR | admin | Link equipment to a surface or orbital location |
| `DELETE` | `/api/v1/admin/equipment/:equipmentId/missions/:missionId` | `missions` | `admin.missions.unlinkEquipmentInverse` | user | EDITOR | admin | Unlink equipment from mission |
| `PUT` | `/api/v1/admin/equipment/:equipmentId/missions/:missionId` | `missions` | `admin.missions.linkEquipmentInversePut` | user | EDITOR | admin | Link equipment to mission with participation role |
| `DELETE` | `/api/v1/admin/equipment/:equipmentId/people/:personId` | `equipment` | `admin.equipment.unlinkPerson` | user | EDITOR | admin | Unlink person from equipment |
| `POST` | `/api/v1/admin/equipment/:equipmentId/people/:personId` | `equipment` | `admin.equipment.linkPerson` | user | EDITOR | admin | Link person to equipment with optional role |
| `PUT` | `/api/v1/admin/equipment/:equipmentId/people/:personId` | `equipment` | `admin.equipment.linkPersonPut` | user | EDITOR | admin | Link person to equipment with optional role |
| `POST` | `/api/v1/admin/equipment/:equipmentId/sources` | `sources` | `admin.sources.linkEquipment` | user | EDITOR | admin | Link equipment to source with claim description |
| `DELETE` | `/api/v1/admin/equipment/:equipmentId/sources/:sourceId` | `sources` | `admin.sources.unlinkEquipment` | user | EDITOR | admin | Unlink equipment from source |
| `PUT` | `/api/v1/admin/equipment/:equipmentId/sources/:sourceId` | `sources` | `admin.sources.linkEquipmentPut` | user | EDITOR | admin | Link equipment to source with claim description |
| `DELETE` | `/api/v1/admin/equipment/:id` | `equipment` | `admin.equipment.destroy` | user | EDITOR | admin | Delete an equipment item |
| `PATCH` | `/api/v1/admin/equipment/:id` | `equipment` | `admin.equipment.patch` | user | EDITOR | admin | Update an existing equipment item |
| `PUT` | `/api/v1/admin/equipment/:id` | `equipment` | `admin.equipment.update` | user | EDITOR | admin | Update an existing equipment item |
| `POST` | `/api/v1/admin/events` | `events` | `admin.events.store` | user | EDITOR | admin | Create a new timeline event |
| `DELETE` | `/api/v1/admin/events/:eventId/equipment/:equipmentId` | `events` | `admin.events.unlinkEquipment` | user | EDITOR | admin | Unlink equipment from event |
| `POST` | `/api/v1/admin/events/:eventId/equipment/:equipmentId` | `events` | `admin.events.linkEquipment` | user | EDITOR | admin | Link equipment to event with participation role |
| `PUT` | `/api/v1/admin/events/:eventId/equipment/:equipmentId` | `events` | `admin.events.linkEquipmentPut` | user | EDITOR | admin | Link equipment to event with participation role |
| `DELETE` | `/api/v1/admin/events/:eventId/locations/:locationId` | `events` | `admin.events.unlinkLocation` | user | EDITOR | admin | Unlink location from event |
| `POST` | `/api/v1/admin/events/:eventId/locations/:locationId` | `events` | `admin.events.linkLocation` | user | EDITOR | admin | Link location to event with location role |
| `PUT` | `/api/v1/admin/events/:eventId/locations/:locationId` | `events` | `admin.events.linkLocationPut` | user | EDITOR | admin | Link location to event with location role |
| `DELETE` | `/api/v1/admin/events/:eventId/people/:personId` | `events` | `admin.events.unlinkPerson` | user | EDITOR | admin | Unlink person from event |
| `POST` | `/api/v1/admin/events/:eventId/people/:personId` | `events` | `admin.events.linkPerson` | user | EDITOR | admin | Link person to event with event role |
| `PUT` | `/api/v1/admin/events/:eventId/people/:personId` | `events` | `admin.events.linkPersonPut` | user | EDITOR | admin | Link person to event with event role |
| `POST` | `/api/v1/admin/events/:eventId/sources` | `sources` | `admin.sources.linkEvent` | user | EDITOR | admin | Link event to source with claim description |
| `DELETE` | `/api/v1/admin/events/:eventId/sources/:sourceId` | `sources` | `admin.sources.unlinkEvent` | user | EDITOR | admin | Unlink event from source |
| `PUT` | `/api/v1/admin/events/:eventId/sources/:sourceId` | `sources` | `admin.sources.linkEventPut` | user | EDITOR | admin | Link event to source with claim description |
| `DELETE` | `/api/v1/admin/events/:id` | `events` | `admin.events.destroy` | user | EDITOR | admin | Delete a timeline event |
| `PATCH` | `/api/v1/admin/events/:id` | `events` | `admin.events.patch` | user | EDITOR | admin | Update an existing timeline event |
| `PUT` | `/api/v1/admin/events/:id` | `events` | `admin.events.update` | user | EDITOR | admin | Update an existing timeline event |
| `POST` | `/api/v1/admin/ingest` | `ingestion` | `admin.ingest.trigger` | user | EDITOR | admin | Trigger bulk bundle ingestion into PostgreSQL |
| `GET` | `/api/v1/admin/ingest/runs` | `ingestion` | `admin.ingest.runs.index` | user | EDITOR | admin | List data ingestion runs |
| `GET` | `/api/v1/admin/ingest/runs/:id` | `ingestion` | `admin.ingest.runs.show` | user | EDITOR | admin | Get single data ingestion run details |
| `POST` | `/api/v1/admin/locations` | `locations` | `admin.locations.store` | user | EDITOR | admin | Create a new location |
| `DELETE` | `/api/v1/admin/locations/:id` | `locations` | `admin.locations.destroy` | user | EDITOR | admin | Delete a location |
| `PATCH` | `/api/v1/admin/locations/:id` | `locations` | `admin.locations.patch` | user | EDITOR | admin | Update an existing location |
| `PUT` | `/api/v1/admin/locations/:id` | `locations` | `admin.locations.update` | user | EDITOR | admin | Update an existing location |
| `POST` | `/api/v1/admin/measurements` | `measurements` | `admin.measurements.store` | user | EDITOR | admin | Create a new scientific measurement |
| `DELETE` | `/api/v1/admin/measurements/:id` | `measurements` | `admin.measurements.destroy` | user | EDITOR | admin | Delete a scientific measurement |
| `PATCH` | `/api/v1/admin/measurements/:id` | `measurements` | `admin.measurements.patch` | user | EDITOR | admin | Update an existing scientific measurement |
| `PUT` | `/api/v1/admin/measurements/:id` | `measurements` | `admin.measurements.update` | user | EDITOR | admin | Update an existing scientific measurement |
| `POST` | `/api/v1/admin/measurements/:measurementId/sources` | `sources` | `admin.sources.linkMeasurement` | user | EDITOR | admin | Link measurement to source with claim description |
| `DELETE` | `/api/v1/admin/measurements/:measurementId/sources/:sourceId` | `sources` | `admin.sources.unlinkMeasurement` | user | EDITOR | admin | Unlink measurement from source |
| `PUT` | `/api/v1/admin/measurements/:measurementId/sources/:sourceId` | `sources` | `admin.sources.linkMeasurementPut` | user | EDITOR | admin | Link measurement to source with claim description |
| `POST` | `/api/v1/admin/media` | `media` | `admin.media.store` | user | EDITOR | admin | Create a new media asset with provenance metadata |
| `DELETE` | `/api/v1/admin/media/:id` | `media` | `admin.media.destroy` | user | EDITOR | admin | Delete a media asset |
| `PATCH` | `/api/v1/admin/media/:id` | `media` | `admin.media.patch` | user | EDITOR | admin | Update an existing media asset |
| `PUT` | `/api/v1/admin/media/:id` | `media` | `admin.media.update` | user | EDITOR | admin | Update an existing media asset |
| `DELETE` | `/api/v1/admin/media/:mediaId/equipment/:equipmentId` | `media` | `admin.media.unlinkEquipment` | user | EDITOR | admin | Unlink equipment from media |
| `POST` | `/api/v1/admin/media/:mediaId/equipment/:equipmentId` | `media` | `admin.media.linkEquipment` | user | EDITOR | admin | Link equipment to media with representation type |
| `PUT` | `/api/v1/admin/media/:mediaId/equipment/:equipmentId` | `media` | `admin.media.linkEquipmentPut` | user | EDITOR | admin | Link equipment to media with representation type |
| `POST` | `/api/v1/admin/missions` | `missions` | `admin.missions.store` | user | EDITOR | admin | Create a new space mission |
| `DELETE` | `/api/v1/admin/missions/:id` | `missions` | `admin.missions.destroy` | user | EDITOR | admin | Delete a mission |
| `PATCH` | `/api/v1/admin/missions/:id` | `missions` | `admin.missions.patch` | user | EDITOR | admin | Update an existing mission |
| `PUT` | `/api/v1/admin/missions/:id` | `missions` | `admin.missions.update` | user | EDITOR | admin | Update an existing mission |
| `DELETE` | `/api/v1/admin/missions/:missionId/equipment/:equipmentId` | `missions` | `admin.missions.unlinkEquipment` | user | EDITOR | admin | Unlink equipment from mission |
| `POST` | `/api/v1/admin/missions/:missionId/equipment/:equipmentId` | `missions` | `admin.missions.linkEquipment` | user | EDITOR | admin | Link equipment to mission with participation role |
| `PUT` | `/api/v1/admin/missions/:missionId/equipment/:equipmentId` | `missions` | `admin.missions.linkEquipmentPut` | user | EDITOR | admin | Link equipment to mission with participation role |
| `DELETE` | `/api/v1/admin/missions/:missionId/people/:personId` | `missions` | `admin.missions.unlinkPerson` | user | EDITOR | admin | Unlink personnel from mission |
| `POST` | `/api/v1/admin/missions/:missionId/people/:personId` | `missions` | `admin.missions.linkPerson` | user | EDITOR | admin | Link personnel to mission with mission role |
| `PUT` | `/api/v1/admin/missions/:missionId/people/:personId` | `missions` | `admin.missions.linkPersonPut` | user | EDITOR | admin | Link personnel to mission with mission role |
| `POST` | `/api/v1/admin/missions/:missionId/sources` | `sources` | `admin.sources.linkMission` | user | EDITOR | admin | Link mission to source with claim description |
| `DELETE` | `/api/v1/admin/missions/:missionId/sources/:sourceId` | `sources` | `admin.sources.unlinkMission` | user | EDITOR | admin | Unlink mission from source |
| `PUT` | `/api/v1/admin/missions/:missionId/sources/:sourceId` | `sources` | `admin.sources.linkMissionPut` | user | EDITOR | admin | Link mission to source with claim description |
| `POST` | `/api/v1/admin/people` | `people` | `admin.people.store` | user | EDITOR | admin | Create a new person record |
| `DELETE` | `/api/v1/admin/people/:id` | `people` | `admin.people.destroy` | user | EDITOR | admin | Delete a person record |
| `PATCH` | `/api/v1/admin/people/:id` | `people` | `admin.people.patch` | user | EDITOR | admin | Update an existing person record |
| `PUT` | `/api/v1/admin/people/:id` | `people` | `admin.people.update` | user | EDITOR | admin | Update an existing person record |
| `POST` | `/api/v1/admin/sources` | `sources` | `admin.sources.store` | user | EDITOR | admin | Create a new bibliographic source |
| `DELETE` | `/api/v1/admin/sources/:id` | `sources` | `admin.sources.destroy` | user | EDITOR | admin | Delete a source |
| `PATCH` | `/api/v1/admin/sources/:id` | `sources` | `admin.sources.patch` | user | EDITOR | admin | Update an existing source |
| `PUT` | `/api/v1/admin/sources/:id` | `sources` | `admin.sources.update` | user | EDITOR | admin | Update an existing source |
| `GET` | `/api/v1/admin/stories` | `stories` | `admin.stories.index` | user | EDITOR | admin | List all stories across all publication states |
| `POST` | `/api/v1/admin/stories` | `stories` | `admin.stories.store` | user | EDITOR | admin | Create a new draft story |
| `DELETE` | `/api/v1/admin/stories/:id` | `stories` | `admin.stories.destroy` | user | EDITOR | admin | Delete a story |
| `PUT` | `/api/v1/admin/stories/:id` | `stories` | `admin.stories.update` | user | EDITOR | admin | Update an existing story |
| `POST` | `/api/v1/admin/stories/:id/transition` | `stories` | `admin.stories.transition` | user | EDITOR | admin | Transition story publication state (DRAFT -> REVIEW -> PUBLISHED / ARCHIVED) |
| `POST` | `/api/v1/admin/stories/:id/transitions` | `stories` | `admin.stories.transitions` | user | EDITOR | admin | Transition story publication state (DRAFT -> REVIEW -> PUBLISHED / ARCHIVED) |
| `GET` | `/api/v1/admin/stories/:idOrSlug` | `stories` | `admin.stories.show` | user | EDITOR | admin | Get single story by UUID or slug regardless of publication state |
| `DELETE` | `/api/v1/admin/stories/:storyId/equipment/:equipmentId` | `stories` | `admin.stories.unlinkEquipment` | user | EDITOR | admin | Unlink equipment from story |
| `POST` | `/api/v1/admin/stories/:storyId/equipment/:equipmentId` | `stories` | `admin.stories.linkEquipment` | user | EDITOR | admin | Link equipment to story with narrative role |
| `PUT` | `/api/v1/admin/stories/:storyId/equipment/:equipmentId` | `stories` | `admin.stories.linkEquipmentPut` | user | EDITOR | admin | Link equipment to story with narrative role |
| `DELETE` | `/api/v1/admin/stories/:storyId/events/:eventId` | `stories` | `admin.stories.unlinkEvent` | user | EDITOR | admin | Unlink event from story |
| `POST` | `/api/v1/admin/stories/:storyId/events/:eventId` | `stories` | `admin.stories.linkEvent` | user | EDITOR | admin | Link event to story |
| `PUT` | `/api/v1/admin/stories/:storyId/events/:eventId` | `stories` | `admin.stories.linkEventPut` | user | EDITOR | admin | Link event to story |
| `DELETE` | `/api/v1/admin/stories/:storyId/media/:mediaId` | `stories` | `admin.stories.unlinkMedia` | user | EDITOR | admin | Unlink media from story |
| `POST` | `/api/v1/admin/stories/:storyId/media/:mediaId` | `stories` | `admin.stories.linkMedia` | user | EDITOR | admin | Link media to story with caption override |
| `PUT` | `/api/v1/admin/stories/:storyId/media/:mediaId` | `stories` | `admin.stories.linkMediaPut` | user | EDITOR | admin | Link media to story with caption override |
| `DELETE` | `/api/v1/admin/stories/:storyId/missions/:missionId` | `stories` | `admin.stories.unlinkMission` | user | EDITOR | admin | Unlink mission from story |
| `POST` | `/api/v1/admin/stories/:storyId/missions/:missionId` | `stories` | `admin.stories.linkMission` | user | EDITOR | admin | Link mission to story |
| `PUT` | `/api/v1/admin/stories/:storyId/missions/:missionId` | `stories` | `admin.stories.linkMissionPut` | user | EDITOR | admin | Link mission to story |
| `DELETE` | `/api/v1/admin/stories/:storyId/sources/:sourceId` | `stories` | `admin.stories.unlinkSource` | user | EDITOR | admin | Unlink source from story |
| `POST` | `/api/v1/admin/stories/:storyId/sources/:sourceId` | `stories` | `admin.stories.linkSource` | user | EDITOR | admin | Link source to story with claim citation |
| `PUT` | `/api/v1/admin/stories/:storyId/sources/:sourceId` | `stories` | `admin.stories.linkSourcePut` | user | EDITOR | admin | Link source to story with claim citation |
| `GET` | `/api/v1/admin/users` | `auth` | `admin.users.index` | user | ADMIN | admin | List user accounts |
| `POST` | `/api/v1/admin/users` | `auth` | `admin.users.store` | user | ADMIN | admin | Create user account |
| `DELETE` | `/api/v1/admin/users/:id` | `auth` | `admin.users.destroy` | user | ADMIN | admin | Delete user account |
| `GET` | `/api/v1/admin/users/:id` | `auth` | `admin.users.show` | user | ADMIN | admin | Get user account |
| `PATCH` | `/api/v1/admin/users/:id` | `auth` | `admin.users.patch` | user | ADMIN | admin | Patch user account |
| `PUT` | `/api/v1/admin/users/:id` | `auth` | `admin.users.update` | user | ADMIN | admin | Update user account |
| `POST` | `/api/v1/auth/change-password` | `auth` | `auth.changePassword` | user | EDITOR | admin | Change authenticated user password |
| `POST` | `/api/v1/auth/login` | `auth` | `auth.login` | public | - | login | Authenticate with email and password |
| `POST` | `/api/v1/auth/logout` | `auth` | `auth.logout` | public | - | publicRead | Revoke active refresh token session |
| `GET` | `/api/v1/auth/me` | `auth` | `auth.me` | user | EDITOR | admin | Get authenticated user profile |
| `POST` | `/api/v1/auth/refresh` | `auth` | `auth.refresh` | public | - | publicRead | Rotate refresh token and issue new access token |
| `GET` | `/api/v1/catalog/destinations` | `catalog` | `catalog.destinations` | public | - | publicRead | Explore destinations across celestial bodies with equipment and mission counters |
| `GET` | `/api/v1/catalog/equipment/:idOrSlug` | `catalog` | `catalog.equipment.detail` | public | - | publicRead | Full composite view of a space equipment item with coordinates, events and media |
| `GET` | `/api/v1/catalog/feed` | `catalog` | `catalog.feed` | public | - | publicRead | Composed educational home feed with featured stories, events and highlight equipment |
| `GET` | `/api/v1/celestial-bodies` | `celestial_bodies` | `celestialBodies.index` | public | - | publicRead | List celestial bodies with pagination and filtering |
| `GET` | `/api/v1/celestial-bodies/:id` | `celestial_bodies` | `celestialBodies.show` | public | - | publicRead | Get a celestial body by UUID |
| `GET` | `/api/v1/equipment` | `equipment` | `equipment.index` | public | - | publicRead | List NASA equipment left in space with pagination and filtering |
| `GET` | `/api/v1/equipment/:idOrSlug` | `equipment` | `equipment.show` | public | - | publicRead | Get single equipment by UUID or slug with optional includes (parent, children, people) |
| `GET` | `/api/v1/equipment/:idOrSlug/children` | `equipment` | `equipment.children` | public | - | publicRead | Get equipment children (sub-assemblies) |
| `GET` | `/api/v1/equipment/:idOrSlug/locations` | `locations` | `locations.equipmentLocations` | public | - | publicRead | Get equipment locations |
| `GET` | `/api/v1/events` | `events` | `events.index` | public | - | publicRead | List historical space exploration events with pagination and filtering |
| `GET` | `/api/v1/events/:id` | `events` | `events.show` | public | - | publicRead | Get single event by UUID with optional includes (mission, equipment, locations, people, sources) |
| `GET` | `/api/v1/health/live` | `health` | `health.live` | public | - | publicRead | Process Liveness Probe |
| `GET` | `/api/v1/health/ready` | `health` | `health.ready` | public | - | publicRead | System Readiness Probe |
| `GET` | `/api/v1/locations` | `locations` | `locations.index` | public | - | publicRead | List geographic locations with pagination and filtering |
| `GET` | `/api/v1/locations/:id` | `locations` | `locations.show` | public | - | publicRead | Get a location by UUID |
| `GET` | `/api/v1/measurements` | `measurements` | `measurements.index` | public | - | publicRead | List scientific measurements and physical dimensions with filtering |
| `GET` | `/api/v1/measurements/:id` | `measurements` | `measurements.show` | public | - | publicRead | Get single measurement by UUID with optional includes (equipment, event, sources) |
| `GET` | `/api/v1/media` | `media` | `media.index` | public | - | publicRead | List visual and audio media assets with filtering and pagination |
| `GET` | `/api/v1/media/:id` | `media` | `media.show` | public | - | publicRead | Get single media asset by UUID with optional includes (equipments, stories) |
| `GET` | `/api/v1/missions` | `missions` | `missions.index` | public | - | publicRead | List NASA space missions with pagination and filtering |
| `GET` | `/api/v1/missions/:idOrSlug` | `missions` | `missions.show` | public | - | publicRead | Get single mission by UUID or slug with optional includes |
| `GET` | `/api/v1/people` | `people` | `people.index` | public | - | publicRead | List historical people, astronauts, and engineers |
| `GET` | `/api/v1/people/:id` | `people` | `people.show` | public | - | publicRead | Get a person by UUID |
| `GET` | `/api/v1/sources` | `sources` | `sources.index` | public | - | publicRead | List bibliographic reference sources |
| `GET` | `/api/v1/sources/:id` | `sources` | `sources.show` | public | - | publicRead | Get a source by UUID |
| `GET` | `/api/v1/stories` | `stories` | `stories.index` | public | - | publicRead | List published educational stories and articles |
| `GET` | `/api/v1/stories/:idOrSlug` | `stories` | `stories.show` | public | - | publicRead | Get single published story by UUID or slug with optional includes (missions, equipments, events, media, sources) |
| `GET` | `/health/live` | `health` | `health.root_live` | public | - | publicRead | GET /health/live |
| `GET` | `/health/ready` | `health` | `health.root_ready` | public | - | publicRead | GET /health/ready |
