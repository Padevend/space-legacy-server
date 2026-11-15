import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp } from '../helpers/test_app.js';
import { prisma } from '#infrastructure/database/prisma_client';

describe('Stage S5: Logbook Module & Public Reader (E2E-P3)', () => {
  const app = getTestApp();
  let draftMachineId: string | null = null;
  let draftEntryId: string | null = null;
  let surveyorDraftEntryId: string | null = null;

  beforeAll(async () => {
    // Setup an unpublished logbook entry on an existing published machine (surveyor-1)
    const surveyor = await prisma.machine.findUnique({
      where: { slug: 'surveyor-1' },
    });

    if (surveyor) {
      const surveyorDraft = await prisma.logbookEntry.create({
        data: {
          machineId: surveyor.id,
          slug: 'draft-surveyor-journal',
          title: 'Draft Surveyor Journal',
          summary: 'Unpublished confidential draft.',
          articleMarkdown: 'Confidential surveyor notes.',
          articleOrigin: 'AUTHORED',
          isPublished: false,
        },
      });
      surveyorDraftEntryId = surveyorDraft.id;
    }

    // Setup an unpublished machine with a logbook entry
    const moon = await prisma.celestialBody.findUnique({ where: { slug: 'moon' } });
    if (moon) {
      const draftMachine = await prisma.machine.create({
        data: {
          slug: 'confidential-probe-s5',
          bodyId: moon.id,
          name: 'Confidential Probe S5',
          kind: 'ORBITER',
          state: 'UNKNOWN',
          summary: 'Classified test probe for S5.',
          description: 'Draft description for S5.',
          missionPurpose: 'Classified purpose.',
          howItWorked: 'Classified operations.',
          discoveries: 'None',
          isPublished: false,
        },
      });
      draftMachineId = draftMachine.id;

      const draftEntry = await prisma.logbookEntry.create({
        data: {
          machineId: draftMachine.id,
          slug: 'confidential-notes',
          title: 'Classified Mission Log',
          summary: 'Should never be visible publicly.',
          articleMarkdown: 'Secret text.',
          articleOrigin: 'AUTHORED',
          isPublished: true, // Entry marked true, but parent machine is false
        },
      });
      draftEntryId = draftEntry.id;
    }
  });

  afterAll(async () => {
    if (surveyorDraftEntryId) {
      await prisma.logbookEntry.delete({ where: { id: surveyorDraftEntryId } }).catch(() => {});
    }
    if (draftEntryId) {
      await prisma.logbookEntry.delete({ where: { id: draftEntryId } }).catch(() => {});
    }
    if (draftMachineId) {
      await prisma.machine.delete({ where: { id: draftMachineId } }).catch(() => {});
    }
  });

  it('Journey P3: Step 1 - Visitor lists published logbook entries for Apollo 11', async () => {
    const res = await app.request('/api/v1/machines/apollo-11-lm/logbook');

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.machine).toBeDefined();
    expect(body.machine.slug).toBe('apollo-11-lm');
    expect(body.machine.name).toBe('Apollo 11 Lunar Module (Eagle)');

    expect(Array.isArray(body.entries)).toBe(true);
    expect(body.entries.length).toBeGreaterThanOrEqual(1);

    const entry = body.entries.find((e: any) => e.slug === 'tranquility-base');
    expect(entry).toBeDefined();
    expect(entry.title).toBe('Tranquility Base: One Giant Leap');
    expect(entry.summary).toContain('computer overload alarms');
    expect(entry.videoUrl).toBe('https://images.nasa.gov/details/Apollo11LandingHighlight');
    expect(entry.videoDurationSec).toBe(184);
    expect(entry.videoOrigin).toBe('AUTHORED');
    expect(entry.articleOrigin).toBe('AUTHORED');
    expect(entry.isPublished).toBe(true);
    // In summary list, articleMarkdown is omitted to preserve bandwidth
    expect(entry.articleMarkdown).toBeUndefined();
  });

  it('Journey P3: Step 2 - Visitor opens detailed logbook entry with article and video', async () => {
    const res = await app.request('/api/v1/machines/apollo-11-lm/logbook/tranquility-base');

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.entry).toBeDefined();
    const entry = body.entry;

    expect(entry.slug).toBe('tranquility-base');
    expect(entry.title).toBe('Tranquility Base: One Giant Leap');
    expect(entry.summary).toContain('computer overload alarms');

    // Rich article Markdown content
    expect(entry.articleMarkdown).toBeDefined();
    expect(entry.articleMarkdown).toContain('# Tranquility Base: One Giant Leap');
    expect(entry.articleMarkdown).toContain('Neil Armstrong');
    expect(entry.articleMarkdown).toContain('1202 and 1201');

    // Video details
    expect(entry.videoUrl).toBe('https://images.nasa.gov/details/Apollo11LandingHighlight');
    expect(entry.videoDurationSec).toBe(184);
    expect(entry.videoOrigin).toBe('AUTHORED');
    expect(entry.articleOrigin).toBe('AUTHORED');

    // Machine context
    expect(entry.machine).toBeDefined();
    expect(entry.machine.slug).toBe('apollo-11-lm');
  });

  it('Journey P3: Step 3 - Visitor checks Curiosity logbook entries', async () => {
    const listRes = await app.request('/api/v1/machines/curiosity/logbook');
    expect(listRes.status).toBe(200);
    const listBody = await listRes.json();

    expect(listBody.entries.length).toBeGreaterThanOrEqual(1);
    const curiosityEntry = listBody.entries.find((e: any) => e.slug === 'seven-minutes-of-terror');
    expect(curiosityEntry).toBeDefined();

    const detailRes = await app.request('/api/v1/machines/curiosity/logbook/seven-minutes-of-terror');
    expect(detailRes.status).toBe(200);
    const detailBody = await detailRes.json();

    expect(detailBody.entry.title).toBe('Seven Minutes of Terror: The Sky Crane Landing');
    expect(detailBody.entry.articleMarkdown).toContain('Seven Minutes of Terror');
    expect(detailBody.entry.articleMarkdown).toContain('lowered Curiosity directly onto its wheels');
    expect(detailBody.entry.videoUrl).toBe('https://images.nasa.gov/details/CuriositySkyCraneDescent');
    expect(detailBody.entry.videoDurationSec).toBe(300);
  });

  it('Edge Case: Machine exists but has no published logbook entries', async () => {
    const res = await app.request('/api/v1/machines/surveyor-1/logbook');

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.machine.slug).toBe('surveyor-1');
    expect(body.entries).toEqual([]);
    expect(body.data).toEqual([]);
  });

  it('Edge Case: 404 with N12 envelope when machine does not exist', async () => {
    const res = await app.request('/api/v1/machines/non-existent-probe-s5/logbook');

    expect(res.status).toBe(404);
    const body = await res.json();

    expect(body.error).toBeDefined();
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.error.message).toBe("Machine with slug 'non-existent-probe-s5' not found.");
    expect(body.error.details).toEqual([]);
  });

  it('Edge Case: 404 with N12 envelope when entry does not exist on existing machine', async () => {
    const res = await app.request('/api/v1/machines/apollo-11-lm/logbook/non-existent-entry');

    expect(res.status).toBe(404);
    const body = await res.json();

    expect(body.error).toBeDefined();
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.error.message).toBe("Logbook entry 'non-existent-entry' not found for machine 'apollo-11-lm'.");
    expect(body.error.details).toEqual([]);
  });

  it('Edge Case: 404 when entry slug exists but belongs to a different machine', async () => {
    // seven-minutes-of-terror belongs to curiosity, not apollo-11-lm
    const res = await app.request('/api/v1/machines/apollo-11-lm/logbook/seven-minutes-of-terror');

    expect(res.status).toBe(404);
    const body = await res.json();

    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.error.message).toContain('seven-minutes-of-terror');
  });

  it('Edge Case: Unpublished logbook entry is hidden from list and detail', async () => {
    // draft-surveyor-journal is on surveyor-1 with isPublished: false
    const listRes = await app.request('/api/v1/machines/surveyor-1/logbook');
    const listBody = await listRes.json();
    const found = listBody.entries.find((e: any) => e.slug === 'draft-surveyor-journal');
    expect(found).toBeUndefined();

    const detailRes = await app.request('/api/v1/machines/surveyor-1/logbook/draft-surveyor-journal');
    expect(detailRes.status).toBe(404);
    const detailBody = await detailRes.json();
    expect(detailBody.error.code).toBe('NOT_FOUND');
  });

  it('Edge Case: Logbook of unpublished machine is completely hidden (404)', async () => {
    // confidential-probe-s5 is isPublished: false
    const listRes = await app.request('/api/v1/machines/confidential-probe-s5/logbook');
    expect(listRes.status).toBe(404);
    const listBody = await listRes.json();
    expect(listBody.error.code).toBe('NOT_FOUND');

    const detailRes = await app.request('/api/v1/machines/confidential-probe-s5/logbook/confidential-notes');
    expect(detailRes.status).toBe(404);
    const detailBody = await detailRes.json();
    expect(detailBody.error.code).toBe('NOT_FOUND');
  });
});
