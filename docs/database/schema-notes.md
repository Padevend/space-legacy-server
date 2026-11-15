# Database Schema Notes

## Database Technology
- **Engine**: PostgreSQL 16
- **Access Layer**: Prisma ORM with `@prisma/adapter-pg` driver adapter.
- **Connection**: Parameterized queries via Prisma Client; raw SQL is strictly forbidden except validated `Prisma.sql` tagged templates.

## Corrections to Initial Schema (ADR-001)

1. **`MediaProvenance` Enum**:
   - Initial value `3D_RECONSTRUCTION` broke Prisma compilation (identifiers cannot begin with a digit).
   - Corrected to `RECONSTRUCTION_3D` mapped to database column value `"3D_RECONSTRUCTION"` via `@map("3D_RECONSTRUCTION")`.
   - The API layer exposes `RECONSTRUCTION_3D`.

2. **`EquipmentLocation` Composite Key**:
   - The initial schema defined `@@id([equipmentId, locationId, startDate])` with `startDate DateTime?`.
   - In Prisma and relational theory, primary keys cannot contain nullable columns.
   - Introduced a surrogate UUID primary key: `equipmentLocationId String @id @default(uuid()) @db.Uuid`.
   - Replaced compound primary key with `@@unique([equipmentId, locationId, startDate])`.
   - **PostgreSQL Null-Uniqueness Rule**: Standard SQL considers `NULL != NULL`. Thus, multiple rows with `startDate = NULL` could technically be inserted if unchecked. We enforce at the application service layer that an equipment cannot have overlapping open-ended location assignments.

## Additive Models (ADR-002)

1. **`User` (`users`)**:
   - Back-office administration and content editing accounts (`ADMIN`, `EDITOR`).
   - Fields: `userId`, `email` (unique, lowercase), `passwordHash` (Argon2id), `role`, `isActive`, `failedLoginCount`, `lockedUntil`, `lastLoginAt`, `createdAt`, `updatedAt`.
   - No public self-registration.

2. **`RefreshToken` (`refresh_tokens`)**:
   - Cryptographic token rotation with automatic reuse detection.
   - Fields: `refreshTokenId`, `tokenHash` (SHA-256), `userId`, `familyId`, `expiresAt`, `revokedAt`, `replacedById`, `userAgentHash`, `createdAt`.
   - If a revoked or replaced token is presented, all active tokens sharing its `familyId` are immediately revoked.

3. **`AuditLog` (`audit_logs`)**:
   - Comprehensive audit trail of all administrative and editorial operations.
   - Fields: `auditLogId`, `actorId` (nullable FK to User), `action`, `entity`, `entityId`, `requestId`, `diffSummary` (sanitized JSON), `createdAt`.

4. **`IngestionRun` (`ingestion_runs`)**:
   - Audit trail for bulk data-processing integration runs (`/results/[machine]/[table]_bulk.json`).
   - Fields: `ingestionRunId`, `status` (`PENDING`, `RUNNING`, `COMPLETED`, `FAILED`), `countsSummary` (JSON), `errorSummary`, `dryRun`, `contentHash`, execution timestamps.

5. **`Source` Unique Index**:
   - Additive unique constraint `@@unique([url])` ensuring deterministic upserts and cross-bundle source deduplication.
