# ADR-008: Isolated AdonisJS v6 MVC Modules Refoundation

## Status
Accepted (Supersedes ADR-003)

## Context
As the SPACE LEGACY backend expanded through Stage 5, inter-module coupling grew through direct service invocations across module boundaries. To ensure long-term architectural stability, avoid spaghetti cross-dependencies, eliminate leaky abstractions, and strictly compartmentalize domain ownership:
1. Every module must become an isolated, self-contained MVC slice.
2. Modules must NEVER import from, execute runtime calls to, or query database tables owned by another module.
3. Multi-domain aggregations and queries must be exclusively served by dedicated read-only modules (`catalog`, `dashboard`).
4. Non-essential MVP features must be safely quarantined into `legacy/` rather than deleted or haphazardly half-implemented.
5. All references to the legacy `src/` hierarchy must be eliminated in favor of clean subpath imports rooted in `app/`.

## Decisions

1. **Self-Contained MVC Module Architecture (`app/modules/<module>/`)**:
   Every domain module strictly follows AdonisJS v6 role-folder conventions:
   - `controllers/`: HTTP handling, parameter extraction, delegation to services, and serializer invocations.
   - `models/`: Domain entity interfaces and types representing the module's persistence entities.
   - `repositories/`: Data access implementations. The ONLY layer allowed to import `@prisma/client` and interact with the module's database tables.
   - `services/`: Pure business logic, validation enforcement, and workflow orchestrations.
   - `validators/`: Zod validation schemas for input requests and URL params.
   - `serializers/`: Output DTO transformations preventing internal schema leakage.
   - `policies/`: Authorization guards checking user abilities and ownership.
   - `exceptions/`: Domain-specific exceptions extending `AppException`.
   - `routes/`: Hono OpenAPI route registrations (`public.ts`, `admin.ts`, `index.ts`).
   - `providers/`: Module registration and lifecycle hook bindings.

2. **Zero Cross-Module Communication**:
   - Modules never import anything from another module (`#modules/<other-module>` is strictly forbidden and asserted by unit test `tests/unit/module_isolation.spec.ts`).
   - Modules never query Prisma delegates owned by other modules (`tests/unit/module_ownership.spec.ts`).
   - `users` is merged completely into `auth`.
   - Cross-module data aggregation for public reading is handled exclusively by `catalog` (read-only queries).
   - Cross-module counters for administrative dashboards are handled exclusively by `dashboard` (read-only queries).

3. **Subpath Aliasing**:
   TypeScript and Node.js subpath imports (`package.json#imports` and `tsconfig.json#paths`) are standardized:
   - `#modules/*` -> `./app/modules/*`
   - `#infrastructure/*` -> `./app/infrastructure/*`
   - `#contracts/*` -> `./app/contracts/*`
   - `#exceptions/*` -> `./app/exceptions/*`
   - `#middleware/*` -> `./app/middleware/*`
   - `#config/*` -> `./config/*`
   - `#start/*` -> `./start/*`

4. **Quarantine in `legacy/`**:
   Non-essential features (forum, comments, user-submitted media, quiz, 3D geographic map endpoints, AI generation workers) are quarantined in `legacy/` with full provenance documentation, kept completely isolated from the runtime router and production builds (`tests/unit/legacy_isolation.spec.ts`).

5. **Elimination of `src/`**:
   The entire legacy `src/` directory is deleted, with zero broken references anywhere in the codebase.

## Consequences
- Strict decoupling: changing any module has zero hidden side-effects on other modules.
- Strict testability: every module can be tested in complete isolation.
- Architecture enforcement: automated unit tests in `tests/unit/` prevent isolation regressions during CI/CD.
- Clean contract mapping for the frontend team via `#contracts/*` and `docs/entities/*`.
