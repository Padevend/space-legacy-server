import type { RateLimiterStore, RateLimitResult } from './store.js';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export class InMemoryRateLimiterStore implements RateLimiterStore {
  private store = new Map<string, RateLimitRecord>();

  constructor() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.store.entries()) {
        if (record.resetAt <= now) {
          this.store.delete(key);
        }
      }
    }, 60000).unref();
  }

  consume(key: string, limit: number, windowMs: number): RateLimitResult {
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

export const inMemoryRateLimiterStore = new InMemoryRateLimiterStore();
export const inMemoryLimiter = inMemoryRateLimiterStore;
