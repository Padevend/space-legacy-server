import { describe, it, expect } from 'vitest';
import { createServer } from '../../bin/server.js';

describe('Security Headers Middleware (Security)', () => {
  const app = createServer();

  it('sets all mandatory baseline security headers on responses', async () => {
    const res = await app.request('/api/v1/health/live');

    expect(res.status).toBe(200);

    // 1. Content Security Policy
    const csp = res.headers.get('content-security-policy');
    expect(csp).toBeDefined();
    expect(csp).toContain("default-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");

    // 2. Nosniff
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');

    // 3. Referrer-Policy
    expect(res.headers.get('referrer-policy')).toBe('no-referrer');

    // 4. Permissions-Policy
    expect(res.headers.get('permissions-policy')).toBeDefined();

    // 5. Cross-Origin-Resource-Policy
    expect(res.headers.get('cross-origin-resource-policy')).toBe('cross-origin');

    // 6. X-Powered-By must be completely stripped
    expect(res.headers.get('x-powered-by')).toBeNull();

    // 7. X-Request-Id must be present
    expect(res.headers.get('x-request-id')).toBeDefined();
  });

  it('sets HSTS when NODE_ENV is production', async () => {
    const originalEnv = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'production';

    const prodApp = createServer();
    const res = await prodApp.request('/api/v1/health/live');
    process.env['NODE_ENV'] = originalEnv;

    expect(res.headers.get('strict-transport-security')).toBeDefined();
    expect(res.headers.get('strict-transport-security')).toContain('includeSubDomains');
  });
});
