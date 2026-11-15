# Feature Spec: Redis-Backed Distributed Rate Limiter

## 1. Origin & Objectives
- **Origin**: Backend brief v2
- **Purpose**: Clustered multi-instance rate limiting using shared Redis memory.
- **V1 Status**: V1 runs a single Node.js instance with an in-memory sliding window store behind `RateLimitStore` interface.

## 2. Technical Design
- Adapter implementing `RateLimitStore` using `ioredis`.
