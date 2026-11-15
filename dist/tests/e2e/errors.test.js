import { describe, it, expect } from 'vitest';
import { createApp } from '../../src/core/http/app.js';
import { registerGlobalMiddleware } from '../../start/kernel.js';
import { AppException } from '../../src/core/exceptions/AppException.js';
describe('Unified Error Handling (E2E)', () => {
    it('returns 404 with unified error envelope on nonexistent route', async () => {
        const app = createApp();
        registerGlobalMiddleware(app);
        const res = await app.request('/api/v1/nonexistent-endpoint-test');
        expect(res.status).toBe(404);
        expect(res.headers.get('content-type')).toContain('application/json');
        expect(res.headers.get('x-request-id')).toBeDefined();
        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.error).toBeDefined();
        expect(body.error.code).toBe('NOT_FOUND');
        expect(body.error.status).toBe(404);
        expect(typeof body.error.message).toBe('string');
        expect(body.error.requestId).toBeDefined();
    });
    it('catches unhandled exceptions and formats as 500 INTERNAL_ERROR', async () => {
        const app = createApp();
        registerGlobalMiddleware(app);
        app.get('/test-crash', () => {
            throw new Error('Database connection failed: /etc/secrets/db_password.txt line 42 SQL SELECT * FROM secret_table');
        });
        const res = await app.request('/test-crash');
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.error.code).toBe('INTERNAL_ERROR');
        expect(body.error.status).toBe(500);
        expect(body.error.requestId).toBeDefined();
    });
    it('guarantees production mode never leaks stack traces or file paths', async () => {
        const originalEnv = process.env['NODE_ENV'];
        process.env['NODE_ENV'] = 'production';
        const app = createApp();
        registerGlobalMiddleware(app);
        app.get('/test-prod-leak', () => {
            throw new Error('/var/app/src/secret.ts:42 syntax error near SELECT * FROM users');
        });
        const res = await app.request('/test-prod-leak');
        process.env['NODE_ENV'] = originalEnv;
        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.error.code).toBe('INTERNAL_ERROR');
        // In production, message is generic
        expect(body.error.message).not.toContain('/var/app');
        expect(body.error.message).not.toContain('SELECT * FROM');
        expect(body.error.message).not.toContain('syntax error');
        expect(body.error.stack).toBeUndefined();
    });
});
