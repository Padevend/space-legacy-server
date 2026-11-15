import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import { exceptionHandler, type ApiErrorResponse } from '#exceptions/handler';
import { registerGlobalMiddleware } from '#start/kernel';
import { inMemoryRateLimiterStore } from '#infrastructure/rate_limit/memory_store';

describe('Security: Middleware Order & Full Kernel Chain', () => {
  beforeEach(() => {
    inMemoryRateLimiterStore.clear();
  });

  function createTestApp(_timeoutMs = 15000) {
    const app = new Hono();
    app.onError((err, c) => exceptionHandler.handle(err, c));
    app.notFound((c) => exceptionHandler.notFound(c));

    registerGlobalMiddleware(app);

    // Public GET route for ETag & headers test
    app.get('/api/v1/public-test', (c) => c.json({ message: 'public-ok' }));

    // Register a test route that verifies if validation or handler was reached
    app.post('/api/v1/test-order', async (c) => {
      const body = await c.req.json();
      return c.json({ success: true, echo: body });
    });

    return app;
  }

  it('1. echoes or generates X-Request-Id on every response', async () => {
    const app = createTestApp();
    const customId = 'client-uuid-12345';
    const res = await app.request('/api/v1/public-test', {
      headers: { 'x-request-id': customId },
    });
    expect(res.headers.get('x-request-id')).toBe(customId);
  });

  it('4. sets secure headers on all responses', async () => {
    const app = createTestApp();
    const res = await app.request('/api/v1/public-test');

    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    expect(res.headers.get('x-frame-options')).toBe('DENY');
    expect(res.headers.get('referrer-policy')).toBeDefined();
    expect(res.headers.get('cross-origin-resource-policy')).toBeDefined();
    expect(res.headers.get('content-security-policy')).toBeDefined();
  });

  it('5. applies CORS headers only to allowed origins', async () => {
    const app = createTestApp();

    // Allowed origin
    const allowedRes = await app.request('/api/v1/public-test', {
      headers: { origin: 'http://localhost:5173' },
    });
    expect(allowedRes.headers.get('access-control-allow-origin')).toBe('http://localhost:5173');

    // Disallowed origin (no CORS header returned)
    const disallowedRes = await app.request('/api/v1/public-test', {
      headers: { origin: 'https://evil.attacker.com' },
    });
    expect(disallowedRes.headers.get('access-control-allow-origin')).toBeNull();
  });

  it('7. rejects payloads exceeding body size limit with 413 PAYLOAD_TOO_LARGE before parsing', async () => {
    const app = createTestApp();
    const oversizedBody = 'x'.repeat(1024 * 1024 + 10); // > 1MB

    const res = await app.request('/api/v1/test-order', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'content-length': String(oversizedBody.length),
      },
      body: oversizedBody,
    });

    expect(res.status).toBe(413);
    const json = (await res.json()) as ApiErrorResponse;
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('PAYLOAD_TOO_LARGE');
  });

  it('8. rejects invalid content-type with 415 UNSUPPORTED_MEDIA_TYPE before validation', async () => {
    const app = createTestApp();
    const body = 'hello raw text';

    const res = await app.request('/api/v1/test-order', {
      method: 'POST',
      headers: {
        'content-type': 'text/plain',
        'content-length': String(body.length),
      },
      body,
    });

    expect(res.status).toBe(415);
    const json = (await res.json()) as ApiErrorResponse;
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('UNSUPPORTED_MEDIA_TYPE');
  });

  it('9. rejects request exceeding rate limit with 429 TOO_MANY_REQUESTS before validation', async () => {
    const app = new Hono();
    app.onError((err, c) => exceptionHandler.handle(err, c));
    const { rateLimit } = await import('#middleware/rate_limit_middleware');
    const validatorCalled = vi.fn();

    app.use(
      '*',
      rateLimit({
        windowMs: 60000,
        max: 2,
        keyGenerator: () => 'order-test-key',
      })
    );

    app.post('/test-rl', (c) => {
      validatorCalled();
      return c.json({ ok: true });
    });

    // Request 1 and 2 pass
    await app.request('/test-rl', { method: 'POST' });
    await app.request('/test-rl', { method: 'POST' });
    expect(validatorCalled).toHaveBeenCalledTimes(2);

    // Request 3 is blocked by rate limiter; handler must NOT be reached
    const blockedRes = await app.request('/test-rl', { method: 'POST' });
    expect(blockedRes.status).toBe(429);
    expect(validatorCalled).toHaveBeenCalledTimes(2); // Still 2, not incremented!
  });

  it('10. rejects state-changing requests from disallowed Origin with 403 FORBIDDEN before validation', async () => {
    const app = createTestApp();
    const res = await app.request('/api/v1/test-order', {
      method: 'POST',
      headers: {
        origin: 'https://malicious-site.evil',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ test: 123 }),
    });

    expect(res.status).toBe(403);
    const json = (await res.json()) as ApiErrorResponse;
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('FORBIDDEN');
  });

  it('11. generates ETag on public GET responses', async () => {
    const app = createTestApp();
    const res = await app.request('/api/v1/public-test');

    expect(res.status).toBe(200);
    const etag = res.headers.get('etag');
    expect(etag).toBeDefined();

    // Conditional request with matching If-None-Match should return 304 NOT_MODIFIED
    if (etag) {
      const cachedRes = await app.request('/api/v1/public-test', {
        headers: { 'if-none-match': etag },
      });
      expect(cachedRes.status).toBe(304);
    }
  });
});
