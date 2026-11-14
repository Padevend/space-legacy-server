# ADR-002: Additive Domain Models for Authentication, Auditing, and Ingestion Tracking

## Status
Accepted

## Context
The core schema from `schema.prisma` defines the scientific and editorial domain models (Missions, Equipment, Events, Stories, etc.) but lacks infrastructure and operational models required for back-office security, session management, auditing, and bulk data integration tracking.

## Decisions
We introduce four strictly additive models into `prisma/schema.prisma` without modifying existing core domain tables:

1. **`User`**:
   - Represents back-office administrative and editorial personnel (`ADMIN`, `EDITOR`).
   - Fields: `userId` (UUID), `email` (unique, lowercase), `passwordHash` (Argon2id), `role`, `isActive`, `failedLoginCount`, `lockedUntil`, `lastLoginAt`, timestamps.
   - Public self-registration is strictly disallowed; accounts are provisioned via CLI (`pnpm ace user:create-admin`) or by existing administrators.

2. **`RefreshToken`**:
   - Implements cryptographic refresh token rotation with immediate family reuse detection.
   - Fields: `refreshTokenId` (UUID), `tokenHash` (SHA-256 hash of the random opaque secret), `userId`, `familyId` (UUID group for token lineage), `expiresAt`, `revokedAt`, `replacedById`, `userAgentHash`, `createdAt`.
   - Any attempt to reuse a replaced refresh token revokes the entire token family immediately.

3. **`AuditLog`**:
   - Tracks mutations across the admin surface.
   - Fields: `auditLogId` (UUID), `actorId` (foreign key to `User`), `action`, `entity`, `entityId`, `requestId`, `diffSummary` (sanitized JSON diff without secrets or credentials), `createdAt`.

4. **`IngestionRun`**:
   - Records execution of the bulk data-processing integration pipeline (`/results/[machine]/[table]_bulk.json`).
   - Fields: `ingestionRunId` (UUID), `status` (`PENDING`, `RUNNING`, `COMPLETED`, `FAILED`), `countsSummary` (JSON map of record counts), `errorSummary`, `dryRun`, `contentHash`, execution timestamps.

5. **Additive Natural Key on `Source`**:
   - Added `@@unique([url])` on `Source` to support deterministic, idempotent upsert during bulk ingestion runs across different equipment bundles.

## Consequences
- Full RBAC and security audit trail enabled.
- Safe token rotation with proactive session invalidation.
- Reliable tracking and reporting of batch imports.
