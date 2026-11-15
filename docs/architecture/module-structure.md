# Module Structure and Layering Rules

The codebase is organized as a modular monolith where each business capability resides in `src/modules/<module>/`.

## Directory Conventions

```
src/modules/<module>/
├── <module>.routes.ts      # OpenAPI route definitions bound to controller methods
├── <module>.controller.ts  # Thin HTTP adapter: parse, call service, shape response
├── <module>.service.ts     # Business logic, cycle checks, transaction boundaries
├── <module>.repository.ts  # All Prisma queries for this module
├── <module>.schemas.ts     # Zod request, response, and query schemas
├── <module>.serializer.ts  # Database row -> API representation mapping
├── <module>.policy.ts      # Authorization rules (ADMIN vs EDITOR permissions)
└── tests/                  # Module unit and integration tests
```

## Layering Rules

1. **Strict Forward Flow**:
   `routes` -> `controller` -> `service` -> `repository` -> `Prisma Client`
   No layer may bypass another. Controllers cannot call repositories directly.

2. **Database Isolation**:
   Only `*.repository.ts` files are allowed to import or access `prisma`. Services, controllers, and routes must never touch Prisma directly.

3. **Output Isolation**:
   Only `*.serializer.ts` shapes data leaving the API. Raw database rows or Prisma model objects are never returned directly to HTTP responses.

4. **Inter-Module Communication**:
   Modules communicate only through another module's public `Service` interface, never through its repository.

5. **Pure Services**:
   Services contain no HTTP concepts (no `Context`, status codes, or HTTP headers).
