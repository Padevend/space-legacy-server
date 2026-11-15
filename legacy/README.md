# Quarantined Features (Legacy)

This directory houses non-essential features identified during the v3 scope triage. In accordance with Section 1 of the refoundation brief, features excluded from V1 are quarantined rather than deleted, preserving architectural specifications and historical code for potential future integration.

## Quarantined Features Index

| Feature | Spec Section | Reason Parked | Dependencies | Reintegration Conditions | Status |
|---|---|---|---|---|---|
| [forum](./forum) | spec §4.3 | Explicitly put on hold; focus is curated education | WebSocket / PubSub, moderation queue | Post-V1 community roadmap approval | PARKED |
| [visitor-accounts](./visitor-accounts) | spec §4.3 | Out of V1 scope; administrative accounts only | Public registration, email verification | Public participation phase | PARKED |
| [quiz](./quiz) | spec §4.3, §18 | Decided out of V1 MVP | Gamification engine, score tracking | Educational gamification milestone | PARKED |
| [geo-map](./geo-map) | spec §4.3, §18 | "To study, no V1 commitment"; raw coordinates kept | Cesium / Three.js, map tile server | 3D cartography study completion | PARKED |
| [ai-production-agent](./ai-production-agent) | spec §7 | Future feature; V1 only prepares ground | LangChain / Gemini API, prompt versions | Editorial AI agent phase | PARKED |
| [media-storage-adapters](./media-storage-adapters) | spec §12.4, §19 | Hosting & storage undecided; V1 stores URLs only | AWS S3 SDK, sharp image processing | Cloud infrastructure provisioning | PARKED |
| [redis-rate-limiter](./redis-rate-limiter) | brief | Single instance in V1; in-memory store suffices | ioredis, Redis server | Multi-instance clustering requirement | PARKED |
| [idempotency-keys](./idempotency-keys) | brief | Nice-to-have; standard transactional endpoints suffice | Redis / DB idempotency table | High-throughput distributed writes | PARKED |
| [static-export](./static-export) | brief | Not required for V1 public API consumption | File system snapshot writer | Offline static site generation demand | PARKED |

## Strict Isolation Rules
1. `legacy/` is completely excluded from TypeScript compilation (`tsconfig.json`), the application build, the router, and OpenAPI docs.
2. Production dependencies required solely by legacy features must not be in `package.json`.
3. An automated test (`tests/unit/legacy_isolation.spec.ts`) continuously asserts that no application file under `app/`, `start/`, `config/`, `bin/`, `commands/`, or `providers/` imports from `legacy/`.
