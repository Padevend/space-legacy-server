import { describe, it, expect, beforeAll } from 'vitest';
import { createServer } from '../../bin/server.js';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword } from '#infrastructure/security/password_hasher';
import { signAccessToken } from '#infrastructure/security/token_service';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type {
  ListPeopleResponse,
  GetPersonResponse,
  CreatePersonResponse,
} from '../../docs/entities/person/api_response.js';

describe('E2E: People Reference Module', () => {
  const app = createServer();
  let adminToken = '';
  let editorToken = '';
  let personId = '';
  const testPersonName = `Astronaut-Test-${Date.now()}`;

  beforeAll(async () => {
    // 1. Create ADMIN user
    const adminPassHash = await hashPassword('AdminPass123!#');
    const adminUser = await prisma.user.create({
      data: {
        email: `people-admin-${Date.now()}@spacelegacy.test`,
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
        email: `people-editor-${Date.now()}@spacelegacy.test`,
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

    mkdirSync(resolve(process.cwd(), 'docs/entities/person/examples'), { recursive: true });
  });

  it('allows ADMIN to create a person and returns 201 with Location header', async () => {
    const res = await app.request('/api/v1/admin/people', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        fullName: testPersonName,
        biography: 'NASA astronaut and aerospace pioneer.',
        affiliation: 'NASA',
      }),
    });

    expect(res.status).toBe(201);
    expect(res.headers.get('location')).toBeDefined();

    const json = (await res.json()) as CreatePersonResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      personId = json.data.personId;
      expect(json.data.fullName).toBe(testPersonName);
      expect(json.data.affiliation).toBe('NASA');

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/person/examples/create_success.json'),
        JSON.stringify(json, null, 2),
        'utf-8'
      );
    }
  });

  it('allows public anonymous users to list people with affiliation filter and ETag', async () => {
    const res = await app.request('/api/v1/people?affiliation=NASA&page=1&pageSize=10');
    expect(res.status).toBe(200);
    expect(res.headers.get('etag')).toBeDefined();

    const json = (await res.json()) as ListPeopleResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThanOrEqual(1);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/person/examples/list_success.json'),
        JSON.stringify(json, null, 2),
        'utf-8'
      );
    }
  });

  it('allows public retrieval of single person by UUID', async () => {
    const res = await app.request(`/api/v1/people/${personId}`);
    expect(res.status).toBe(200);

    const json = (await res.json()) as GetPersonResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(json.data.personId).toBe(personId);
      expect(json.data.fullName).toBe(testPersonName);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/person/examples/get_success.json'),
        JSON.stringify(json, null, 2),
        'utf-8'
      );
    }
  });

  it('allows EDITOR to update person, but blocks EDITOR from deleting (403 FORBIDDEN)', async () => {
    // 1. Update as EDITOR
    const updateRes = await app.request(`/api/v1/admin/people/${personId}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${editorToken}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        affiliation: 'NASA / JPL',
      }),
    });
    expect(updateRes.status).toBe(200);

    // 2. Attempt DELETE as EDITOR -> 403
    const deleteAttempt = await app.request(`/api/v1/admin/people/${personId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${editorToken}`,
        origin: 'http://localhost:3000',
      },
    });
    expect(deleteAttempt.status).toBe(403);

    // 3. Perform DELETE as ADMIN -> 200
    const deleteSuccess = await app.request(`/api/v1/admin/people/${personId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${adminToken}`,
        origin: 'http://localhost:3000',
      },
    });
    expect(deleteSuccess.status).toBe(200);

    // 4. Verify 404
    const verifyRes = await app.request(`/api/v1/people/${personId}`);
    expect(verifyRes.status).toBe(404);
  });
});
