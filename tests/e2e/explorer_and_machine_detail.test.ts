import { describe, it, expect } from 'vitest';
import { getTestApp } from '../helpers/test_app.js';
import { prisma } from '#infrastructure/database/prisma_client';

describe('Stage S4: Explorer & Machine Detail (E2E-P1 / E2E-P2)', () => {
  const app = getTestApp();

  it('Journey P1: Step 1 - Visitor opens app and lists available celestial bodies', async () => {
    const res = await app.request('/api/v1/bodies');

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.bodies).toBeDefined();
    expect(body.bodies).toHaveLength(2);

    const slugs = body.bodies.map((b: any) => b.slug);
    expect(slugs).toEqual(['moon', 'mars']);

    const moon = body.bodies.find((b: any) => b.slug === 'moon');
    expect(moon.name).toBe('Moon');
    expect(moon.summary).toBeTruthy();
    expect(moon.imagePath).toBe('/images/bodies/moon.webp');
  });

  it('Journey P1: Step 2 - Visitor filters machines by celestial body (Moon)', async () => {
    const res = await app.request('/api/v1/machines?body=moon');

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.data).toBeDefined();
    expect(body.data.length).toBeGreaterThanOrEqual(3);

    for (const machine of body.data) {
      expect(machine.body.slug).toBe('moon');
    }

    // Facets check
    expect(body.facets).toBeDefined();
    expect(body.facets.kinds).toBeDefined();
    expect(body.facets.states).toBeDefined();
    expect(body.facets.decades).toBeDefined();
    expect(body.facets.kinds['LANDER']).toBeGreaterThanOrEqual(2);
    expect(body.facets.kinds['ROVER']).toBeGreaterThanOrEqual(1);
  });

  it('Journey P1: Step 3 - Visitor filters machines by celestial body (Mars)', async () => {
    const res = await app.request('/api/v1/machines?body=mars');

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.data.length).toBeGreaterThanOrEqual(4);
    for (const machine of body.data) {
      expect(machine.body.slug).toBe('mars');
    }

    expect(body.facets.kinds['ROVER']).toBeGreaterThanOrEqual(2);
    expect(body.facets.kinds['HELICOPTER']).toBe(1);
    expect(body.facets.kinds['LANDER']).toBe(1);
  });

  it('Journey P1: Step 4 - Combined filter by body (Mars) and kind (ROVER)', async () => {
    const res = await app.request('/api/v1/machines?body=mars&kind=ROVER');

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.data.length).toBe(2);
    const slugs = body.data.map((m: any) => m.slug);
    expect(slugs).toContain('curiosity');
    expect(slugs).toContain('perseverance');
  });

  it('Journey P1: Step 5 - Filter by operational state (STILL_ACTIVE)', async () => {
    const res = await app.request('/api/v1/machines?state=STILL_ACTIVE');

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.data.length).toBeGreaterThanOrEqual(2);
    for (const m of body.data) {
      expect(m.state).toBe('STILL_ACTIVE');
    }
  });

  it('Journey P1: Step 6 - Filter by arrival decade (1960)', async () => {
    const res = await app.request('/api/v1/machines?decade=1960');

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.data.length).toBe(2);
    const slugs = body.data.map((m: any) => m.slug);
    expect(slugs).toContain('apollo-11-lm');
    expect(slugs).toContain('surveyor-1');
  });

  it('Journey P1: Step 7 - Full-text search (q=Eagle)', async () => {
    const res = await app.request('/api/v1/machines?q=Eagle');

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.data.length).toBe(1);
    expect(body.data[0].slug).toBe('apollo-11-lm');
  });

  it('Journey P1: Step 8 - Cursor-based pagination with limit', async () => {
    const page1Res = await app.request('/api/v1/machines?limit=2');
    expect(page1Res.status).toBe(200);
    const page1 = await page1Res.json();

    expect(page1.data).toHaveLength(2);
    expect(page1.pagination.hasMore).toBe(true);
    expect(page1.pagination.nextCursor).toBeTruthy();

    const page2Res = await app.request(`/api/v1/machines?limit=2&cursor=${page1.pagination.nextCursor}`);
    expect(page2Res.status).toBe(200);
    const page2 = await page2Res.json();

    expect(page2.data).toHaveLength(2);

    // Ensure no duplication between pages
    const idsPage1 = page1.data.map((m: any) => m.id);
    const idsPage2 = page2.data.map((m: any) => m.id);
    for (const id of idsPage2) {
      expect(idsPage1).not.toContain(id);
    }
  });

  it('Journey P2: Visitor opens complete machine record for Apollo 11 Lunar Module (Eagle)', async () => {
    const res = await app.request('/api/v1/machines/apollo-11-lm');

    expect(res.status).toBe(200);
    const body = await res.json();
    const machine = body.machine;

    expect(machine).toBeDefined();
    expect(machine.slug).toBe('apollo-11-lm');
    expect(machine.name).toBe('Apollo 11 Lunar Module (Eagle)');
    expect(machine.kind).toBe('LANDER');
    expect(machine.state).toBe('JOB_FINISHED');
    expect(machine.stateSince).toBe('1969-07-21');
    expect(machine.arrivalYear).toBe(1969);

    // Body association
    expect(machine.body.slug).toBe('moon');
    expect(machine.body.name).toBe('Moon');

    // Narrative fields
    expect(machine.summary).toContain('First crewed spacecraft');
    expect(machine.description).toContain('Mare Tranquillitatis');
    expect(machine.missionPurpose).toContain('Land two astronauts');
    expect(machine.howItWorked).toContain('two-stage spacecraft');
    expect(machine.discoveries).toContain('21.55 kg');
    expect(machine.currentStatusNote).toContain('Tranquility Base');

    // Coordinates
    expect(machine.latitude).toBeCloseTo(0.67408, 4);
    expect(machine.longitude).toBeCloseTo(23.47297, 4);

    // Facts with sources
    expect(machine.facts.length).toBeGreaterThanOrEqual(3);
    const landedMass = machine.facts.find((f: any) => f.label === 'Landed Dry Mass');
    expect(landedMass).toBeDefined();
    expect(landedMass.value).toBe('2034');
    expect(landedMass.unit).toBe('kg');
    expect(landedMass.source).toBeDefined();
    expect(landedMass.source.publisher).toBeTruthy();

    // Timeline events with sources
    expect(machine.events.length).toBeGreaterThanOrEqual(3);
    const landingEvent = machine.events.find((e: any) => e.title === 'Lunar Surface Landing');
    expect(landingEvent).toBeDefined();
    expect(landingEvent.dateLabel).toBe('July 20, 1969');
    expect(landingEvent.description).toContain('Mare Tranquillitatis');
    expect(landingEvent.source).toBeDefined();

    // Images with labels
    expect(machine.images.length).toBeGreaterThanOrEqual(1);
    const coverImage = machine.images.find((img: any) => img.isCover);
    expect(coverImage).toBeDefined();
    expect(coverImage.label).toBe('REAL_PHOTO');
    expect(coverImage.credit).toBe('NASA / Neil Armstrong');
    expect(coverImage.sourceUrl).toContain('nasa.gov');

    // Sources list
    expect(machine.sources.length).toBeGreaterThanOrEqual(2);
    for (const source of machine.sources) {
      expect(source.title).toBeTruthy();
      expect(source.url).toContain('nasa.gov');
    }
  });

  it('Journey P2: Non-existent machine returns 404 with uniform N12 error envelope', async () => {
    const res = await app.request('/api/v1/machines/non-existent-machine-slug');

    expect(res.status).toBe(404);
    const body = await res.json();

    expect(body.error).toBeDefined();
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.error.message).toContain('not found');
    expect(body.error.details).toEqual([]);
  });

  it('Guarantees unpublished machines are completely hidden from public endpoints', async () => {
    // Create an unpublished machine in DB
    const moon = await prisma.celestialBody.findUnique({ where: { slug: 'moon' } });
    expect(moon).toBeDefined();

    const unpublishedMachine = await prisma.machine.create({
      data: {
        slug: 'secret-draft-probe',
        bodyId: moon!.id,
        name: 'Secret Draft Probe',
        kind: 'LANDER',
        state: 'UNKNOWN',
        summary: 'Classified draft probe not ready for publication',
        description: 'Draft description',
        missionPurpose: 'Draft purpose',
        howItWorked: 'Draft mechanism',
        discoveries: 'None',
        isPublished: false,
      },
    });

    try {
      // Must not appear in list
      const listRes = await app.request('/api/v1/machines?body=moon');
      const listBody = await listRes.json();
      const slugs = listBody.data.map((m: any) => m.slug);
      expect(slugs).not.toContain('secret-draft-probe');

      // Must return 404 when requested directly by slug
      const detailRes = await app.request('/api/v1/machines/secret-draft-probe');
      expect(detailRes.status).toBe(404);
      const detailBody = await detailRes.json();
      expect(detailBody.error.code).toBe('NOT_FOUND');
    } finally {
      // Clean up draft machine
      await prisma.machine.delete({ where: { id: unpublishedMachine.id } });
    }
  });
});
