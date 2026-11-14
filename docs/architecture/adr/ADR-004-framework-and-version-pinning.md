# ADR-004: Technology Stack and Strict Version Pinning

## Status
Accepted

## Context
Dependency drift, subtle breaking changes in major version transitions (such as Prisma 8 RC command line overhauls vs Prisma 7/6 stable ORM, Zod 3 vs Zod 4 API changes), and unpinned versions can cause silent failures and security regressions.

## Decisions

1. **HTTP Engine**:
   - `hono` pinned at `4.13.18` with `@hono/node-server` at `2.1.8`.
   - Node.js LTS 22 (`.nvmrc` pinned at `22.20.0`).

2. **Validation and OpenAPI**:
   - `zod` and `@hono/zod-openapi` pinned at compatible stable versions for schema validation, route type inferences, and automatic OpenAPI 3.1 generation.

3. **Data Layer**:
   - PostgreSQL 16 on standard relational drivers (`pg` 8.23.1).
   - `prisma` CLI and `@prisma/client` pinned at `7.10.1` (providing standard `prisma validate`, `prisma migrate deploy`, `prisma generate`, `prisma db seed`).

4. **Security & Cryptography**:
   - `jose` (v6) for stateless, timing-safe JWT handling and RS256/EdDSA/HS256 signature verification.
   - `@node-rs/argon2` or `argon2` for Argon2id password hashing using OWASP-recommended parameters (memory cost 65536 KiB, time cost 3 iterations, parallelism 4).
   - `sanitize-html` configured with strict empty tag allow-lists for plain text input sanitization.

5. **Logging**:
   - `pino` (v10) for structured high-throughput JSON output in production and `pino-pretty` exclusively in local development.

6. **CLI Engine**:
   - `commander` (v15) powering Ace-style tasks under `bin/console.ts`.

## Consequences
- Predictable and reproducible builds across developer machines, CI, and Docker production stages.
- No dependency drift or surprise breaking changes.
