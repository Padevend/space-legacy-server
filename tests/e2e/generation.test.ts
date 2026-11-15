import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp } from '../helpers/test_app.js';
import { prisma } from '#infrastructure/database/prisma_client';
import { startFakePythonServer } from '../fake-python-service/index.js';
import { pythonGenerationService } from '../../app/modules/generation/services/python_generation_service.js';

describe('Stage S10: Asynchronous Generation Pipeline & Python Client (E2E-Generation)', () => {
  const app = getTestApp();

  let adminToken: string;
  let userToken: string;
  let anonToken: string;

  const testUserEmail = 'regular.user.s10@spacelegacy.test';
  const testUserPassword = 'RegularUserPassword123!';
  const adminEmail = 'admin@spacelegacy.test';
  const adminPassword = 'AdminSpaceLegacy2026!';

  let fakeServer: ReturnType<typeof startFakePythonServer>;
  const fakePort = 4098;

  let testMachineId: string;
  let testLogbookEntryId: string;
  const testEntrySlug = 'test-s10-generation-logbook';

  async function cleanup() {
    // Clean up created generation jobs for test entry
    const entry = await prisma.logbookEntry.findFirst({
      where: { slug: testEntrySlug },
    });
    if (entry) {
      await prisma.generationJob.deleteMany({
        where: { logbookEntryId: entry.id },
      });
      await prisma.logbookEntry.delete({
        where: { id: entry.id },
      });
    }

    // Clean up test user
    const existingUser = await prisma.account.findUnique({
      where: { email: testUserEmail },
    });
    if (existingUser) {
      await prisma.visitor.delete({ where: { id: existingUser.visitorId } }).catch(() => {});
    }
  }

  beforeAll(async () => {
    // 1. Start fake Python service
    fakeServer = startFakePythonServer(fakePort);
    pythonGenerationService.setBaseUrl(fakeServer.baseUrl);

    await cleanup();

    // 2. Fetch or identify existing machine (e.g. curiosity)
    const machine = await prisma.machine.findFirst({
      where: { slug: 'curiosity' },
    });
    expect(machine).not.toBeNull();
    testMachineId = machine!.id;

    // 3. Create a test logbook entry
    const entry = await prisma.logbookEntry.create({
      data: {
        machineId: testMachineId,
        slug: testEntrySlug,
        title: 'Surveyor 1 Descent & Telemetry Analysis',
        summary: 'Story about Surveyor 1 landing telemetries and descent logs.',
        articleMarkdown: 'Initial draft article.',
        isPublished: true,
      },
    });
    testLogbookEntryId = entry.id;

    // 4. Anonymous session
    const anonRes = await app.request('/api/v1/session/anonymous', { method: 'POST' });
    expect(anonRes.status).toBe(200);
    const anonBody = await anonRes.json();
    anonToken = anonBody.token;

    // 5. Login as Admin
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonToken}`,
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginBody = await loginRes.json();
    adminToken = loginBody.token;

    // 6. Register regular user
    const regAnonRes = await app.request('/api/v1/session/anonymous', { method: 'POST' });
    const regAnonBody = await regAnonRes.json();
    const userRegRes = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${regAnonBody.token}`,
      },
      body: JSON.stringify({
        email: testUserEmail,
        password: testUserPassword,
        displayName: 'Test User S10',
      }),
    });
    expect(userRegRes.status).toBe(201);
    const userRegBody = await userRegRes.json();
    userToken = userRegBody.token;
  });

  afterAll(async () => {
    await cleanup();
    fakeServer.close();
  });

  // --- ACCESS CONTROL MATRIX ---
  describe('RBAC Access Matrix on /api/v1/admin/generation', () => {
    it('rejects unauthenticated request to GET /jobs with 401', async () => {
      const res = await app.request('/api/v1/admin/generation/jobs');
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error.code).toBe('UNAUTHENTICATED');
    });

    it('rejects regular USER request to GET /jobs with 403', async () => {
      const res = await app.request('/api/v1/admin/generation/jobs', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error.code).toBe('FORBIDDEN');
    });

    it('allows ADMIN to GET /jobs with 200', async () => {
      const res = await app.request('/api/v1/admin/generation/jobs', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body.jobs)).toBe(true);
      expect(typeof body.total).toBe('number');
    });
  });

  // --- ARTICLE GENERATION JOURNEY ---
  describe('Article Generation Workflow', () => {
    let createdJobId: string;

    it('submits an ARTICLE generation job and automatically updates logbook entry markdown upon success', async () => {
      const res = await app.request('/api/v1/admin/generation/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          logbookEntryId: testLogbookEntryId,
          kind: 'ARTICLE',
          title: 'Surveyor 1 Descent Analysis',
          prompt: 'Generate detailed scientific account of Surveyor 1 radar descent.',
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.job).toBeDefined();
      expect(body.job.kind).toBe('ARTICLE');
      expect(body.job.status).toBe('SUCCEEDED');
      expect(body.job.resultText).toContain('Surveyor 1 Descent Analysis');
      expect(body.job.externalJobId).toBeDefined();
      createdJobId = body.job.id;

      // Verify in DB
      const dbJob = await prisma.generationJob.findUnique({
        where: { id: createdJobId },
      });
      expect(dbJob).not.toBeNull();
      expect(dbJob!.status).toBe('SUCCEEDED');
      expect(dbJob!.resultText).toBeTruthy();

      // Verify logbook entry was updated with generated article
      const updatedEntry = await prisma.logbookEntry.findUnique({
        where: { id: testLogbookEntryId },
      });
      expect(updatedEntry!.articleMarkdown).toBe(dbJob!.resultText);
    });

    it('allows ADMIN to fetch job details by ID via GET /jobs/:id', async () => {
      const res = await app.request(`/api/v1/admin/generation/jobs/${createdJobId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.job.id).toBe(createdJobId);
      expect(body.job.status).toBe('SUCCEEDED');
      expect(body.job.kind).toBe('ARTICLE');
    });
  });

  // --- VIDEO GENERATION JOURNEY ---
  describe('Video Generation Workflow & Host Validation', () => {
    it('submits a VIDEO generation job and updates logbook entry videoUrl upon valid NASA host', async () => {
      const res = await app.request('/api/v1/admin/generation/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          logbookEntryId: testLogbookEntryId,
          kind: 'VIDEO',
          title: 'Surveyor 1 Lunar Landing Animation',
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.job.kind).toBe('VIDEO');
      expect(body.job.status).toBe('SUCCEEDED');
      expect(body.job.resultUrl).toContain('https://media.nasa.gov/videos/');

      // Verify logbook entry was updated with generated video URL
      const updatedEntry = await prisma.logbookEntry.findUnique({
        where: { id: testLogbookEntryId },
      });
      expect(updatedEntry!.videoUrl).toBe(body.job.resultUrl);
    });

    it('rejects generated video URL with untrusted host and marks job as FAILED', async () => {
      const res = await app.request('/api/v1/admin/generation/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          logbookEntryId: testLogbookEntryId,
          kind: 'VIDEO',
          simulateUntrustedHost: true,
        }),
      });

      // Throws 422 because resultUrl domain is not in ALLOWED_RESULT_HOSTS
      expect(res.status).toBe(422);
      const body = await res.json();
      expect(body.error).toBeDefined();
      expect(body.error.code).toBe('VALIDATION_ERROR');
      expect(body.error.message).toContain('malicious-site.com');

      // Verify the latest job in DB reflects failure and videoUrl on entry was NOT overwritten
      const failedJob = await prisma.generationJob.findFirst({
        where: { logbookEntryId: testLogbookEntryId },
        orderBy: { createdAt: 'desc' },
      });
      expect(failedJob).not.toBeNull();
      expect(failedJob!.status).toBe('FAILED');
    });
  });

  // --- ERROR HANDLING & SIMULATED FAILURE ---
  describe('Failure Handling & Cancellation', () => {
    it('handles simulated synthesis failure by marking job as FAILED', async () => {
      const res = await app.request('/api/v1/admin/generation/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          logbookEntryId: testLogbookEntryId,
          kind: 'ARTICLE',
          simulateFailure: true,
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.job.status).toBe('FAILED');
      expect(body.job.errorCode).toBe('SYNTHESIS_FAILED');
      expect(body.job.errorMessage).toContain('Simulated AI generation failure');
    });

    it('rejects job submission for non-existent logbook entry with 404', async () => {
      const nonExistentUuid = 'a0000000-0000-4000-8000-000000000099';
      const res = await app.request('/api/v1/admin/generation/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          logbookEntryId: nonExistentUuid,
          kind: 'ARTICLE',
        }),
      });

      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.error.code).toBe('NOT_FOUND');
    });

    it('allows cancelling a job via POST /jobs/:id/cancel', async () => {
      // Create a queued job directly in DB
      const queuedJob = await prisma.generationJob.create({
        data: {
          logbookEntryId: testLogbookEntryId,
          kind: 'ARTICLE',
          status: 'QUEUED',
          requestPayload: { test: true },
        },
      });

      const res = await app.request(`/api/v1/admin/generation/jobs/${queuedJob.id}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.job.status).toBe('CANCELLED');

      const inDb = await prisma.generationJob.findUnique({ where: { id: queuedJob.id } });
      expect(inDb!.status).toBe('CANCELLED');
    });

    it('allows polling a job via POST /jobs/:id/poll', async () => {
      const queuedJob = await prisma.generationJob.create({
        data: {
          logbookEntryId: testLogbookEntryId,
          kind: 'ARTICLE',
          status: 'SUCCEEDED',
          resultText: 'Poll test content',
          requestPayload: { test: true },
        },
      });

      const res = await app.request(`/api/v1/admin/generation/jobs/${queuedJob.id}/poll`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.job.id).toBe(queuedJob.id);
      expect(body.job.status).toBe('SUCCEEDED');
    });
  });

  // --- QUERY FILTERING ---
  describe('Listing & Filtering Jobs', () => {
    it('filters jobs by status and kind via GET /jobs', async () => {
      const res = await app.request('/api/v1/admin/generation/jobs?status=SUCCEEDED&kind=ARTICLE', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.jobs.length).toBeGreaterThan(0);
      for (const j of body.jobs) {
        expect(j.status).toBe('SUCCEEDED');
        expect(j.kind).toBe('ARTICLE');
      }
    });
  });
});
