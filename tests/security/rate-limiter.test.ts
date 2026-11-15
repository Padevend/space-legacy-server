import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { inMemoryLimiter } from '../../app/infrastructure/rate_limit/memory_store.js';
import { rateLimitMiddleware } from '../../app/infrastructure/rate_limit/limiter.js';
import { trustedProxyMiddleware } from '../../app/infrastructure/security/trusted_proxy.js';
import { exceptionHandler } from '#exceptions/handler';
import type { ApiErrorResponse } from '#exceptions/handler';

function createTestApp() {
  const app = new Hono();
  app.onError((err, c) => exceptionHandler.handle(err, c));
  return app;
}

describe('Security: Rate Limiter & Trusted Proxy', () => {
  beforeEach(() => {
    inMemoryLimiter.clear();
  });

  it('sets standard RateLimit-* headers on allowed requests', async () => {
    const app = createTestApp();
    app.use(
      '/test-rate',
      rateLimitMiddleware({
        windowMs: 60000,
        max: 5,
        keyGenerator: (c) => `test:${c.get('clientIp')}`,
      })
    );
    app.get('/test-rate', (c) => c.text('ok'));

    const res = await app.request('/test-rate');
    expect(res.status).toBe(200);
    expect(res.headers.get('RateLimit-Limit')).toBe('5');
    expect(res.headers.get('RateLimit-Remaining')).toBe('4');
    expect(res.headers.get('RateLimit-Reset')).toBeDefined();
  });

  it('rejects the (N+1)th request with 429 TOO_MANY_REQUESTS and Retry-After header', async () => {
    const app = createTestApp();
    const max = 3;
    app.use(
      '/test-exhaust',
      rateLimitMiddleware({
        windowMs: 60000,
        max,
        keyGenerator: () => 'exhaust-key',
      })
    );
    app.get('/test-exhaust', (c) => c.text('ok'));

    // Consume all tokens
    for (let i = 0; i < max; i++) {
      const res = await app.request('/test-exhaust');
      expect(res.status).toBe(200);
    }

    // Next request must be rejected with 429
    const blockedRes = await app.request('/test-exhaust');
    expect(blockedRes.status).toBe(429);
    expect(blockedRes.headers.get('Retry-After')).toBeDefined();
    expect(blockedRes.headers.get('RateLimit-Remaining')).toBe('0');

    const json = (await blockedRes.json()) as ApiErrorResponse;
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('TOO_MANY_REQUESTS');
    expect(json.error.retryAfterSeconds).toBeDefined();
    expect(json.error.requestId).toBeDefined();
  });

  it('prevents rate-limit bypass: untrusted peer cannot spoof X-Forwarded-For', async () => {
    const app = createTestApp();
    app.use('*', trustedProxyMiddleware());
    app.use(
      '/test-spoof',
      rateLimitMiddleware({
        windowMs: 60000,
        max: 2,
        keyGenerator: (c) => `spoof:${c.get('clientIp')}`,
      })
    );
    app.get('/test-spoof', (c) => c.text('ok'));

    const untrustedPeerEnv = { remoteAddress: '198.51.100.50' };

    // Request 1: sends fake XFF header
    const res1 = await app.request('/test-spoof', { headers: { 'x-forwarded-for': '1.1.1.1' } }, untrustedPeerEnv);
    expect(res1.status).toBe(200);

    // Request 2: sends different fake XFF header
    const res2 = await app.request('/test-spoof', { headers: { 'x-forwarded-for': '2.2.2.2' } }, untrustedPeerEnv);
    expect(res2.status).toBe(200);

    // Request 3: sends another fake XFF header - MUST BE BLOCKED because peer is 198.51.100.50
    const res3 = await app.request('/test-spoof', { headers: { 'x-forwarded-for': '3.3.3.3' } }, untrustedPeerEnv);
    expect(res3.status).toBe(429);
  });

  it('respects X-Forwarded-For when request comes from a configured trusted proxy', async () => {
    const app = createTestApp();
    app.use('*', trustedProxyMiddleware());
    app.use(
      '/test-trusted',
      rateLimitMiddleware({
        windowMs: 60000,
        max: 2,
        keyGenerator: (c) => `trusted:${c.get('clientIp')}`,
      })
    );
    app.get('/test-trusted', (c) => c.text('ok'));

    // Peer is 127.0.0.1 (configured in TRUSTED_PROXIES)
    const trustedProxyEnv = { remoteAddress: '127.0.0.1' };

    // Client A sends 2 requests through trusted proxy
    await app.request('/test-trusted', { headers: { 'x-forwarded-for': '203.0.113.1' } }, trustedProxyEnv);
    await app.request('/test-trusted', { headers: { 'x-forwarded-for': '203.0.113.1' } }, trustedProxyEnv);
    const clientABlocked = await app.request(
      '/test-trusted',
      { headers: { 'x-forwarded-for': '203.0.113.1' } },
      trustedProxyEnv
    );
    expect(clientABlocked.status).toBe(429);

    // Client B sends request through same trusted proxy - has its own bucket
    const clientBAllowed = await app.request(
      '/test-trusted',
      { headers: { 'x-forwarded-for': '203.0.113.2' } },
      trustedProxyEnv
    );
    expect(clientBAllowed.status).toBe(200);
  });
});
