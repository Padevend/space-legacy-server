import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp } from '../helpers/test_app.js';
import { prisma } from '#infrastructure/database/prisma_client';

describe('E2E - Dashboard & Back-Office Interface (S11)', () => {
  const app = getTestApp();

  let adminToken: string;
  let userToken: string;
  let anonToken: string;

  const testUserEmail = 'dashboard-regular-user@spacelegacy.test';
  const testUserPassword = 'RegularUserPassword123!';
  const adminEmail = 'admin@spacelegacy.test';
  const adminPassword = 'AdminSpaceLegacy2026!';

  async function cleanup() {
    const existingUser = await prisma.account.findUnique({
      where: { email: testUserEmail },
    });
    if (existingUser) {
      await prisma.visitor.delete({ where: { id: existingUser.visitorId } }).catch(() => {});
    }
  }

  beforeAll(async () => {
    await cleanup();

    // 1. Anonymous session
    const anonRes = await app.request('/api/v1/session/anonymous', { method: 'POST' });
    expect(anonRes.status).toBe(200);
    const anonBody = await anonRes.json();
    anonToken = anonBody.token;

    // 2. Admin login
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

    // 3. Register regular USER
    const regAnonRes = await app.request('/api/v1/session/anonymous', { method: 'POST' });
    const regAnonBody = await regAnonRes.json();
    const regRes = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${regAnonBody.token}`,
      },
      body: JSON.stringify({
        email: testUserEmail,
        password: testUserPassword,
        displayName: 'Dashboard Regular User',
      }),
    });
    expect(regRes.status).toBe(201);
    const regBody = await regRes.json();
    userToken = regBody.token;
  });

  afterAll(async () => {
    await cleanup();
  });

  describe('UI Serving (GET /admin)', () => {
    it('serves the admin single-page dashboard HTML application', async () => {
      const res = await app.request('/admin');

      expect(res.status).toBe(200);
      const contentType = res.headers.get('content-type');
      expect(contentType).toContain('text/html');

      const html = await res.text();
      expect(html).toContain('SPACE LEGACY');
      expect(html).toContain('MISSION CONTROL');
      expect(html).toContain('data-section="overview"');
      expect(html).toContain('data-section="machines"');
      expect(html).toContain('data-section="quizzes"');
      expect(html).toContain('data-section="ingestion"');
      expect(html).toContain('data-section="generation"');
      expect(html).toContain('id="authStatus"');
      expect(html).toContain('id="editorEmptyState"');
      expect(html).toContain('id="dryRunValidateBtn"');
    });
  });

  describe('RBAC Access Matrix on Dashboard API (GET /api/v1/admin/overview)', () => {
    it('rejects unauthenticated request with 401 UNAUTHENTICATED', async () => {
      const res = await app.request('/api/v1/admin/overview');
      expect(res.status).toBe(401);

      const body = await res.json();
      expect(body.error).toBeDefined();
      expect(body.error.code).toBe('UNAUTHENTICATED');
    });

    it('rejects anonymous session visitor with 401 UNAUTHENTICATED', async () => {
      const res = await app.request('/api/v1/admin/overview', {
        headers: { Authorization: `Bearer ${anonToken}` },
      });
      expect(res.status).toBe(401);

      const body = await res.json();
      expect(body.error).toBeDefined();
      expect(body.error.code).toBe('UNAUTHENTICATED');
    });

    it('rejects authenticated USER role with 403 FORBIDDEN', async () => {
      const res = await app.request('/api/v1/admin/overview', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(res.status).toBe(403);

      const body = await res.json();
      expect(body.error).toBeDefined();
      expect(body.error.code).toBe('FORBIDDEN');
      expect(body.error.message).toBe('Admin role required to perform this action.');
    });

    it('authorizes authenticated ADMIN role with 200 and complete telemetry', async () => {
      const res = await app.request('/api/v1/admin/overview', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.overview).toBeDefined();
      const o = body.overview;

      // Counters structure
      expect(o.counters).toBeDefined();
      expect(o.counters.machines).toBeDefined();
      expect(o.counters.machines.total).toBeGreaterThanOrEqual(7);
      expect(o.counters.machines.published).toBeGreaterThanOrEqual(1);
      expect(o.counters.machines.unpublished).toBeGreaterThanOrEqual(0);

      expect(o.counters.celestialBodies).toBeDefined();
      expect(o.counters.celestialBodies.total).toBe(2);

      expect(o.counters.logbook).toBeDefined();
      expect(o.counters.logbook.total).toBeGreaterThanOrEqual(1);

      expect(o.counters.quizzes).toBeDefined();
      expect(o.counters.quizzes.total).toBeGreaterThanOrEqual(2);

      // Ingestion and Jobs
      expect(typeof o.failedJobsCount).toBe('number');
      expect(o.unpublishedContent).toBeDefined();
      expect(Array.isArray(o.unpublishedContent.machines)).toBe(true);
      expect(Array.isArray(o.unpublishedContent.logbook)).toBe(true);
    });
  });

  describe('Consistency of Aggregations with Mutated Data', () => {
    it('accurately updates counters when content is toggled between published and unpublished', async () => {
      // Create an isolated temporary test machine to prevent cross-test parallel races
      const moon = await prisma.celestialBody.findUnique({ where: { slug: 'moon' } });
      expect(moon).not.toBeNull();

      const testMachine = await prisma.machine.create({
        data: {
          slug: 'dashboard-temp-toggle-test',
          name: 'Dashboard Temp Toggle Test',
          summary: 'Temporary test machine summary for dashboard aggregation verification.',
          description: 'Temporary test machine description for dashboard verification.',
          missionPurpose: 'Test mission purpose.',
          howItWorked: 'Test mechanism.',
          discoveries: 'Test discoveries.',
          kind: 'LANDER',
          state: 'JOB_FINISHED',
          bodyId: moon!.id,
          isPublished: false,
        },
      });

      try {
        // Initial overview read
        const initialRes = await app.request('/api/v1/admin/overview', {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        const initialBody = await initialRes.json();
        const initialPublished = initialBody.overview.counters.machines.published;
        const initialUnpublished = initialBody.overview.counters.machines.unpublished;

        // Toggle publication status using targeted PATCH
        const patchRes = await app.request(`/api/v1/admin/machines/${testMachine.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ isPublished: true }),
        });
        expect(patchRes.status).toBe(200);

        // Verify mutated overview reflects immediately
        const updatedRes = await app.request('/api/v1/admin/overview', {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        const updatedBody = await updatedRes.json();
        expect(updatedBody.overview.counters.machines.published).toBe(initialPublished + 1);
        expect(updatedBody.overview.counters.machines.unpublished).toBe(initialUnpublished - 1);
      } finally {
        await prisma.machine.delete({ where: { id: testMachine.id } }).catch(() => {});
      }
    });
  });
});
