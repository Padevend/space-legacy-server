import { describe, it, expect, beforeAll } from 'vitest';
import { createServer } from '../../bin/server.js';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword } from '#infrastructure/security/password_hasher';
import { signAccessToken } from '#infrastructure/security/token_service';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type {
  EquipmentListResponse,
  EquipmentResponse,
  EquipmentDetailResponse,
} from '../../docs/entities/equipment/api_response.js';

describe('E2E: Equipment Core Domain Module & Hierarchy Cycle Prevention', () => {
  const app = createServer();
  let adminToken = '';
  let editorToken = '';
  const testSlug = `lrv-test-${Date.now()}`;
  let equipAId = '';
  let equipBId = '';
  let equipCId = '';
  let locationId = '';
  let missionId = '';

  beforeAll(async () => {
    // 1. Auth Tokens
    const adminPass = await hashPassword('AdminPass123!#');
    const adminUser = await prisma.user.create({
      data: {
        email: `equip-admin-${Date.now()}@spacelegacy.test`,
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
        email: `equip-editor-${Date.now()}@spacelegacy.test`,
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

    // 2. Reference entities
    const body = await prisma.celestialBody.create({
      data: {
        name: `Moon-Equip-${Date.now()}`,
        bodyType: 'MOON',
      },
    });

    const location = await prisma.location.create({
      data: {
        name: `Taurus-Littrow-${Date.now()}`,
        locationType: 'LANDING_SITE',
        celestialBodyId: body.celestialBodyId,
        latitude: 20.1908,
        longitude: 30.7717,
      },
    });
    locationId = location.locationId;

    const mission = await prisma.mission.create({
      data: {
        name: `Apollo 17 Mission-${Date.now()}`,
        slug: `apollo-17-${Date.now()}`,
      },
    });
    missionId = mission.missionId;

    mkdirSync(resolve(process.cwd(), 'docs/entities/equipment/examples'), { recursive: true });
  });

  it('allows ADMIN to create equipment with slug and returns 201 with Location header', async () => {
    const res = await app.request('/api/v1/admin/equipment', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Lunar Roving Vehicle (LRV-3)',
        slug: testSlug,
        description: 'Electric four-wheeled rover used on the lunar surface during Apollo 17.',
        equipmentType: 'ROVER',
        manufacturer: 'Boeing / Delco',
        operationalStatus: 'INACTIVE',
        physicalStatus: 'LEFT_ON_SURFACE',
      }),
    });

    expect(res.status).toBe(201);
    expect(res.headers.get('location')).toBe(`/api/v1/equipment/${testSlug}`);

    const json = (await res.json()) as EquipmentResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      equipAId = json.data.equipmentId;
      expect(json.data.slug).toBe(testSlug);
      expect(json.data.equipmentType).toBe('ROVER');

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/equipment/examples/create_success.json'),
        JSON.stringify(json, null, 2)
      );
    }
  });

  it('strictly blocks hierarchy cycles (self-parenting and ancestor loops) with 422 UNPROCESSABLE', async () => {
    // 1. Create sub-assembly B with parent A
    const resB = await app.request('/api/v1/admin/equipment', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        parentEquipmentId: equipAId,
        name: 'LRV High-Gain Antenna',
        slug: `lrv-antenna-${Date.now()}`,
        equipmentType: 'SCIENTIFIC_INSTRUMENT',
      }),
    });
    expect(resB.status).toBe(201);
    const jsonB = (await resB.json()) as EquipmentResponse;
    if (jsonB.success) equipBId = jsonB.data.equipmentId;

    // 2. Create sub-assembly C with parent B
    const resC = await app.request('/api/v1/admin/equipment', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        parentEquipmentId: equipBId,
        name: 'Antenna Feed Horn',
        slug: `feed-horn-${Date.now()}`,
        equipmentType: 'COMPONENT',
      }),
    });
    expect(resC.status).toBe(201);
    const jsonC = (await resC.json()) as EquipmentResponse;
    if (jsonC.success) equipCId = jsonC.data.equipmentId;

    // 3. ATTEMPT 1: Self-parenting (A -> A) -> 422
    const selfParentRes = await app.request(`/api/v1/admin/equipment/${equipAId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ parentEquipmentId: equipAId }),
    });
    expect(selfParentRes.status).toBe(422);

    // 4. ATTEMPT 2: Ancestor cycle (make A child of C, creating cycle A -> B -> C -> A) -> 422
    const cycleRes = await app.request(`/api/v1/admin/equipment/${equipAId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ parentEquipmentId: equipCId }),
    });
    expect(cycleRes.status).toBe(422);
    const cycleJson = await cycleRes.json();
    writeFileSync(
      resolve(process.cwd(), 'docs/entities/equipment/examples/cycle_error.json'),
      JSON.stringify(cycleJson, null, 2)
    );
  });

  it('allows public retrieval of equipment by slug and listing of children via sub-resource', async () => {
    // 0. List with filter and ETag
    const listRes = await app.request('/api/v1/equipment?equipmentType=ROVER&page=1&pageSize=10');
    expect(listRes.status).toBe(200);
    expect(listRes.headers.get('etag')).toBeDefined();
    const listJson = (await listRes.json()) as EquipmentListResponse;
    expect(listJson.success).toBe(true);
    if (listJson.success) {
      expect(Array.isArray(listJson.data)).toBe(true);
      writeFileSync(
        resolve(process.cwd(), 'docs/entities/equipment/examples/list_success.json'),
        JSON.stringify(listJson, null, 2)
      );
    }

    // 1. Get by slug
    const res = await app.request(`/api/v1/equipment/${testSlug}`);
    expect(res.status).toBe(200);
    const json = (await res.json()) as EquipmentDetailResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(json.data.equipmentId).toBe(equipAId);
      writeFileSync(
        resolve(process.cwd(), 'docs/entities/equipment/examples/get_success.json'),
        JSON.stringify(json, null, 2)
      );
    }

    // 2. Sub-resource: children of A (should include B)
    const childrenRes = await app.request(`/api/v1/equipment/${testSlug}/children`);
    expect(childrenRes.status).toBe(200);
    const childrenJson = await childrenRes.json();
    expect(childrenJson.success).toBe(true);
    expect(childrenJson.data.some((ch: { equipmentId: string }) => ch.equipmentId === equipBId)).toBe(true);
  });

  it('manages relations (linking location and mission) and returns location coordinates as numbers', async () => {
    // 1. Link Location to Equipment
    let equipLocationId = '';
    const linkLocRes = await app.request(`/api/v1/admin/equipment/${equipAId}/locations/${locationId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({
        startDate: '1972-12-11',
        locationPrecision: 'EXACT',
      }),
    });
    expect(linkLocRes.status).toBe(200);

    // 2. Link Mission to Equipment
    const linkMissionRes = await app.request(`/api/v1/admin/equipment/${equipAId}/missions/${missionId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({
        missionRole: 'Surface Exploration Rover',
      }),
    });
    expect(linkMissionRes.status).toBe(200);

    // 3. Sub-resource: /equipment/:idOrSlug/locations
    const locsRes = await app.request(`/api/v1/equipment/${testSlug}/locations`);
    expect(locsRes.status).toBe(200);
    const locsJson = await locsRes.json();
    expect(locsJson.success).toBe(true);
    expect(locsJson.data.length).toBeGreaterThan(0);
    expect(typeof locsJson.data[0].latitude).toBe('number');
    expect(typeof locsJson.data[0].longitude).toBe('number');
    equipLocationId = locsJson.data[0].equipmentLocationId;

    // 4. Query with include=parent,children,missions,locations
    const includeRes = await app.request(`/api/v1/equipment/${testSlug}?include=children,missions,locations`);
    expect(includeRes.status).toBe(200);
    const detailJson = (await includeRes.json()) as EquipmentDetailResponse;
    expect(detailJson.success).toBe(true);
    if (detailJson.success) {
      expect(detailJson.data.children?.length).toBeGreaterThan(0);
      expect(detailJson.data.missions?.length).toBeGreaterThan(0);
      expect(detailJson.data.locations?.length).toBeGreaterThan(0);
      expect(typeof detailJson.data.locations?.[0]?.latitude).toBe('number');
    }

    // 5. Unlink Location
    const unlinkLocRes = await app.request(`/api/v1/admin/equipment/${equipAId}/locations/${equipLocationId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${editorToken}` },
    });
    expect(unlinkLocRes.status).toBe(200);
  });

  it('allows EDITOR to update equipment, but restricts DELETE to ADMIN', async () => {
    // 1. Update as EDITOR -> 200
    const updateRes = await app.request(`/api/v1/admin/equipment/${equipAId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({ description: 'Updated rover notes.' }),
    });
    expect(updateRes.status).toBe(200);

    // 2. Try delete as EDITOR -> 403
    const editorDeleteRes = await app.request(`/api/v1/admin/equipment/${equipAId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${editorToken}` },
    });
    expect(editorDeleteRes.status).toBe(403);

    // 3. Delete children C and B first to prevent foreign key restrict
    await app.request(`/api/v1/admin/equipment/${equipCId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    await app.request(`/api/v1/admin/equipment/${equipBId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    // 4. Delete A as ADMIN -> 200
    const adminDeleteRes = await app.request(`/api/v1/admin/equipment/${equipAId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(adminDeleteRes.status).toBe(200);

    // 5. Verify 404
    const verifyRes = await app.request(`/api/v1/equipment/${testSlug}`);
    expect(verifyRes.status).toBe(404);
  });
});
