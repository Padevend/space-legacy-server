import { describe, it, expect, beforeAll } from 'vitest';
import { createServer } from '../../bin/server.js';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword } from '#infrastructure/security/password_hasher';
import { signAccessToken } from '#infrastructure/security/token_service';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ApiErrorResponse } from '#exceptions/handler';
import type {
  ListCelestialBodiesResponse,
  GetCelestialBodyResponse,
  CreateCelestialBodyResponse,
} from '../../docs/entities/celestial-body/api_response.js';

describe('E2E: Celestial Bodies Reference Module', () => {
  const app = createServer();
  let adminToken = '';
  let editorToken = '';
  const testBodyName = `Europa-Test-${Date.now()}`;
  let createdId = '';

  beforeAll(async () => {
    // 1. Create ADMIN user
    const adminPassHash = await hashPassword('AdminPass123!#');
    const adminUser = await prisma.user.create({
      data: {
        email: `cb-admin-${Date.now()}@spacelegacy.test`,
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
        email: `cb-editor-${Date.now()}@spacelegacy.test`,
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

    mkdirSync(resolve(process.cwd(), 'docs/entities/celestial-body/examples'), { recursive: true });
  });

  it('allows public anonymous users to list celestial bodies with ETag and pagination', async () => {
    const res = await app.request('/api/v1/celestial-bodies?page=1&pageSize=10');
    expect(res.status).toBe(200);
    expect(res.headers.get('etag')).toBeDefined();

    const json = (await res.json()) as ListCelestialBodiesResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.meta.page).toBe(1);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/celestial-body/examples/list_success.json'),
        JSON.stringify(json, null, 2),
        'utf-8'
      );
    }
  });

  it('allows ADMIN to create a celestial body and returns 201 with Location header', async () => {
    const res = await app.request('/api/v1/admin/celestial-bodies', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        name: testBodyName,
        bodyType: 'MOON',
        description: 'Sixth-closest moon of Jupiter.',
      }),
    });

    expect(res.status).toBe(201);
    expect(res.headers.get('location')).toBeDefined();

    const json = (await res.json()) as CreateCelestialBodyResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      createdId = json.data.celestialBodyId;
      expect(json.data.name).toBe(testBodyName);
      expect(json.data.bodyType).toBe('MOON');

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/celestial-body/examples/create_success.json'),
        JSON.stringify(json, null, 2),
        'utf-8'
      );
    }
  });

  it('rejects duplicate celestial body name with 409 CONFLICT', async () => {
    const res = await app.request('/api/v1/admin/celestial-bodies', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        name: testBodyName, // Duplicate name
        bodyType: 'MOON',
      }),
    });

    expect(res.status).toBe(409);
    const json = (await res.json()) as ApiErrorResponse;
    expect(json.error.code).toBe('CONFLICT');

    writeFileSync(
      resolve(process.cwd(), 'docs/entities/celestial-body/examples/conflict_error.json'),
      JSON.stringify(json, null, 2),
      'utf-8'
    );
  });

  it('allows public retrieval of single celestial body by UUID', async () => {
    const res = await app.request(`/api/v1/celestial-bodies/${createdId}`);
    expect(res.status).toBe(200);

    const json = (await res.json()) as GetCelestialBodyResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(json.data.celestialBodyId).toBe(createdId);
      expect(json.data.name).toBe(testBodyName);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/celestial-body/examples/get_success.json'),
        JSON.stringify(json, null, 2),
        'utf-8'
      );
    }
  });

  it('allows EDITOR to update celestial body, but blocks EDITOR from deleting (403 FORBIDDEN)', async () => {
    // 1. Update as EDITOR
    const updateRes = await app.request(`/api/v1/admin/celestial-bodies/${createdId}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${editorToken}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        description: 'Updated Europa description with water ocean details.',
      }),
    });
    expect(updateRes.status).toBe(200);
    const updatedJson = await updateRes.json();
    expect(updatedJson.data.description).toContain('water ocean');

    // 2. Attempt DELETE as EDITOR -> Must be rejected with 403
    const deleteAttempt = await app.request(`/api/v1/admin/celestial-bodies/${createdId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${editorToken}`,
        origin: 'http://localhost:3000',
      },
    });
    expect(deleteAttempt.status).toBe(403);

    // 3. Perform DELETE as ADMIN -> Succeeded
    const deleteSuccess = await app.request(`/api/v1/admin/celestial-bodies/${createdId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${adminToken}`,
        origin: 'http://localhost:3000',
      },
    });
    expect(deleteSuccess.status).toBe(200);

    // 4. Verify 404 on subsequent get
    const verifyRes = await app.request(`/api/v1/celestial-bodies/${createdId}`);
    expect(verifyRes.status).toBe(404);
  });
});
