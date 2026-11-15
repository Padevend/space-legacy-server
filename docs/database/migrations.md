# Migrations Guide

## Migration Policy
- Migrations are committed to version control under `prisma/migrations/`.
- **Production Deployments**: Always execute `prisma migrate deploy` (or `pnpm db:migrate`).
- Commands like `prisma db push` and `prisma migrate dev` are strictly forbidden in production and staging environments to prevent unintended schema drift and catastrophic data loss.

## Migration History
- `20261114231005_init`: Baseline migration containing core domain tables, join tables, the two schema fixes (`RECONSTRUCTION_3D` enum mapping, `EquipmentLocation` surrogate key), and additive models (`User`, `RefreshToken`, `AuditLog`, `IngestionRun`).
