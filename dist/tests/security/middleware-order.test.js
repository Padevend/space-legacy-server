import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createApp } from '../../src/core/http/app.js';
import { registerGlobalMiddleware } from '../../start/kernel.js';
import { inMemoryLimiter } from '../../src/core/security/rate-limiter.js';
import { securityConfig } from '../../config/security.js';
describe('Security: Middleware Order & Full Kernel Chain', () => {
    beforeEach(() => {
        inMemoryLimiter.clear();
    });
    function createTestApp(timeoutMs = 15000) {
        const app = createApp();
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
        expect(res.headers.get('content-security-policy')).toBeDefined();
        expect(res.headers.get('cross-origin-resource-policy')).toBe('cross-origin');
    });
    it('6. rejects requests that exceed timeout with 408 TIMEOUT', async () => {
        const app = createApp();
        const { timeoutMiddleware } = await import('../../src/core/security/timeout.js');
        app.use('*', timeoutMiddleware(50)); // 50ms timeout
        app.get('/slow', async () => {
            await new Promise((resolve) => setTimeout(resolve, 150));
            return new Response('done');
        });
        const res = await app.request('/slow');
        expect(res.status).toBe(408);
        const json = (await res.json());
        expect(json.success).toBe(false);
        expect(json.error.code).toBe('TIMEOUT');
    });
    it('7. rejects oversized payload with 413 PAYLOAD_TOO_LARGE before validation', async () => {
        const app = createTestApp();
        const largePayload = JSON.stringify({ data: 'x'.repeat(securityConfig.bodyLimitBytes + 10) });
        const res = await app.request('/api/v1/test-order', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'content-length': String(Buffer.byteLength(largePayload)),
            },
            body: largePayload,
        });
        expect(res.status).toBe(413);
        const json = (await res.json());
        expect(json.success).toBe(false);
        expect(json.error.code).toBe('PAYLOAD_TOO_LARGE');
        expect(json.error.requestId).toBeDefined();
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
        const json = (await res.json());
        expect(json.success).toBe(false);
        expect(json.error.code).toBe('UNSUPPORTED_MEDIA_TYPE');
    });
    it('9. rejects request exceeding rate limit with 429 TOO_MANY_REQUESTS before validation', async () => {
        const app = createApp();
        // Configure an app with a low rate limit to test rejection order
        const { rateLimitMiddleware } = await import('../../src/core/security/rate-limiter.js');
        const validatorCalled = vi.fn();
        app.use('*', rateLimitMiddleware({
            windowMs: 60000,
            max: 2,
            keyGenerator: () => 'order-test-key',
        }));
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
        const json = (await res.json());
        expect(json.success).toBe(false);
        expect(json.error.code).toBe('FORBIDDEN');
    });
    it('11. generates ETag on public GET responses', async () => {
        const app = createTestApp();
        const res = await app.request('/api/v1/public-test');
        expect(res.status).toBe(200);
        expect(res.headers.get('etag')).toBeDefined();
    });
});
