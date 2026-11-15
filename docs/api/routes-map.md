# SPACE LEGACY API Route Map

Auto-generated route registry of all active HTTP endpoints.

| Method | Path | Module | Name | Auth | Role | Rate Limit | Summary |
|---|---|---|---|---|---|---|---|
| `POST` | `/api/v1/auth/login` | `identity` | `identity.login` | public | - | login | POST /api/v1/auth/login |
| `POST` | `/api/v1/auth/logout` | `identity` | `identity.logout` | public | - | publicRead | POST /api/v1/auth/logout |
| `POST` | `/api/v1/auth/register` | `identity` | `identity.register` | public | - | publicRead | POST /api/v1/auth/register |
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
| `POST` | `/api/v1/session/anonymous` | `identity` | `identity.anonymous_session` | public | - | publicRead | POST /api/v1/session/anonymous |
| `GET` | `/health/live` | `health` | `health.root_live` | public | - | publicRead | GET /health/live |
| `GET` | `/health/ready` | `health` | `health.root_ready` | public | - | publicRead | GET /health/ready |
