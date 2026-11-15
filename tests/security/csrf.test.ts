import { describe, it, expect } from 'vitest';
import { createApp } from '../../src/core/http/app.js';
import { csrfGuardMiddleware, strictCookieCsrfMiddleware } from '../../src/core/security/csrf.js';
import type { ApiErrorResponse } from '../../src/core/exceptions/error-handler.js';

describe('Security: CSRF Guard', () => {
  it('allows safe methods (GET, HEAD, OPTIONS) regardless of Origin header', async () => {
    const app = createApp();
    app.use('*', csrfGuardMiddleware());
    app.get('/test-get', (c) => c.text('get-ok'));

    const res = await app.request('/test-get', {
      method: 'GET',
      headers: { origin: 'https://malicious-attacker.com' },
    });
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('get-ok');
  });

  it('blocks state-changing requests (POST) from disallowed Origin with 403 FORBIDDEN', async () => {
    const app = createApp();
    app.use('*', csrfGuardMiddleware());
    app.post('/test-post', (c) => c.text('post-ok'));

    const res = await app.request('/test-post', {
      method: 'POST',
      headers: {
        origin: 'https://evil-site.com',
        'content-type': 'application/json',
      },
    });
    expect(res.status).toBe(403);

    const json = (await res.json()) as ApiErrorResponse;
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('FORBIDDEN');
    expect(json.error.message).toContain('CSRF protection blocked the request');
  });

  it('allows state-changing requests from allowed Origin', async () => {
    const app = createApp();
    app.use('*', csrfGuardMiddleware());
    app.post('/test-post', (c) => c.text('post-ok'));

    const res = await app.request('/test-post', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
        'content-type': 'application/json',
      },
    });
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('post-ok');
  });

  it('strictCookieCsrfMiddleware blocks sensitive auth requests missing X-CSRF-Token header', async () => {
    const app = createApp();
    app.use('/auth-sensitive', strictCookieCsrfMiddleware());
    app.post('/auth-sensitive', (c) => c.text('sensitive-ok'));

    // Allowed origin, but missing X-CSRF-Token
    const res = await app.request('/auth-sensitive', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
    });
    expect(res.status).toBe(403);

    const json = (await res.json()) as ApiErrorResponse;
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('FORBIDDEN');
    expect(json.error.message).toContain('Missing required X-CSRF-Token');
  });

  it('strictCookieCsrfMiddleware allows requests with allowed Origin and valid X-CSRF-Token header', async () => {
    const app = createApp();
    app.use('/auth-sensitive', strictCookieCsrfMiddleware());
    app.post('/auth-sensitive', (c) => c.text('sensitive-ok'));

    const res = await app.request('/auth-sensitive', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
        'x-csrf-token': 'token-123',
      },
    });
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('sensitive-ok');
  });
});
