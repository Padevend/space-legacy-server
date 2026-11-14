# ADR-001: Corrections to Initial Prisma Schema

## Status
Accepted

## Context
The initial database schema provided for SPACE LEGACY contained two critical schema definition errors that prevented Prisma from validating and generating the client:

1. In the `MediaProvenance` enum, the identifier `3D_RECONSTRUCTION` began with a digit, which violates Prisma schema identifier syntax rules.
2. In the `EquipmentLocation` join table, `@@id([equipmentId, locationId, startDate])` was declared with `startDate` being an optional (`DateTime?`) field. Prisma requires all components of a primary compound key (`@@id`) to be strictly required (`NOT NULL`).

## Decisions

1. **Enum Renaming with Mapping**:
   Rename the Prisma enum member to `RECONSTRUCTION_3D` and map it back to the database value `"3D_RECONSTRUCTION"` via `@map("3D_RECONSTRUCTION")`. The public and internal API surfaces will strictly expose `RECONSTRUCTION_3D`.

2. **Surrogate Key for EquipmentLocation**:
   Add a surrogate primary key:
   ```prisma
   equipmentLocationId String @id @default(uuid()) @db.Uuid
   ```
   Replace the compound primary key with a compound unique index:
   ```prisma
   @@unique([equipmentId, locationId, startDate])
   ```

3. **Caveat on NULL Uniqueness in PostgreSQL**:
   In standard SQL and PostgreSQL prior to version 15 (or when `NULLS NOT DISTINCT` is not explicitly declared), standard `UNIQUE` indexes allow multiple rows with `NULL` in nullable columns because `NULL != NULL`. Because `startDate` may be `NULL` (indicating an ongoing or unspecified start date), we enforce at the application/service level that no duplicate open or overlapping location periods exist for any given equipment.

## Consequences
- Schema passes `prisma validate`.
- Stable database migrations can be generated and deployed.
- Service layer must validate location time periods before persisting.
