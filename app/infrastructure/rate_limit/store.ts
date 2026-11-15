export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimiterStore {
  consume(key: string, limit: number, windowMs: number): RateLimitResult | Promise<RateLimitResult>;
  reset(key: string): void | Promise<void>;
  clear(): void | Promise<void>;
}
