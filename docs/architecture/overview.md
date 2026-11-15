# System Overview & Context

SPACE LEGACY provides an educational API documenting equipment NASA left behind across the Solar System (Moon, Mars, deep space).

## Data Flow & Integration Pipeline

```mermaid
flowchart LR
    A["data-ingestion<br/>(Scraping raw NASA sources)"] --> B["data-processing<br/>(Structured [table]_bulk.json)"]
    B --> C["data-integration<br/>(SPACE LEGACY Backend)"]
    C --> D["Frontend Application<br/>(Feature-Sliced Design)"]
    C --> E["Editorial Team<br/>(Admin API)"]
```

## Modular Monolith Architecture

The backend is built as a single deployable modular monolith structured according to AdonisJS principles:

```mermaid
flowchart TD
    Client["Client / Frontend"] --> Router["Hono OpenAPI Router (/api/v1)"]
    Router --> Middleware["13-Stage Security & Processing Kernel"]
    Middleware --> Controller["Module Controller (HTTP serialization)"]
    Controller --> Service["Module Service (Business logic & transactions)"]
    Service --> Repository["Module Repository (Prisma ORM queries)"]
    Repository --> DB[("PostgreSQL 16 Database")]
```

## Key Invariants

1. **Deny by default**: Unauthenticated requests can only access public GET routes.
2. **Deterministic Data Integrity**: Ingested datasetsupsert deterministically based on natural and UUID v5 keys.
3. **Traceability**: Every published piece of equipment links to authentic NASA sources, archival references, and verified measurements.
