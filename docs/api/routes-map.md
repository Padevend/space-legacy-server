# SPACE LEGACY API Route Map

Auto-generated route registry of all active HTTP endpoints.

| Method | Path | Module | Name | Auth | Role | Rate Limit | Summary |
|---|---|---|---|---|---|---|---|
| `PATCH` | `/api/v1/admin/bodies/:id` | `celestial_bodies` | `admin.bodies.update` | user | EDITOR | admin | Targeted partial PATCH update of a celestial body |
| `GET` | `/api/v1/admin/logbook` | `logbook` | `admin.logbook.index` | user | EDITOR | admin | List all logbook entries for administration |
| `POST` | `/api/v1/admin/logbook` | `logbook` | `admin.logbook.store` | user | EDITOR | admin | Create new logbook entry for a machine |
| `DELETE` | `/api/v1/admin/logbook/:id` | `logbook` | `admin.logbook.destroy` | user | EDITOR | admin | Delete a logbook entry |
| `GET` | `/api/v1/admin/logbook/:id` | `logbook` | `admin.logbook.show` | user | EDITOR | admin | Get single logbook entry by UUID |
| `PATCH` | `/api/v1/admin/logbook/:id` | `logbook` | `admin.logbook.update` | user | EDITOR | admin | Targeted partial PATCH update of a logbook entry |
| `GET` | `/api/v1/admin/machines` | `machines` | `admin.machines.index` | user | EDITOR | admin | List all machines including draft/unpublished |
| `POST` | `/api/v1/admin/machines` | `machines` | `admin.machines.store` | user | EDITOR | admin | Create new machine draft |
| `DELETE` | `/api/v1/admin/machines/:id` | `machines` | `admin.machines.destroy` | user | EDITOR | admin | Delete machine and cascade to sub-resources |
| `GET` | `/api/v1/admin/machines/:id` | `machines` | `admin.machines.show` | user | EDITOR | admin | Get full machine details by UUID for administration |
| `PATCH` | `/api/v1/admin/machines/:id` | `machines` | `admin.machines.update` | user | EDITOR | admin | Targeted partial PATCH update of a machine |
| `POST` | `/api/v1/admin/machines/:id/events` | `machines` | `admin.machines.events.store` | user | EDITOR | admin | Add a timeline event to a machine |
| `DELETE` | `/api/v1/admin/machines/:id/events/:subId` | `machines` | `admin.machines.events.destroy` | user | EDITOR | admin | Delete a timeline event |
| `PATCH` | `/api/v1/admin/machines/:id/events/:subId` | `machines` | `admin.machines.events.update` | user | EDITOR | admin | Targeted partial PATCH update of a timeline event |
| `POST` | `/api/v1/admin/machines/:id/facts` | `machines` | `admin.machines.facts.store` | user | EDITOR | admin | Add a key fact to a machine |
| `DELETE` | `/api/v1/admin/machines/:id/facts/:subId` | `machines` | `admin.machines.facts.destroy` | user | EDITOR | admin | Delete a key fact |
| `PATCH` | `/api/v1/admin/machines/:id/facts/:subId` | `machines` | `admin.machines.facts.update` | user | EDITOR | admin | Targeted partial PATCH update of a key fact |
| `POST` | `/api/v1/admin/machines/:id/images` | `machines` | `admin.machines.images.store` | user | EDITOR | admin | Add an image to a machine |
| `DELETE` | `/api/v1/admin/machines/:id/images/:subId` | `machines` | `admin.machines.images.destroy` | user | EDITOR | admin | Delete an image |
| `PATCH` | `/api/v1/admin/machines/:id/images/:subId` | `machines` | `admin.machines.images.update` | user | EDITOR | admin | Targeted partial PATCH update of an image |
| `POST` | `/api/v1/admin/machines/:id/sources` | `machines` | `admin.machines.sources.store` | user | EDITOR | admin | Add a verified source to a machine |
| `DELETE` | `/api/v1/admin/machines/:id/sources/:subId` | `machines` | `admin.machines.sources.destroy` | user | EDITOR | admin | Delete a machine source |
| `PATCH` | `/api/v1/admin/machines/:id/sources/:subId` | `machines` | `admin.machines.sources.update` | user | EDITOR | admin | Targeted partial PATCH update of a machine source |
| `GET` | `/api/v1/admin/overview` | `dashboard` | `admin.overview` | user | EDITOR | admin | Back-office administration overview counters and metrics |
| `POST` | `/api/v1/auth/login` | `identity` | `identity.login` | public | - | login | POST /api/v1/auth/login |
| `POST` | `/api/v1/auth/logout` | `identity` | `identity.logout` | public | - | publicRead | POST /api/v1/auth/logout |
| `POST` | `/api/v1/auth/register` | `identity` | `identity.register` | public | - | publicRead | POST /api/v1/auth/register |
| `GET` | `/api/v1/badges` | `games` | `games.badges_list` | public | - | publicRead | GET /api/v1/badges |
| `GET` | `/api/v1/bodies` | `celestial_bodies` | `celestial_bodies.public_list` | public | - | publicRead | GET /api/v1/bodies |
| `GET` | `/api/v1/health/live` | `health` | `health.live` | public | - | publicRead | Process Liveness Probe |
| `GET` | `/api/v1/health/ready` | `health` | `health.ready` | public | - | publicRead | System Readiness Probe |
| `GET` | `/api/v1/machines` | `machines` | `machines.public_list` | public | - | publicRead | GET /api/v1/machines |
| `GET` | `/api/v1/machines/:slug` | `machines` | `machines.public_show` | public | - | publicRead | GET /api/v1/machines/:slug |
| `GET` | `/api/v1/machines/:slug/logbook` | `logbook` | `logbook.public_list` | public | - | publicRead | GET /api/v1/machines/:slug/logbook |
| `GET` | `/api/v1/machines/:slug/logbook/:entry` | `logbook` | `logbook.public_show` | public | - | publicRead | GET /api/v1/machines/:slug/logbook/:entry |
| `DELETE` | `/api/v1/me` | `identity` | `identity.delete_account` | public | - | publicRead | DELETE /api/v1/me |
| `GET` | `/api/v1/me` | `identity` | `identity.me` | public | - | publicRead | GET /api/v1/me |
| `PATCH` | `/api/v1/me` | `identity` | `identity.update_profile` | public | - | publicRead | PATCH /api/v1/me |
| `PATCH` | `/api/v1/me/password` | `identity` | `identity.update_password` | public | - | publicRead | PATCH /api/v1/me/password |
| `GET` | `/api/v1/me/progress` | `games` | `games.me_progress` | public | - | publicRead | GET /api/v1/me/progress |
| `GET` | `/api/v1/quizzes` | `games` | `games.quizzes_list` | public | - | publicRead | GET /api/v1/quizzes |
| `GET` | `/api/v1/quizzes/:slug` | `games` | `games.quizzes_show` | public | - | publicRead | GET /api/v1/quizzes/:slug |
| `POST` | `/api/v1/quizzes/:slug/attempts` | `games` | `games.submit_attempt` | public | - | publicRead | POST /api/v1/quizzes/:slug/attempts |
| `POST` | `/api/v1/session/anonymous` | `identity` | `identity.anonymous_session` | public | - | publicRead | POST /api/v1/session/anonymous |
| `GET` | `/health/live` | `health` | `health.root_live` | public | - | publicRead | GET /health/live |
| `GET` | `/health/ready` | `health` | `health.root_ready` | public | - | publicRead | GET /health/ready |
