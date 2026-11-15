import { describe, it, expect, beforeAll } from 'vitest';
import { createServer } from '../../bin/server.js';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword } from '#infrastructure/security/password_hasher';
import { signAccessToken } from '#infrastructure/security/token_service';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type { EventListResponse, EventResponse, EventDetailResponse } from '../../docs/entities/event/api_response.js';

describe('E2E: Events Core Domain Module & Date Formatting', () => {
  const app = createServer();
  let adminToken = '';
  let editorToken = '';
  let missionId = '';
  let equipmentId = '';
  let locationId = '';
  let sourceId = '';
  let createdEventId = '';

  beforeAll(async () => {
    // 1. Auth Tokens
    const adminPass = await hashPassword('AdminPass123!#');
    const adminUser = await prisma.user.create({
      data: {
        email: `event-admin-${Date.now()}@spacelegacy.test`,
        passwordHash: adminPass,
        role: 'ADMIN',
        isActive: true,
      },
    });
    adminToken = await signAccessToken({
      userId: adminUser.userId,
      email: adminUser.email,
      role: 'ADMIN',
    });

    const editorPass = await hashPassword('EditorPass123!#');
    const editorUser = await prisma.user.create({
      data: {
        email: `event-editor-${Date.now()}@spacelegacy.test`,
        passwordHash: editorPass,
        role: 'EDITOR',
        isActive: true,
      },
    });
    editorToken = await signAccessToken({
      userId: editorUser.userId,
      email: editorUser.email,
      role: 'EDITOR',
    });

    // 2. Reference dependencies
    const mission = await prisma.mission.create({
      data: {
        name: `Apollo 11 Mission-${Date.now()}`,
        slug: `apollo-11-${Date.now()}`,
      },
    });
    missionId = mission.missionId;

    const equip = await prisma.equipment.create({
      data: {
        name: `Eagle Lunar Module-${Date.now()}`,
        slug: `eagle-lm-${Date.now()}`,
        equipmentType: 'LANDER',
      },
    });
    equipmentId = equip.equipmentId;

    const location = await prisma.location.create({
      data: {
        name: `Mare Tranquillitatis-${Date.now()}`,
        locationType: 'LANDING_SITE',
      },
    });
    locationId = location.locationId;

    const source = await prisma.source.create({
      data: {
        title: `ALSJ Transcript-${Date.now()}`,
        url: `https://www.nasa.gov/alsj-${Date.now()}.html`,
        publisher: 'Apollo Lunar Surface Journal',
        sourceType: 'OFFICIAL_DOCUMENT',
      },
    });
    sourceId = source.sourceId;

    mkdirSync(resolve(process.cwd(), 'docs/entities/event/examples'), { recursive: true });
  });

  it('allows ADMIN to create an event and verifies YYYY-MM-DD date and HH:mm:ss time formatting', async () => {
    const res = await app.request('/api/v1/admin/events', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        missionId,
        title: 'Apollo 11 Lunar Landing',
        description: 'Lunar module Eagle lands at Tranquility Base.',
        eventType: 'LANDING',
        eventDate: '1969-07-20',
        eventTime: '20:17:40',
        timeStandard: 'UTC',
        datePrecision: 'EXACT',
        sequenceOrder: 1,
      }),
    });

    expect(res.status).toBe(201);
    const json = (await res.json()) as EventResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      createdEventId = json.data.eventId;
      expect(res.headers.get('location')).toBe(`/api/v1/events/${createdEventId}`);
      expect(json.data.eventDate).toBe('1969-07-20');
      expect(json.data.eventTime).toBe('20:17:40');
      expect(json.data.eventType).toBe('LANDING');

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/event/examples/create_success.json'),
        JSON.stringify(json, null, 2)
      );
    }
  });

  it('allows public listing of events with date filters (from/to) and ETag', async () => {
    const res = await app.request('/api/v1/events?from=1969-01-01&to=1969-12-31&eventType=LANDING');
    expect(res.status).toBe(200);
    expect(res.headers.get('etag')).toBeDefined();

    const json = (await res.json()) as EventListResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.some((ev: { eventId: string }) => ev.eventId === createdEventId)).toBe(true);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/event/examples/list_success.json'),
        JSON.stringify(json, null, 2)
      );
    }
  });

  it('manages relations (linking equipment, location, source) and returns populated includes', async () => {
    // 1. Link Equipment
    const linkEquipRes = await app.request(`/api/v1/admin/events/${createdEventId}/equipment/${equipmentId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({ roleInEvent: 'Landed Craft', description: 'Descent stage remained on surface' }),
    });
    expect(linkEquipRes.status).toBe(200);

    // 2. Link Location
    const linkLocRes = await app.request(`/api/v1/admin/events/${createdEventId}/locations/${locationId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({ locationRole: 'Touchdown site' }),
    });
    expect(linkLocRes.status).toBe(200);

    // 3. Link Source
    const linkSourceRes = await app.request(`/api/v1/admin/events/${createdEventId}/sources/${sourceId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({ claimDescription: 'Full transcript of touchdown phase' }),
    });
    expect(linkSourceRes.status).toBe(200);

    // 5. Query event with include=mission,equipment,locations
    const includeRes = await app.request(`/api/v1/events/${createdEventId}?include=mission,equipment,locations`);
    expect(includeRes.status).toBe(200);
    const detailJson = (await includeRes.json()) as EventDetailResponse;
    expect(detailJson.success).toBe(true);
    if (detailJson.success) {
      expect(detailJson.data.mission?.missionId).toBe(missionId);
      expect(detailJson.data.equipment?.length).toBeGreaterThan(0);
      expect(detailJson.data.locations?.length).toBeGreaterThan(0);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/event/examples/get_success.json'),
        JSON.stringify(detailJson, null, 2)
      );
    }
  });

  it('allows EDITOR to update event, but restricts DELETE to ADMIN', async () => {
    // 1. Update as EDITOR -> 200
    const updateRes = await app.request(`/api/v1/admin/events/${createdEventId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({ description: 'Updated landing description.' }),
    });
    expect(updateRes.status).toBe(200);

    // 2. Try delete as EDITOR -> 403
    const editorDeleteRes = await app.request(`/api/v1/admin/events/${createdEventId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${editorToken}` },
    });
    expect(editorDeleteRes.status).toBe(403);

    // 3. Delete as ADMIN -> 200
    const adminDeleteRes = await app.request(`/api/v1/admin/events/${createdEventId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(adminDeleteRes.status).toBe(200);

    // 4. Verify 404
    const verifyRes = await app.request(`/api/v1/events/${createdEventId}`);
    expect(verifyRes.status).toBe(404);
  });
});
