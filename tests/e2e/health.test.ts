import { describe, it, expect } from 'vitest';
import { createServer } from '../../bin/server.js';

describe('Health Endpoints (E2E)', () => {
  const app = createServer();

  it('GET /api/v1/health/live returns 200 with ok status and unified envelope', async () => {
    const res = await app.request('/api/v1/health/live');

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');
    expect(res.headers.get('x-request-id')).toBeDefined();

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('ok');
    expect(typeof body.data.uptimeSeconds).toBe('number');
    expect(body.data.timestamp).toBeDefined();
    expect(body.meta.requestId).toBeDefined();
  });

  it('GET /health/live (root alias) returns 200 with ok status', async () => {
    const res = await app.request('/health/live');

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('ok');
  });

  it('GET /api/v1/health/ready returns 200 with ready status and database connected', async () => {
    const res = await app.request('/api/v1/health/ready');

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('ready');
    expect(body.data.database).toBe('connected');
    expect(body.meta.requestId).toBeDefined();
  });
});
