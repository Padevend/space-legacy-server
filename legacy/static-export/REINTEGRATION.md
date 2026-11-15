# Reintegration Guide: Static Export

## 1. Conditions for Reintegration
- Static pre-rendering or offline-first PWA requirements.

## 2. Steps to Promote
1. Move `legacy/static-export/code/commands/export-public.ts` to `commands/export_public.ts`.
2. Register in `commands/index.ts` / `adonisrc.ts`.
3. Add functional snapshot test.
