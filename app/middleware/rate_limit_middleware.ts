import type { MiddlewareHandler } from 'hono';
import { rateLimitMiddleware as baseLimiter, type RateLimiterOptions } from '#infrastructure/rate_limit/limiter';
import { rateLimitConfig } from '#config/rate-limit';

export type RateLimitTier =
  | 'global'
  | 'public_read'
  | 'admin'
  | 'public_search'
  | 'login_attempt'
  | 'refresh'
  | 'ingestion';

export interface TierOptions {
  tier?: RateLimitTier;
  windowMs?: number;
  max?: number;
}

export function rateLimit(options: TierOptions | RateLimiterOptions = {}): MiddlewareHandler {
  if ('tier' in options && options.tier) {
    switch (options.tier) {
      case 'global':
        return baseLimiter({ windowMs: rateLimitConfig.global.windowMs, max: rateLimitConfig.global.max });
      case 'public_read':
        return baseLimiter({ windowMs: rateLimitConfig.publicRead.windowMs, max: rateLimitConfig.publicRead.max });
      case 'public_search':
        return baseLimiter({ windowMs: rateLimitConfig.publicSearch.windowMs, max: rateLimitConfig.publicSearch.max });
      case 'admin':
        return baseLimiter({ windowMs: rateLimitConfig.admin.windowMs, max: rateLimitConfig.admin.max });
      case 'login_attempt':
        return baseLimiter({
          windowMs: rateLimitConfig.loginAttempt.windowMs,
          max: rateLimitConfig.loginAttempt.maxIp,
        });
      case 'refresh':
        return baseLimiter({ windowMs: rateLimitConfig.refresh.windowMs, max: rateLimitConfig.refresh.max });
      case 'ingestion':
        return baseLimiter({ windowMs: rateLimitConfig.ingestion.windowMs, max: rateLimitConfig.ingestion.max });
    }
  }

  const windowMs = options.windowMs ?? rateLimitConfig.global.windowMs;
  const max = options.max ?? rateLimitConfig.global.max;
  return baseLimiter({ windowMs, max });
}

export const rateLimitMiddleware = {
  global: () => rateLimit({ tier: 'global' }),
  publicRead: () => rateLimit({ tier: 'public_read' }),
  admin: () => rateLimit({ tier: 'admin' }),
  tier: (t: RateLimitTier) => rateLimit({ tier: t }),
};
