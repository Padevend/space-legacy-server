# SPACE LEGACY API Route Map

Auto-generated route registry of all active HTTP endpoints.

| Method | Path | Module | Name | Auth | Role | Rate Limit | Summary |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/health/live` | `health` | `health.live` | public | - | publicRead | Process Liveness Probe |
| `GET` | `/api/v1/health/ready` | `health` | `health.ready` | public | - | publicRead | System Readiness Probe |
| `GET` | `/health/live` | `health` | `health.root_live` | public | - | publicRead | GET /health/live |
| `GET` | `/health/ready` | `health` | `health.root_ready` | public | - | publicRead | GET /health/ready |
