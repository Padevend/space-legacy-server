import { describe, it, expect, beforeAll } from 'vitest';
import { createServer } from '../../bin/server.js';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword } from '#infrastructure/security/password_hasher';
import { signAccessToken } from '#infrastructure/security/token_service';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type {
  ListLocationsResponse,
  GetLocationResponse,
  CreateLocationResponse,
} from '../../docs/entities/location/api_response.js';

describe('E2E: Locations Reference Module', () => {
  const app = createServer();
  let adminToken = '';
  let editorToken = '';
  let celestialBodyId = '';
  let locationId = '';
  const testLocationName = `Statio Tranquillitatis ${Date.now()}`;

  beforeAll(async () => {
    // 1. Create ADMIN user
    const adminPassHash = await hashPassword('AdminPass123!#');
    const adminUser = await prisma.user.create({
      data: {
        email: `loc-admin-${Date.now()}@spacelegacy.test`,
        passwordHash: adminPassHash,
        role: 'ADMIN',
        isActive: true,
      },
    });
    adminToken = await signAccessToken({
      userId: adminUser.userId,
      email: adminUser.email,
      role: 'ADMIN',
    });

    // 2. Create EDITOR user
    const editorPassHash = await hashPassword('EditorPass123!#');
    const editorUser = await prisma.user.create({
      data: {
        email: `loc-editor-${Date.now()}@spacelegacy.test`,
        passwordHash: editorPassHash,
        role: 'EDITOR',
        isActive: true,
      },
    });
    editorToken = await signAccessToken({
      userId: editorUser.userId,
      email: editorUser.email,
      role: 'EDITOR',
    });

    // 3. Find or create celestial body
    const moon = await prisma.celestialBody.findFirst();
    if (moon) {
      celestialBodyId = moon.celestialBodyId;
    } else {
      const created = await prisma.celestialBody.create({
        data: { name: `Moon-${Date.now()}`, bodyType: 'MOON' },
      });
      celestialBodyId = created.celestialBodyId;
    }

    mkdirSync(resolve(process.cwd(), 'docs/entities/location/examples'), { recursive: true });
  });

  it('allows ADMIN to create a location with decimal coordinates serialized as numbers', async () => {
    const res = await app.request('/api/v1/admin/locations', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        name: testLocationName,
        locationType: 'LANDING_SITE',
        celestialBodyId,
        latitude: 0.67408,
        longitude: 23.47297,
        altitude: -2.573,
        referenceSystem: 'IAU2000',
        description: 'First crewed landing site on the lunar surface.',
      }),
    });

    expect(res.status).toBe(201);
    expect(res.headers.get('location')).toBeDefined();

    const json = (await res.json()) as CreateLocationResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      locationId = json.data.locationId;
      expect(json.data.name).toBe(testLocationName);
      expect(typeof json.data.latitude).toBe('number');
      expect(typeof json.data.longitude).toBe('number');
      expect(typeof json.data.altitude).toBe('number');

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/location/examples/create_success.json'),
        JSON.stringify(json, null, 2),
        'utf-8'
      );
    }
  });

  it('allows public anonymous users to list locations with celestialBodyId filter and ETag', async () => {
    const res = await app.request(`/api/v1/locations?celestialBodyId=${celestialBodyId}&page=1&pageSize=10`);
    expect(res.status).toBe(200);
    expect(res.headers.get('etag')).toBeDefined();

    const json = (await res.json()) as ListLocationsResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThanOrEqual(1);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/location/examples/list_success.json'),
        JSON.stringify(json, null, 2),
        'utf-8'
      );
    }
  });

  it('allows public retrieval of single location by UUID', async () => {
    const res = await app.request(`/api/v1/locations/${locationId}`);
    expect(res.status).toBe(200);

    const json = (await res.json()) as GetLocationResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(json.data.locationId).toBe(locationId);
      expect(json.data.name).toBe(testLocationName);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/location/examples/get_success.json'),
        JSON.stringify(json, null, 2),
        'utf-8'
      );
    }
  });

  it('allows EDITOR to update location, but blocks EDITOR from deleting (403 FORBIDDEN)', async () => {
    // 1. Update as EDITOR
    const updateRes = await app.request(`/api/v1/admin/locations/${locationId}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${editorToken}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        description: 'Updated Apollo 11 historical landing site.',
      }),
    });
    expect(updateRes.status).toBe(200);

    // 2. Attempt DELETE as EDITOR -> 403
    const deleteAttempt = await app.request(`/api/v1/admin/locations/${locationId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${editorToken}`,
        origin: 'http://localhost:3000',
      },
    });
    expect(deleteAttempt.status).toBe(403);

    // 3. Perform DELETE as ADMIN -> 200
    const deleteSuccess = await app.request(`/api/v1/admin/locations/${locationId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${adminToken}`,
        origin: 'http://localhost:3000',
      },
    });
    expect(deleteSuccess.status).toBe(200);

    // 4. Verify 404
    const verifyRes = await app.request(`/api/v1/locations/${locationId}`);
    expect(verifyRes.status).toBe(404);
  });
});
