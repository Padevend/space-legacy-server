# SPACE LEGACY API Route Map

Auto-generated route registry of all active HTTP endpoints.

| Method | Path | Module | Name | Auth | Role | Rate Limit | Summary |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/bodies` | `celestial_bodies` | `celestial_bodies.public_list` | public | - | publicRead | GET /api/v1/bodies |
| `GET` | `/api/v1/health/live` | `health` | `health.live` | public | - | publicRead | Process Liveness Probe |
| `GET` | `/api/v1/health/ready` | `health` | `health.ready` | public | - | publicRead | System Readiness Probe |
| `GET` | `/api/v1/machines` | `machines` | `machines.public_list` | public | - | publicRead | GET /api/v1/machines |
| `GET` | `/api/v1/machines/:slug` | `machines` | `machines.public_show` | public | - | publicRead | GET /api/v1/machines/:slug |
| `GET` | `/health/live` | `health` | `health.root_live` | public | - | publicRead | GET /health/live |
| `GET` | `/health/ready` | `health` | `health.root_ready` | public | - | publicRead | GET /health/ready |
