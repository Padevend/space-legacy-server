# Health Module

## Purpose
Exposes container liveness (`/health/live`) and dependency readiness (`/health/ready`) probes.

## Owned Models
None (operational probes only).

## Endpoints
- `GET /health/live` (status, uptimeSeconds, timestamp)
- `GET /health/ready` (status, database connection, latencyMs in development)
