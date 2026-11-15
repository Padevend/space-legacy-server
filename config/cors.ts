import { env } from '../start/env.js';

export const corsConfig = {
  origins: env.CORS_ALLOWED_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-CSRF-Token', 'Idempotency-Key', 'If-None-Match'],
  exposeHeaders: [
    'X-Request-Id',
    'ETag',
    'Content-Length',
    'Retry-After',
    'RateLimit-Limit',
    'RateLimit-Remaining',
    'RateLimit-Reset',
  ],
  maxAge: 600, // 10 minutes preflight cache
  credentials: true,
} as const;
