import { describe, it, expect } from 'vitest';
import { getTestApp } from '../helpers/test_app.js';
import { pingDatabase } from '../helpers/db_helper.js';
import { createFakePythonApp } from '../fake-python-service/index.js';

describe('Stage S1: Test Foundation & Infrastructure (E2E)', () => {
  const app = getTestApp();
  const { app: fakePyApp } = createFakePythonApp({ apiKey: 'ci-secret-key' });

  it('verifies real PostgreSQL database connectivity via test helper', async () => {
    const isConnected = await pingDatabase();
    expect(isConnected).toBe(true);
  });

  it('verifies health ready probe confirms database status', async () => {
    const res = await app.request('/health/ready');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('ready');
    expect(body.data.database).toBe('connected');
  });

  it('verifies fake Python service enforces X-api-key authentication', async () => {
    // Missing key
    const unauthRes = await fakePyApp.request('/health');
    expect(unauthRes.status).toBe(401);

    // Invalid key
    const badKeyRes = await fakePyApp.request('/health', {
      headers: { 'x-api-key': 'wrong-key' },
    });
    expect(badKeyRes.status).toBe(401);

    // Valid key
    const validRes = await fakePyApp.request('/health', {
      headers: { 'x-api-key': 'ci-secret-key' },
    });
    expect(validRes.status).toBe(200);
    const body = await validRes.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('fake-python-generator');
  });

  it('verifies fake Python service can queue and retrieve generation jobs', async () => {
    const submitRes = await fakePyApp.request('/jobs', {
      method: 'POST',
      headers: {
        'x-api-key': 'ci-secret-key',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        kind: 'VIDEO',
        title: 'Apollo 11 Descent',
        context: { machineName: 'Lunar Module Eagle' },
      }),
    });

    expect(submitRes.status).toBe(202);
    const submitBody = await submitRes.json();
    expect(submitBody.jobId).toBeDefined();

    const getRes = await fakePyApp.request(`/jobs/${submitBody.jobId}`, {
      headers: { 'x-api-key': 'ci-secret-key' },
    });
    expect(getRes.status).toBe(200);
    const job = await getRes.json();
    expect(job.status).toBe('SUCCEEDED');
    expect(job.resultUrl).toContain('https://media.nasa.gov/videos/');
  });
});
