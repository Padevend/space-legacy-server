# Reintegration Guide: Redis Rate Limiter

## 1. Conditions for Reintegration
- Multi-instance horizontal scaling deployed.
- Managed Redis cluster available.

## 2. Steps to Promote
1. Add `ioredis` dependency to `package.json`.
2. Implement `RedisRateLimitStore` in `app/infrastructure/rate_limit/`.
3. Switch driver in `config/rate_limit.ts`.
