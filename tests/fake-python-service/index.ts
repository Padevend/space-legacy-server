import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import crypto from 'node:crypto';

export interface FakeJob {
  jobId: string;
  kind: 'VIDEO' | 'ARTICLE';
  status: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  resultUrl?: string | null;
  resultText?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function createFakePythonApp(options?: { apiKey?: string; defaultAllowedHost?: string }) {
  const apiKey = options?.apiKey ?? process.env['PY_API_KEY'] ?? 'test-py-api-key';
  const allowedHost = options?.defaultAllowedHost ?? 'https://media.nasa.gov';
  const jobs = new Map<string, FakeJob>();

  const app = new Hono();

  // Auth gate
  app.use('*', async (c, next) => {
    const providedKey = c.req.header('x-api-key');
    if (!providedKey || providedKey !== apiKey) {
      return c.json({ error: 'Unauthorized: Invalid or missing X-api-key header' }, 401);
    }
    await next();
  });

  // Health probe of fake service
  app.get('/health', (c) => c.json({ status: 'ok', service: 'fake-python-generator' }));

  // Submit job
  app.post('/jobs', async (c) => {
    const body = await c.req.json().catch(() => null);
    if (!body || !body.kind || !['VIDEO', 'ARTICLE'].includes(body.kind)) {
      return c.json({ error: 'Invalid payload: kind must be VIDEO or ARTICLE' }, 400);
    }

    const simulateFail = c.req.header('x-simulate-failure') === 'true' || body.simulateFailure === true;
    const simulateUntrustedHost = c.req.header('x-simulate-untrusted-host') === 'true';

    const jobId = crypto.randomUUID();
    const now = new Date().toISOString();

    const job: FakeJob = {
      jobId,
      kind: body.kind,
      status: simulateFail ? 'FAILED' : 'SUCCEEDED',
      errorCode: simulateFail ? 'SYNTHESIS_FAILED' : null,
      errorMessage: simulateFail ? 'Simulated AI generation failure' : null,
      resultUrl:
        body.kind === 'VIDEO'
          ? simulateUntrustedHost
            ? 'https://malicious-site.com/video.mp4'
            : `${allowedHost}/videos/${jobId}.mp4`
          : null,
      resultText:
        body.kind === 'ARTICLE'
          ? `# ${body.title ?? 'Mission Report'}\n\nAutomated generation complete based on NASA telemetry and archived data.`
          : null,
      createdAt: now,
      updatedAt: now,
    };

    jobs.set(jobId, job);
    return c.json({ jobId, status: job.status }, 202);
  });

  // Get job status
  app.get('/jobs/:jobId', (c) => {
    const jobId = c.req.param('jobId');
    const job = jobs.get(jobId);
    if (!job) {
      return c.json({ error: `Job ${jobId} not found` }, 404);
    }
    return c.json(job, 200);
  });

  // Cancel job
  app.post('/jobs/:jobId/cancel', (c) => {
    const jobId = c.req.param('jobId');
    const job = jobs.get(jobId);
    if (!job) {
      return c.json({ error: `Job ${jobId} not found` }, 404);
    }
    job.status = 'CANCELLED';
    job.updatedAt = new Date().toISOString();
    return c.json(job, 200);
  });

  // Test helper: reset state
  app.post('/_reset', (c) => {
    jobs.clear();
    return c.json({ reset: true });
  });

  return { app, jobs };
}

export function startFakePythonServer(port = 4055) {
  const { app, jobs } = createFakePythonApp();
  const server = serve({ fetch: app.fetch, port });
  return {
    server,
    jobs,
    close: () => server.close(),
    baseUrl: `http://localhost:${port}`,
  };
}
