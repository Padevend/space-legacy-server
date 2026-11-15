# Feature Spec: Static JSON Export for Public Data

## 1. Origin & Objectives
- **Origin**: Backend brief v2
- **Purpose**: Dump static JSON snapshots of public API data to disk for zero-backend static site hosting.
- **V1 Status**: Quarantined. Direct REST API calls from the FSD frontend with ETag caching provide full performance.

## 2. Quarantined Code
- Quarantined implementation located at [`./code/commands/export-public.ts`](./code/commands/export-public.ts).
