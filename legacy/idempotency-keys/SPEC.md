# Feature Spec: Idempotency-Key Header Handling

## 1. Origin & Objectives
- **Origin**: Backend brief v2
- **Purpose**: Deduplicate state-changing requests when network drops occur, returning stored responses for matching `Idempotency-Key` headers within 24 hours.
- **V1 Status**: Deferred as standard transactional upserts and client retries suffice for V1 editorial volume.
