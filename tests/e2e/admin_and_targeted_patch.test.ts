import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp } from '../helpers/test_app.js';
import { prisma } from '#infrastructure/database/prisma_client';

describe('Stage S8: Admin Surface, Access Matrix & Targeted PATCH (E2E-P7)', () => {
  const app = getTestApp();

  let adminToken: string;
  let userToken: string;
  let anonToken: string;

  const testUserEmail = 'regular.user.s8@spacelegacy.test';
  const testUserPassword = 'RegularUserPassword123!';
  const adminEmail = 'admin@spacelegacy.test';
  const adminPassword = 'AdminSpaceLegacy2026!';

  let moonBodyId: string;
  let createdMachineId: string;
  let createdSourceId: string;
  let createdFactId: string;
  let createdEventId: string;
  let createdImageId: string;
  let createdLogbookId: string;

  async function cleanup() {
    // Clean up created logbook entries for test slug
    await prisma.logbookEntry.deleteMany({
      where: { slug: 'apollo-12-surveyor-rendezvous' },
    });

    // Clean up created test machine
    await prisma.machine.deleteMany({
      where: { slug: 'apollo-12-lm' },
    });

    // Clean up test user
    const existingUser = await prisma.account.findUnique({
      where: { email: testUserEmail },
    });
    if (existingUser) {
      await prisma.visitor.delete({ where: { id: existingUser.visitorId } }).catch(() => {});
    }
  }

  beforeAll(async () => {
    await cleanup();

    // 1. Fetch Moon body id
    const moon = await prisma.celestialBody.findUnique({
      where: { slug: 'moon' },
    });
    expect(moon).not.toBeNull();
    moonBodyId = moon!.id;

    // 2. Obtain anonymous token
    const anonRes = await app.request('/api/v1/session/anonymous', { method: 'POST' });
    expect(anonRes.status).toBe(200);
    const anonBody = await anonRes.json();
    anonToken = anonBody.token;

    // 3. Obtain regular user token (register new user)
    const userRegRes = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: testUserEmail,
        password: testUserPassword,
        displayName: 'Regular Explorer S8',
      }),
    });
    expect(userRegRes.status).toBe(201);
    const userRegBody = await userRegRes.json();
    userToken = userRegBody.token;

    // 4. Obtain admin token (login with seeded admin account)
    const adminLoginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
      }),
    });
    expect(adminLoginRes.status).toBe(200);
    const adminLoginBody = await adminLoginRes.json();
    adminToken = adminLoginBody.token;
  });

  afterAll(async () => {
    await cleanup();
  });

  // --- Step 1: Access Control Matrix ---
  it('E2E-P7 Access Matrix: Rejects unauthenticated request with 401', async () => {
    const res = await app.request('/api/v1/admin/overview');
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBeDefined();
    expect(body.error.code).toBe('UNAUTHENTICATED');
  });

  it('E2E-P7 Access Matrix: Rejects anonymous visitor session with 401/403', async () => {
    const res = await app.request('/api/v1/admin/overview', {
      headers: { authorization: `Bearer ${anonToken}` },
    });
    expect([401, 403]).toContain(res.status);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it('E2E-P7 Access Matrix: Rejects regular authenticated USER with 403 Forbidden', async () => {
    const res = await app.request('/api/v1/admin/overview', {
      headers: { authorization: `Bearer ${userToken}` },
    });
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBeDefined();
    expect(body.error.code).toBe('FORBIDDEN');
    expect(body.error.message).toContain('Admin role required');
  });

  it('E2E-P7 Access Matrix: Authorizes ADMIN and returns admin overview metrics', async () => {
    const res = await app.request('/api/v1/admin/overview', {
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.overview).toBeDefined();
    expect(body.overview.counters).toBeDefined();
    expect(body.overview.counters.machines.total).toBeGreaterThanOrEqual(7);
    expect(body.overview.counters.celestialBodies.total).toBe(2);
    expect(body.overview.counters.logbook.total).toBeGreaterThanOrEqual(1);
    expect(body.overview.counters.quizzes.total).toBeGreaterThanOrEqual(2);
    expect(typeof body.overview.failedJobsCount).toBe('number');
    expect(body.overview.unpublishedContent).toBeDefined();
  });

  // --- Step 2: Targeted PATCH on Celestial Body ---
  it('E2E-P7 Targeted PATCH: Updates celestial body field and immediately reflects publicly', async () => {
    const newSummary = 'Earth natural satellite with historic Apollo landing sites and robotic artifacts.';

    // 1. Admin targeted PATCH
    const patchRes = await app.request(`/api/v1/admin/bodies/${moonBodyId}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        summary: newSummary,
      }),
    });

    expect(patchRes.status).toBe(200);
    const patchBody = await patchRes.json();
    expect(patchBody.celestialBody).toBeDefined();
    expect(patchBody.celestialBody.summary).toBe(newSummary);

    // 2. Verify public endpoint immediately reflects the change
    const publicRes = await app.request('/api/v1/bodies');
    expect(publicRes.status).toBe(200);
    const publicBody = await publicRes.json();
    const moon = publicBody.bodies.find((b: any) => b.id === moonBodyId);
    expect(moon).toBeDefined();
    expect(moon.summary).toBe(newSummary);
  });

  // --- Step 3: Machine Lifecycle (Create Draft, Visibility, Publication, Targeted PATCH) ---
  it('E2E-P7 Machine Lifecycle: Creates draft, verifies hidden from public, publishes, and updates targeted fields', async () => {
    // 1. Admin creates draft machine (isPublished: false)
    const createRes = await app.request('/api/v1/admin/machines', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        slug: 'apollo-12-lm',
        bodyId: moonBodyId,
        name: 'Apollo 12 Lunar Module Intrepid',
        kind: 'LANDER',
        state: 'JOB_FINISHED',
        stateSince: '1969-11-20',
        launchYear: 1969,
        arrivalYear: 1969,
        summary: 'Second crewed lunar landing, pinpoint touchdown near Surveyor 3 in Oceanus Procellarum.',
        description: 'Intrepid demonstrated precision landing on the Moon on November 19, 1969.',
        missionPurpose: 'Demonstrate precision landing capability and retrieve parts from Surveyor 3.',
        howItWorked: 'Descent stage rocket engine performed powered descent and landing.',
        discoveries: 'Proved targeted precision landings and retrieved parts analyzed on Earth.',
        latitude: -3.0124,
        longitude: -23.4216,
        isPublished: false,
      }),
    });

    expect(createRes.status).toBe(201);
    const createBody = await createRes.json();
    expect(createBody.machine).toBeDefined();
    expect(createBody.machine.id).toBeDefined();
    expect(createBody.machine.isPublished).toBe(false);
    createdMachineId = createBody.machine.id;

    // 2. Verify draft is invisible in public catalog search and detail
    const publicListRes = await app.request('/api/v1/machines?q=Intrepid');
    expect(publicListRes.status).toBe(200);
    const publicListBody = await publicListRes.json();
    expect(publicListBody.data.find((m: any) => m.slug === 'apollo-12-lm')).toBeUndefined();

    const publicDetailRes = await app.request('/api/v1/machines/apollo-12-lm');
    expect(publicDetailRes.status).toBe(404);

    // 3. Admin targeted PATCH: Publish machine (isPublished: true)
    const publishRes = await app.request(`/api/v1/admin/machines/${createdMachineId}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        isPublished: true,
      }),
    });

    expect(publishRes.status).toBe(200);
    const publishBody = await publishRes.json();
    expect(publishBody.machine.isPublished).toBe(true);

    // 4. Verify machine is now immediately visible publicly
    const publicNowRes = await app.request('/api/v1/machines/apollo-12-lm');
    expect(publicNowRes.status).toBe(200);
    const publicNowBody = await publicNowRes.json();
    expect(publicNowBody.machine).toBeDefined();
    expect(publicNowBody.machine.slug).toBe('apollo-12-lm');
    expect(publicNowBody.machine.name).toBe('Apollo 12 Lunar Module Intrepid');

    // 5. Admin targeted PATCH: Update currentStatusNote alone (N5)
    const updatedStatusNote = 'Descent stage remains at Oceanus Procellarum near Surveyor 3 crater.';
    const patchNoteRes = await app.request(`/api/v1/admin/machines/${createdMachineId}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        currentStatusNote: updatedStatusNote,
      }),
    });

    expect(patchNoteRes.status).toBe(200);
    const patchNoteBody = await patchNoteRes.json();
    expect(patchNoteBody.machine.currentStatusNote).toBe(updatedStatusNote);

    // 6. Public detail reflects new note without overwriting other fields
    const publicAfterNoteRes = await app.request('/api/v1/machines/apollo-12-lm');
    const publicAfterNoteBody = await publicAfterNoteRes.json();
    expect(publicAfterNoteBody.machine.currentStatusNote).toBe(updatedStatusNote);
    expect(publicAfterNoteBody.machine.name).toBe('Apollo 12 Lunar Module Intrepid');
  });

  // --- Step 4: Machine Sub-Resources Targeted Modifications ---
  it('E2E-P7 Sub-Resources: Validates source domain, creates and patches facts, events and images', async () => {
    // 1. Rejects source with untrusted non-NASA domain (N6 & N7)
    const rejectSourceRes = await app.request(`/api/v1/admin/machines/${createdMachineId}/sources`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Untrusted Blog',
        publisher: 'Random Person',
        url: 'https://fake-space-news.xyz/apollo-12',
      }),
    });
    expect([400, 422]).toContain(rejectSourceRes.status);
    const rejectSourceBody = await rejectSourceRes.json();
    expect(rejectSourceBody.error).toBeDefined();

    // 2. Creates valid NASA source
    const sourceRes = await app.request(`/api/v1/admin/machines/${createdMachineId}/sources`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: 'NASA Apollo 12 Mission Overview',
        publisher: 'NASA History Program Office',
        url: 'https://www.nasa.gov/mission_pages/apollo/apollo-12',
      }),
    });
    expect(sourceRes.status).toBe(201);
    const sourceBody = await sourceRes.json();
    expect(sourceBody.source).toBeDefined();
    createdSourceId = sourceBody.source.id;

    // 3. Creates key fact referencing the source
    const factRes = await app.request(`/api/v1/admin/machines/${createdMachineId}/facts`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        label: 'Landing Distance from Surveyor 3',
        value: '183',
        unit: 'meters',
        sourceId: createdSourceId,
        sortOrder: 1,
      }),
    });
    expect(factRes.status).toBe(201);
    const factBody = await factRes.json();
    expect(factBody.fact).toBeDefined();
    createdFactId = factBody.fact.id;

    // 4. Targeted PATCH on fact alone (N5)
    const patchFactRes = await app.request(`/api/v1/admin/machines/${createdMachineId}/facts/${createdFactId}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        value: '180',
      }),
    });
    expect(patchFactRes.status).toBe(200);
    const patchFactBody = await patchFactRes.json();
    expect(patchFactBody.fact.value).toBe('180');
    expect(patchFactBody.fact.label).toBe('Landing Distance from Surveyor 3');

    // 5. Creates timeline event referencing the source
    const eventRes = await app.request(`/api/v1/admin/machines/${createdMachineId}/events`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        dateLabel: 'November 19, 1969',
        dateIso: '1969-11-19T06:54:35Z',
        title: 'Lunar Touchdown at Oceanus Procellarum',
        description: 'Pete Conrad and Alan Bean landed Intrepid within walking distance of Surveyor 3.',
        sourceId: createdSourceId,
        sortOrder: 1,
      }),
    });
    expect(eventRes.status).toBe(201);
    const eventBody = await eventRes.json();
    expect(eventBody.event).toBeDefined();
    createdEventId = eventBody.event.id;

    // 6. Creates image
    const imageRes = await app.request(`/api/v1/admin/machines/${createdMachineId}/images`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        path: '/images/machines/apollo-12-lm/intrepid_surveyor.webp',
        alt: 'Pete Conrad standing next to Surveyor 3 with Lunar Module Intrepid in the background',
        label: 'REAL_PHOTO',
        credit: 'NASA / Alan Bean',
        sourceUrl: 'https://images.nasa.gov/details/AS12-48-7134',
        width: 1920,
        height: 1080,
        isCover: true,
        sortOrder: 1,
      }),
    });
    expect(imageRes.status).toBe(201);
    const imageBody = await imageRes.json();
    expect(imageBody.image).toBeDefined();
    createdImageId = imageBody.image.id;

    // 7. Verify all sub-resources appear in public detail endpoint
    const publicDetailRes = await app.request('/api/v1/machines/apollo-12-lm');
    expect(publicDetailRes.status).toBe(200);
    const publicDetailBody = await publicDetailRes.json();
    const publicDetail = publicDetailBody.machine;
    expect(publicDetail).toBeDefined();

    expect(publicDetail.sources.some((s: any) => s.id === createdSourceId)).toBe(true);
    const fact = publicDetail.facts.find((f: any) => f.id === createdFactId);
    expect(fact).toBeDefined();
    expect(fact.value).toBe('180');
    expect(publicDetail.events.some((e: any) => e.id === createdEventId)).toBe(true);
    expect(publicDetail.images.some((img: any) => img.id === createdImageId)).toBe(true);
  });

  // --- Step 5: Logbook Admin Lifecycle & Public Reflection ---
  it('E2E-P7 Logbook Admin: Creates draft, verifies public hiding, publishes via PATCH and cleans up', async () => {
    // 1. Admin creates draft logbook entry
    const createLogRes = await app.request('/api/v1/admin/logbook', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        machineId: createdMachineId,
        slug: 'apollo-12-surveyor-rendezvous',
        title: 'Visiting an Old Friend: Rendezvous with Surveyor 3',
        summary: 'How Apollo 12 astronauts walked to a robot that had been sitting on the Moon for 2.5 years.',
        articleMarkdown:
          '# Visiting an Old Friend\n\nOn November 20, 1969, astronauts Conrad and Bean walked down into the crater to examine Surveyor 3...',
        articleOrigin: 'AUTHORED',
        isPublished: false,
      }),
    });

    expect(createLogRes.status).toBe(201);
    const createLogBody = await createLogRes.json();
    expect(createLogBody.logbookEntry).toBeDefined();
    createdLogbookId = createLogBody.logbookEntry.id;
    expect(createLogBody.logbookEntry.isPublished).toBe(false);

    // 2. Verify draft logbook entry is hidden on public machine logbook endpoint
    const publicLogRes = await app.request('/api/v1/machines/apollo-12-lm/logbook');
    expect(publicLogRes.status).toBe(200);
    const publicLogBody = await publicLogRes.json();
    expect(publicLogBody.entries.find((e: any) => e.slug === 'apollo-12-surveyor-rendezvous')).toBeUndefined();

    // 3. Admin targeted PATCH: Publish logbook entry
    const patchLogRes = await app.request(`/api/v1/admin/logbook/${createdLogbookId}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        isPublished: true,
      }),
    });

    expect(patchLogRes.status).toBe(200);
    const patchLogBody = await patchLogRes.json();
    expect(patchLogBody.logbookEntry.isPublished).toBe(true);

    // 4. Verify public logbook immediately lists the published entry
    const publicLogAfterRes = await app.request('/api/v1/machines/apollo-12-lm/logbook');
    const publicLogAfterBody = await publicLogAfterRes.json();
    const publishedEntry = publicLogAfterBody.entries.find((e: any) => e.slug === 'apollo-12-surveyor-rendezvous');
    expect(publishedEntry).toBeDefined();
    expect(publishedEntry.title).toBe('Visiting an Old Friend: Rendezvous with Surveyor 3');

    // 5. Admin deletes logbook entry
    const deleteLogRes = await app.request(`/api/v1/admin/logbook/${createdLogbookId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(deleteLogRes.status).toBe(200);

    // Verify deletion in public logbook
    const publicLogDeletedRes = await app.request('/api/v1/machines/apollo-12-lm/logbook');
    const publicLogDeletedBody = await publicLogDeletedRes.json();
    expect(publicLogDeletedBody.entries.find((e: any) => e.slug === 'apollo-12-surveyor-rendezvous')).toBeUndefined();
  });

  // --- Step 6: Machine Deletion & Cascade Cleanliness ---
  it('E2E-P7 Clean Deletion: Deletes machine and cascades sub-resources cleanly', async () => {
    const deleteMachineRes = await app.request(`/api/v1/admin/machines/${createdMachineId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(deleteMachineRes.status).toBe(200);

    // Verify machine is deleted from database
    const dbMachine = await prisma.machine.findUnique({
      where: { id: createdMachineId },
    });
    expect(dbMachine).toBeNull();

    // Verify cascaded sub-resources are also deleted
    const dbFacts = await prisma.machineFact.findMany({
      where: { machineId: createdMachineId },
    });
    expect(dbFacts.length).toBe(0);

    const dbEvents = await prisma.machineEvent.findMany({
      where: { machineId: createdMachineId },
    });
    expect(dbEvents.length).toBe(0);

    const dbImages = await prisma.machineImage.findMany({
      where: { machineId: createdMachineId },
    });
    expect(dbImages.length).toBe(0);

    const dbSources = await prisma.machineSource.findMany({
      where: { machineId: createdMachineId },
    });
    expect(dbSources.length).toBe(0);

    // Public lookup returns 404
    const publicCheck = await app.request('/api/v1/machines/apollo-12-lm');
    expect(publicCheck.status).toBe(404);
  });
});
