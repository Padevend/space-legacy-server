import type { MiddlewareHandler } from 'hono';
import { AppException } from '#exceptions/app_exception';
import { inMemoryRateLimiterStore } from './memory_store.js';
import type { RateLimiterStore } from './store.js';

export interface RateLimiterOptions {
  windowMs: number;
  max: number;
  store?: RateLimiterStore;
  keyGenerator?: (c: Parameters<MiddlewareHandler>[0]) => string;
}

export class RateLimiter {
  constructor(private readonly store: RateLimiterStore = inMemoryRateLimiterStore) {}

  async consume(key: string, limit: number, windowMs: number) {
    return this.store.consume(key, limit, windowMs);
  }

  async reset(key: string) {
    return this.store.reset(key);
  }

  async clear() {
    return this.store.clear();
  }
}

export const rateLimiter = new RateLimiter();

export const rateLimitMiddleware = (options: RateLimiterOptions): MiddlewareHandler => {
  const store = options.store ?? inMemoryRateLimiterStore;

  return async (c, next) => {
    const clientIp = (c.get('clientIp') as string) || '127.0.0.1';
    const key = options.keyGenerator ? options.keyGenerator(c) : `${clientIp}:${c.req.path}`;

    const result = await store.consume(key, options.max, options.windowMs);

    const resetSeconds = Math.ceil((result.resetAt - Date.now()) / 1000);
    c.header('RateLimit-Limit', String(options.max));
    c.header('RateLimit-Remaining', String(Math.max(0, result.remaining)));
    c.header('RateLimit-Reset', String(Math.max(0, resetSeconds)));

    if (!result.allowed) {
      c.header('Retry-After', String(Math.max(1, resetSeconds)));
      throw AppException.tooManyRequests(
        Math.max(1, resetSeconds),
        'Rate limit exceeded. Too many requests. Please try again later.'
      );
    }

    await next();
  };
};
