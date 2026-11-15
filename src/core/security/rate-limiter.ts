import type { MiddlewareHandler } from 'hono';
import { AppException } from '../exceptions/AppException.js';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitRecord>();

  constructor() {
    // Periodic cleanup of expired keys every 60 seconds
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.store.entries()) {
        if (record.resetAt <= now) {
          this.store.delete(key);
        }
      }
    }, 60000).unref();
  }

  consume(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || record.resetAt <= now) {
      const resetAt = now + windowMs;
      this.store.set(key, { count: 1, resetAt });
      return { allowed: true, remaining: limit - 1, resetAt };
    }

    if (record.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: record.resetAt };
    }

    record.count += 1;
    return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

export const inMemoryLimiter = new InMemoryRateLimiter();

export interface RateLimiterOptions {
  windowMs: number;
  max: number;
  keyGenerator?: (c: Parameters<MiddlewareHandler>[0]) => string;
}

export const rateLimitMiddleware = (options: RateLimiterOptions): MiddlewareHandler => {
  return async (c, next) => {
    const clientIp = c.get('clientIp') || '127.0.0.1';
    const key = options.keyGenerator ? options.keyGenerator(c) : `${clientIp}:${c.req.path}`;

    const result = inMemoryLimiter.consume(key, options.max, options.windowMs);

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
