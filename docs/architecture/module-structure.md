# Module Structure and Layering Rules

The codebase is organized as a modular monolith where each business capability resides in `app/modules/<module>/` as a completely self-contained AdonisJS v6-style MVC slice.

## Directory Conventions

```
app/modules/<module>/
├── controllers/    # Thin HTTP adapters: parse, authorize, call service, return serialized response
├── models/         # Entity interfaces and types
├── repositories/   # All Prisma queries for tables owned by this module
├── services/       # Business logic, cycle checks, transaction boundaries
├── validators/     # Zod request, response, and query schemas
├── serializers/    # Database row -> API representation mapping (DTOs)
├── policies/       # Authorization rules and ability checks
├── exceptions/     # Domain-specific exceptions extending AppException
├── routes/         # OpenAPI route definitions (public.ts, admin.ts, index.ts)
└── providers/      # Module provider and lifecycle hooks
```

## Layering & Isolation Rules

1. **Strict Forward Flow**:
   `routes` -> `controller` -> `service` -> `repository` -> `Prisma Client`
   No layer may bypass another. Controllers cannot call repositories directly.

2. **Database Isolation**:
   Only files in `repositories/` are allowed to import `@prisma/client`. Services, controllers, models, validators, and routes must never touch Prisma directly.

3. **Output Isolation**:
   Only files in `serializers/` shape data leaving the API. Raw database rows or Prisma model objects are never returned directly to HTTP responses.

4. **Absolute Module Isolation (Zero Cross-Module Communication)**:
   Modules NEVER communicate with each other directly:
   - No cross-module imports (`#modules/<other-module>` is strictly prohibited).
   - No cross-module service or repository calls.
   - Modules only query tables they own (enforced by `module_ownership.spec.ts` and `module_isolation.spec.ts`).
   - Multi-module aggregations are handled exclusively by read-only query modules:
     - `app/modules/catalog/`: Public multi-domain compositions (`/explore`, `/destinations`, `/home`).
     - `app/modules/dashboard/`: Administrative metrics (`/admin/dashboard/counters`).

5. **Pure Services**:
   Services contain no HTTP concepts (no `Context`, status codes, or HTTP headers).
