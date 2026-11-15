# Security Controls Traceability Matrix

Every attack vector listed in Section 6 of the specification is mapped to its control mechanism, implementation file, and automated test.

| Attack Vector | Control Mechanism | Code Location | Automated Test |
|---|---|---|---|
| **XSS** | Plain-text sanitization on input, URL scheme allow-list, nosniff, strict CSP | `src/core/security/sanitize.ts`, `url-validator.ts`, `secure-headers.ts` | `tests/security/headers.test.ts` |
| **CSRF** | SameSite=Strict cookies; Origin/Referer check on state-changing methods; X-CSRF-Token custom header enforcement | `src/core/security/csrf.ts` | `tests/security/csrf.test.ts` |
| **SSRF** | URLs stored and never dereferenced by default; hardened `safeFetch` blocking RFC1918, loopback, cloud metadata (169.254.169.254), IPv6 ULA/link-local, disallowed protocols, redirect re-validation | `src/core/security/safe-fetch.ts` | `tests/security/safe-fetch.test.ts` |
| **SQL Injection** | Prisma parameterized queries; static sort & filter whitelists; ESLint banning `$queryRawUnsafe` | `eslint.config.js`, `src/core/http/pagination.ts` | `tests/contract/drift.test.ts` |
| **Abuse & Oversized Payloads** | Body-size limit (413), content-type validation (415), request timeout (408) | `src/core/security/body-limit.ts`, `content-type-guard.ts`, `timeout.ts` | `tests/security/middleware-order.test.ts` |
| **Rate Limiting & IP Spoofing** | Multi-tier sliding window rate limiter, Retry-After header, trusted proxy resolution preventing XFF spoofing | `src/core/security/rate-limiter.ts`, `trusted-proxy.ts` | `tests/security/rate-limiter.test.ts` |
| **Middleware Order** | Strict 13-stage execution pipeline enforcing security checks before route handling | `start/kernel.ts` | `tests/security/middleware-order.test.ts` |
| **Brute Force** | Multi-tier throttles, account lockout, Argon2id, timing-safe error equivalence | `src/core/security/password.ts`, `src/modules/auth/` | `tests/security/brute-force.test.ts` |
| **Broken Access Control & IDOR** | Role-based policies per route (`ADMIN`, `EDITOR`), admin user route isolation | `src/core/security/auth-middleware.ts`, `src/modules/users/` | `tests/security/rbac.test.ts` |
| **Mass Assignment** | Strict `.strict()` Zod schemas, explicit DTOs, no request body spreading | `src/modules/users/users.schemas.ts`, `auth.schemas.ts` | `tests/security/rbac.test.ts` |
| **Information Leakage** | Unified error format, production detail masking, Pino log redaction | `src/core/exceptions/error-handler.ts`, `src/core/logger/index.ts` | `tests/e2e/errors.test.ts` |
| **Supply Chain** | Committed lockfile, pinned Docker digests, `pnpm audit` gate | `package.json`, `pnpm-lock.yaml`, `Dockerfile` | `pnpm verify` |
