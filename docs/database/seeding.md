# Database Seeding

## Seed Purpose
The seed script (`prisma/seed.ts`, executable via `pnpm db:seed`) creates a minimal, realistic, and **clearly fake-marked** dataset for local testing and developer previews.

## Rules
- No fictitious facts presented as genuine history. All generated test records are suffixed with `[TEST-SEED]` or tagged with explicit disclaimer descriptions.
- Seeds default administrative credentials for local development:
  - Admin: `admin@spacelegacy.test` / `AdminSpaceLegacy2026!`
  - Editor: `editor@spacelegacy.test` / `EditorSpaceLegacy2026!`
- Upsert logic is used so re-running `pnpm db:seed` is idempotent.
