# Ingestion Module

## Purpose
Manages bulk data ingestion of the processed JSON bundles (`/results/[machine]/[table]_bulk.json`) into PostgreSQL for NASA space equipment, tracking run status, counts summary, dry-run simulations, and content checksums.

## Owned Models
- `IngestionRun`

## Endpoints
### Public
- None (strictly internal)

### Admin
- `GET /api/v1/admin/ingest/runs`
- `GET /api/v1/admin/ingest/runs/:id`
- `POST /api/v1/admin/ingest`
