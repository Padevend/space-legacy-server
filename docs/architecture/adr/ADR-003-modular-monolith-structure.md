# ADR-003: Modular Monolith Organized with AdonisJS Conventions

## Status
Accepted

## Context
SPACE LEGACY requires high maintainability, strict separation of concerns, complete documentation, and clear layering to serve both a public audience and back-office editorial staff. A spaghetti backend structure leads to leaky abstractions, uncontrolled SQL injection vectors, and circular dependencies.

## Decisions

1. **Folder Architecture**:
   - `bin/`: CLI and HTTP server bootstrap entry points (`bin/server.ts`, `bin/console.ts`).
   - `commands/`: CLI Ace-style command handlers (`pnpm ace <command>`).
   - `config/`: Pure typed configuration modules parsing strongly-typed environment variables.
   - `start/`: Boot orchestration: `env.ts` (Zod schema checking), `kernel.ts` (strict 13-stage middleware pipeline), `routes.ts` (routing table).
   - `src/core/`: Reusable, framework-level primitives (HTTP helpers, error handling, security middleware, Prisma client, logging). No business rules.
   - `src/modules/<module>/`: Business modules adhering to the strict layering rule:
     `routes` -> `controller` -> `service` -> `repository` -> `Prisma Client`
     `serializer` -> API output transformation.
   - `docs/`: First-class documentation artifacts including entity contracts for the frontend, OpenAPI specification, routes map, and threat models.

2. **Strict Layering Constraints**:
   - Only `repository` files may import or invoke the Prisma Client.
   - Services contain domain rules, cycle checks, and transaction boundaries. They never access HTTP contexts or raw query parameters.
   - Controllers handle HTTP validation, delegate to services, and map outputs through serializers.
   - Serializers guarantee that raw database records are never directly leaked over HTTP.
   - Inter-module communication must pass through the target module's service interface, never its repository.

## Consequences
- Predictable, testable components.
- Zero leakage of ORM internals.
- Clean contract mapping for the frontend team.
