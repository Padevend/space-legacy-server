import { describe, it, expect, beforeAll } from 'vitest';
import { createServer } from '../../bin/server.js';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword } from '#infrastructure/security/password_hasher';
import { signAccessToken } from '#infrastructure/security/token_service';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type {
  MissionListResponse,
  MissionResponse,
  MissionDetailResponse,
} from '../../docs/entities/mission/api_response.js';

describe('E2E: Missions Core Domain Module', () => {
  const app = createServer();
  let adminToken = '';
  let editorToken = '';
  const testMissionSlug = `test-mission-${Date.now()}`;
  let createdId = '';
  let equipmentId = '';
  let sourceId = '';

  beforeAll(async () => {
    // 1. Admin & Editor tokens
    const adminPass = await hashPassword('AdminPass123!#');
    const adminUser = await prisma.user.create({
      data: {
        email: `mission-admin-${Date.now()}@spacelegacy.test`,
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
        email: `mission-editor-${Date.now()}@spacelegacy.test`,
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

    // 2. Reference entities for relations
    const equip = await prisma.equipment.create({
      data: {
        name: `Mission Test Equipment ${Date.now()}`,
        slug: `mission-test-equip-${Date.now()}`,
        equipmentType: 'LANDER',
      },
    });
    equipmentId = equip.equipmentId;

    const source = await prisma.source.create({
      data: {
        title: `Mission Doc ${Date.now()}`,
        url: `https://history.nasa.gov/mission-doc-${Date.now()}.pdf`,
        publisher: 'NASA History Office',
        sourceType: 'OFFICIAL_DOCUMENT',
      },
    });
    sourceId = source.sourceId;

    mkdirSync(resolve(process.cwd(), 'docs/entities/mission/examples'), { recursive: true });
  });

  it('allows ADMIN to create a mission with slug and returns 201 with Location header', async () => {
    const res = await app.request('/api/v1/admin/missions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Apollo 11 Flight Campaign',
        slug: testMissionSlug,
        description: 'First manned landing on lunar soil.',
        agency: 'NASA',
        missionStatus: 'COMPLETED',
      }),
    });

    expect(res.status).toBe(201);
    expect(res.headers.get('location')).toBe(`/api/v1/missions/${testMissionSlug}`);

    const json = (await res.json()) as MissionResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      createdId = json.data.missionId;
      expect(json.data.slug).toBe(testMissionSlug);
      expect(json.data.missionStatus).toBe('COMPLETED');

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/mission/examples/create_success.json'),
        JSON.stringify(json, null, 2)
      );
    }
  });

  it('rejects duplicate mission slug with 409 CONFLICT', async () => {
    const res = await app.request('/api/v1/admin/missions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Another Apollo 11',
        slug: testMissionSlug,
        missionStatus: 'PLANNED',
      }),
    });

    expect(res.status).toBe(409);
    const json = await res.json();
    writeFileSync(
      resolve(process.cwd(), 'docs/entities/mission/examples/conflict_error.json'),
      JSON.stringify(json, null, 2)
    );
  });

  it('allows public retrieval by slug and by UUID', async () => {
    // 1. By slug
    const resSlug = await app.request(`/api/v1/missions/${testMissionSlug}`);
    expect(resSlug.status).toBe(200);
    const jsonSlug = (await resSlug.json()) as MissionDetailResponse;
    expect(jsonSlug.success).toBe(true);
    if (jsonSlug.success) {
      expect(jsonSlug.data.missionId).toBe(createdId);
      writeFileSync(
        resolve(process.cwd(), 'docs/entities/mission/examples/get_success.json'),
        JSON.stringify(jsonSlug, null, 2)
      );
    }

    // 2. By UUID
    const resUuid = await app.request(`/api/v1/missions/${createdId}`);
    expect(resUuid.status).toBe(200);
  });

  it('allows public listing of missions with status filter, pagination, and ETag', async () => {
    const res = await app.request('/api/v1/missions?missionStatus=COMPLETED&page=1&pageSize=10');
    expect(res.status).toBe(200);
    expect(res.headers.get('etag')).toBeDefined();

    const json = (await res.json()) as MissionListResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.some((m: { slug: string }) => m.slug === testMissionSlug)).toBe(true);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/mission/examples/list_success.json'),
        JSON.stringify(json, null, 2)
      );
    }
  });

  it('manages relations (linking equipment and source) and returns populated details with include', async () => {
    // 1. Link Equipment
    const linkEquipRes = await app.request(`/api/v1/admin/missions/${createdId}/equipment/${equipmentId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({ missionRole: 'Primary Lander' }),
    });
    expect(linkEquipRes.status).toBe(200);

    // 2. Link Source
    const linkSourceRes = await app.request(`/api/v1/admin/missions/${createdId}/sources/${sourceId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({ claimDescription: 'Primary flight trajectory logs' }),
    });
    expect(linkSourceRes.status).toBe(200);

    // 3. Query with include=equipment,sources
    const includeRes = await app.request(`/api/v1/missions/${testMissionSlug}?include=equipment,sources`);
    expect(includeRes.status).toBe(200);
    const json = (await includeRes.json()) as MissionDetailResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(json.data.equipment).toBeDefined();
      expect(json.data.equipment?.length).toBeGreaterThan(0);

      expect(json.data.sources).toBeDefined();
      expect(json.data.sources?.length).toBeGreaterThan(0);
      expect(json.data.sources?.[0]?.claimDescription).toBe('Primary flight trajectory logs');
    }

    // 4. Test include depth restriction (> 2 relations -> 422)
    const excessIncludeRes = await app.request(
      `/api/v1/missions/${testMissionSlug}?include=equipment,sources,invalidRel`
    );
    expect(excessIncludeRes.status).toBe(422);
  });

  it('allows EDITOR to update mission, but restricts DELETE to ADMIN', async () => {
    // 1. Update as EDITOR -> 200
    const updateRes = await app.request(`/api/v1/admin/missions/${createdId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({ description: 'Updated mission description.' }),
    });
    expect(updateRes.status).toBe(200);

    // 2. Try delete as EDITOR -> 403 FORBIDDEN
    const editorDeleteRes = await app.request(`/api/v1/admin/missions/${createdId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${editorToken}` },
    });
    expect(editorDeleteRes.status).toBe(403);

    // 3. Delete as ADMIN -> 200 OK
    const adminDeleteRes = await app.request(`/api/v1/admin/missions/${createdId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(adminDeleteRes.status).toBe(200);

    // 4. Verify 404 after deletion
    const verifyRes = await app.request(`/api/v1/missions/${testMissionSlug}`);
    expect(verifyRes.status).toBe(404);
  });
});
