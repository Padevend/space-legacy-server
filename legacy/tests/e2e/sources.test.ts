import { describe, it, expect, beforeAll } from 'vitest';
import { createServer } from '../../bin/server.js';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword } from '#infrastructure/security/password_hasher';
import { signAccessToken } from '#infrastructure/security/token_service';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ApiErrorResponse } from '#exceptions/handler';
import type {
  ListSourcesResponse,
  GetSourceResponse,
  CreateSourceResponse,
} from '../../docs/entities/source/api_response.js';

describe('E2E: Sources Reference Module', () => {
  const app = createServer();
  let adminToken = '';
  let editorToken = '';
  let sourceId = '';
  const testUrl = `https://history.nasa.gov/test-report-${Date.now()}.pdf`;

  beforeAll(async () => {
    // 1. Create ADMIN user
    const adminPassHash = await hashPassword('AdminPass123!#');
    const adminUser = await prisma.user.create({
      data: {
        email: `sources-admin-${Date.now()}@spacelegacy.test`,
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
        email: `sources-editor-${Date.now()}@spacelegacy.test`,
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

    mkdirSync(resolve(process.cwd(), 'docs/entities/source/examples'), { recursive: true });
  });

  it('allows ADMIN to create a source with HTTP/HTTPS URL and YYYY-MM-DD publication date', async () => {
    const res = await app.request('/api/v1/admin/sources', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        title: 'Apollo Program Summary Report',
        url: testUrl,
        publisher: 'NASA JSC',
        author: 'NASA Evaluation Board',
        publicationDate: '1975-04-01',
        sourceType: 'OFFICIAL_DOCUMENT',
      }),
    });

    expect(res.status).toBe(201);
    expect(res.headers.get('location')).toBeDefined();

    const json = (await res.json()) as CreateSourceResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      sourceId = json.data.sourceId;
      expect(json.data.url).toBe(testUrl);
      expect(json.data.publicationDate).toBe('1975-04-01');

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/source/examples/create_success.json'),
        JSON.stringify(json, null, 2),
        'utf-8'
      );
    }
  });

  it('rejects duplicate source URL with 409 CONFLICT', async () => {
    const res = await app.request('/api/v1/admin/sources', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        title: 'Duplicate Source Attempt',
        url: testUrl, // Duplicate
        publisher: 'NASA',
        sourceType: 'OFFICIAL_DOCUMENT',
      }),
    });

    expect(res.status).toBe(409);
    const json = (await res.json()) as ApiErrorResponse;
    expect(json.error.code).toBe('CONFLICT');

    writeFileSync(
      resolve(process.cwd(), 'docs/entities/source/examples/conflict_error.json'),
      JSON.stringify(json, null, 2),
      'utf-8'
    );
  });

  it('rejects non-HTTP protocols (e.g. ftp://, javascript:) with 422 VALIDATION_ERROR', async () => {
    const res = await app.request('/api/v1/admin/sources', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        title: 'Invalid Protocol Source',
        url: 'ftp://ftp.nasa.gov/unsupported.pdf',
        publisher: 'NASA',
        sourceType: 'OFFICIAL_DOCUMENT',
      }),
    });

    expect(res.status).toBe(422);
    const json = (await res.json()) as ApiErrorResponse;
    expect(json.error.code).toBe('VALIDATION_ERROR');
  });

  it('allows public anonymous users to list sources with ETag and pagination', async () => {
    const res = await app.request('/api/v1/sources?page=1&pageSize=10');
    expect(res.status).toBe(200);
    expect(res.headers.get('etag')).toBeDefined();

    const json = (await res.json()) as ListSourcesResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThanOrEqual(1);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/source/examples/list_success.json'),
        JSON.stringify(json, null, 2),
        'utf-8'
      );
    }
  });

  it('allows public retrieval of single source by UUID', async () => {
    const res = await app.request(`/api/v1/sources/${sourceId}`);
    expect(res.status).toBe(200);

    const json = (await res.json()) as GetSourceResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(json.data.sourceId).toBe(sourceId);
      expect(json.data.url).toBe(testUrl);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/source/examples/get_success.json'),
        JSON.stringify(json, null, 2),
        'utf-8'
      );
    }
  });

  it('allows EDITOR to update source, but blocks EDITOR from deleting (403 FORBIDDEN)', async () => {
    // 1. Update as EDITOR
    const updateRes = await app.request(`/api/v1/admin/sources/${sourceId}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${editorToken}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        author: 'NASA JSC Evaluation Team & Astronaut Office',
      }),
    });
    expect(updateRes.status).toBe(200);

    // 2. Attempt DELETE as EDITOR -> 403
    const deleteAttempt = await app.request(`/api/v1/admin/sources/${sourceId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${editorToken}`,
        origin: 'http://localhost:3000',
      },
    });
    expect(deleteAttempt.status).toBe(403);

    // 3. Perform DELETE as ADMIN -> 200
    const deleteSuccess = await app.request(`/api/v1/admin/sources/${sourceId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${adminToken}`,
        origin: 'http://localhost:3000',
      },
    });
    expect(deleteSuccess.status).toBe(200);

    // 4. Verify 404
    const verifyRes = await app.request(`/api/v1/sources/${sourceId}`);
    expect(verifyRes.status).toBe(404);
  });
});
