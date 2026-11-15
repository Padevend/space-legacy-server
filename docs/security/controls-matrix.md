# Security Controls Traceability Matrix

Every attack vector listed in Section 6 of the specification is mapped to its control mechanism, implementation file, and automated test.

| Attack Vector | Control Mechanism | Code Location | Automated Test |
|---|---|---|---|
| **XSS** | Plain-text sanitization on input, URL scheme allow-list, nosniff, strict CSP | `app/infrastructure/security/sanitizer.ts`, `url_validator.ts`, `app/middleware/secure_headers_middleware.ts` | `tests/security/headers.test.ts` |
| **CSRF** | SameSite=Strict cookies; Origin/Referer check on state-changing methods; X-CSRF-Token custom header enforcement | `app/middleware/csrf_origin_middleware.ts` | `tests/security/csrf.test.ts` |
| **SSRF** | URLs stored and never dereferenced by default; hardened `safeFetch` blocking RFC1918, loopback, cloud metadata (169.254.169.254), IPv6 ULA/link-local, disallowed protocols, redirect re-validation | `app/infrastructure/security/safe_fetch.ts` | `tests/security/safe-fetch.test.ts` |
| **SQL Injection** | Prisma parameterized queries; static sort & filter whitelists; ESLint banning `$queryRawUnsafe` | `eslint.config.js`, `app/infrastructure/http/query_parser.ts` | `tests/contract/drift.test.ts` |
| **Abuse & Oversized Payloads** | Body-size limit (413), content-type validation (415), request timeout (408) | `app/middleware/body_limit_middleware.ts`, `content_type_middleware.ts`, `timeout_middleware.ts` | `tests/security/middleware-order.test.ts` |
| **Rate Limiting & IP Spoofing** | Multi-tier sliding window rate limiter, Retry-After header, trusted proxy resolution preventing XFF spoofing | `app/infrastructure/rate_limit/limiter.ts`, `app/middleware/trusted_proxy_middleware.ts` | `tests/security/rate-limiter.test.ts` |
| **Middleware Order** | Strict 13-stage execution pipeline enforcing security checks before route handling | `start/kernel.ts` | `tests/security/middleware-order.test.ts` |
| **Brute Force** | Multi-tier throttles, account lockout, Argon2id, timing-safe error equivalence | `app/infrastructure/security/password_hasher.ts`, `app/modules/auth/` | `tests/security/brute-force.test.ts` |
| **Broken Access Control & IDOR** | Role-based policies per route (`ADMIN`, `EDITOR`), admin user route isolation | `app/middleware/ability_middleware.ts`, `app/modules/auth/controllers/users_controller.ts` | `tests/security/rbac.test.ts` |
| **Mass Assignment** | Strict `.strict()` Zod schemas, explicit DTOs, no request body spreading | `app/modules/auth/validators/user.ts`, `auth.ts` | `tests/security/rbac.test.ts` |
| **Information Leakage** | Unified error format, production detail masking, Pino log redaction | `app/exceptions/handler.ts`, `app/infrastructure/logger/logger.ts` | `tests/e2e/errors.test.ts` |
| **Hierarchy Cycle Denial-of-Service** | Ancestor graph traversal cycle detection blocking recursive self-references | `app/modules/equipment/services/equipment_service.ts` | `tests/e2e/equipment.test.ts` |
| **Include Depth / Query Bomb** | Whitelist relation includes, hard cap at 3 relations, strictly depth 1, 50-item bounded | `app/modules/missions/services/mission_service.ts`, `app/modules/equipment/services/equipment_service.ts` | `tests/e2e/missions.test.ts` |
| **Scientific Precision Loss** | String decimal serialization preserving full 8-decimal scientific measurement fidelity | `app/modules/measurements/serializers/measurement_serializer.ts` | `tests/e2e/measurements.test.ts` |
| **Unpublished Editorial Leakage** | Public routes enforce `publicationStatus = PUBLISHED`; drafts/reviews/archives return 404 | `app/modules/stories/services/story_service.ts` | `tests/e2e/stories.test.ts` |
| **Editorial State Machine Bypass** | Transition state machine blocking illegal publishing skips with 409 CONFLICT | `app/modules/stories/services/story_service.ts` | `tests/e2e/stories.test.ts` |
| **AI Provenance Transparency** | Serializer deterministically computes `requiresAiLabel: true` for AI-generated illustrations | `app/modules/media/serializers/media_serializer.ts` | `tests/e2e/media.test.ts` |
| **Editorial Content XSS** | Plain-text sanitization discarding script and HTML tags on story title, hook, content | `app/modules/stories/services/story_service.ts`, `app/infrastructure/security/sanitizer.ts` | `tests/e2e/stories.test.ts` |
| **Module Isolation & Coupling** | Modules strictly isolated, zero cross-module imports or database queries | `tests/unit/module_isolation.spec.ts`, `tests/unit/module_ownership.spec.ts` | `pnpm test` |
| **Supply Chain** | Committed lockfile, pinned Docker digests, `pnpm audit` gate | `package.json`, `pnpm-lock.yaml`, `Dockerfile` | `pnpm verify` |
