# SPACE LEGACY Backend Documentation

Welcome to the architectural and API specification repository for **SPACE LEGACY** (NASA Space Apps Challenge 2026, theme *Abandoned but Not Forgotten*).

## Reading Order

1. **Architecture & Foundation**:
   - [Guide Fonctionnel des Modules (FR)](MODULE_DOCS.md): Description accessible et non technique de chaque module avec cas d'usage situationnels.
   - [Architecture Overview](architecture/overview.md): High-level system context, data ingestion pipeline, and component diagram.
   - [Module Structure](architecture/module-structure.md): AdonisJS-inspired modular monolith layout and strict layering rules.
   - [Request Lifecycle](architecture/request-lifecycle.md): The ordered 13-stage middleware pipeline.
   - [Architecture Decision Records (ADR)](architecture/adr/): Recorded technical and domain decisions.

2. **API & Integration**:
   - [API Conventions](api/README.md): Envelope, pagination, filtering, sorting, caching, headers.
   - [Route Map](api/routes-map.md): Comprehensive table of all public and admin endpoints.
   - [Error Catalog](api/errors.md): Complete dictionary of HTTP error codes, payloads, and client guidance.
   - [OpenAPI Specification](api/openapi.json): Standard OpenAPI 3.1 definition.
   - [Ingestion Specification](api/ingestion.md): Bulk `/results/[machine]/[table]_bulk.json` integration format.

3. **Data Layer**:
   - [Entity-Relationship Diagram](database/erd.md): Mermaid ERD.
   - [Database Schema Notes](database/schema-notes.md): Models, surrogate keys, indexing, and PostgreSQL nuances.
   - [Migrations & Seeding](database/migrations.md): Committed migrations and test data seed.

4. **Security & Operations**:
   - [Threat Model](security/threat-model.md): Assets, attack surfaces, and threat mitigation.
   - [Controls Matrix](security/controls-matrix.md): Traceability matrix from attack vector to control implementation and automated test.
   - [Deployment Guide](operations/deployment.md): Step-by-step production runbook with Docker Compose and Caddy reverse proxy.
   - [Environment Variables](operations/env-vars.md): Complete dictionary of configuration variables.

5. **Frontend Integration (FSD)**:
   - [FSD Mapping Guide](frontend-integration/fsd-mapping.md): How `docs/entities/` maps into Feature-Sliced Design.
   - [Error Handling Guide](frontend-integration/error-handling.md): Exhaustive error code handling.
   - [Typed Client Example](frontend-integration/typed-client-example.ts): Minimal typed client wrapper.
