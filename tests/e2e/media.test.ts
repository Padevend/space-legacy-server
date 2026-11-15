import { describe, it, expect, beforeAll } from 'vitest';
import { createServer } from '../../bin/server.js';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword } from '#infrastructure/security/password_hasher';
import { signAccessToken } from '#infrastructure/security/token_service';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ListMediaResponse, MediaResponse, MediaDetailResponse } from '../../docs/entities/media/api_response.js';

describe('E2E: Media Editorial Module', () => {
  const app = createServer();
  let adminToken = '';
  let editorToken = '';
  let equipmentId = '';
  let aiMediaId = '';
  let archiveMediaId = '';

  beforeAll(async () => {
    // 1. Admin & Editor tokens
    const adminPass = await hashPassword('AdminPass123!#');
    const adminUser = await prisma.user.create({
      data: {
        email: `media-admin-${Date.now()}@spacelegacy.test`,
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
        email: `media-editor-${Date.now()}@spacelegacy.test`,
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

    // 2. Equipment for relation linking
    const equipment = await prisma.equipment.create({
      data: {
        name: `Surveyor Lander ${Date.now()}`,
        slug: `surveyor-lander-${Date.now()}`,
        equipmentType: 'LANDER',
      },
    });
    equipmentId = equipment.equipmentId;

    mkdirSync(resolve(process.cwd(), 'docs/entities/media/examples'), { recursive: true });
  });

  it('creates an AI-generated media asset and verifies requiresAiLabel is TRUE', async () => {
    const res = await app.request('/api/v1/admin/media', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({
        title: '3D Artist Concept of Surveyor 3 on Ocean of Storms',
        mediaType: 'IMAGE',
        url: 'https://images.nasa.gov/details-surveyor3-concept.jpg',
        thumbnailUrl: 'https://images.nasa.gov/thumb-surveyor3-concept.jpg',
        caption: 'Computer generated artistic rendering of the Surveyor 3 landing site.',
        credit: 'Space Legacy Digital Studio',
        creditUrl: 'https://nasa.gov',
        provenanceType: 'AI_GENERATED_ILLUSTRATION',
        altText: 'Rendering of golden robotic lander under starry lunar sky',
        downloadStatus: 'EXTERNAL_ONLY',
      }),
    });

    expect(res.status).toBe(201);
    const json = (await res.json()) as MediaResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      aiMediaId = json.data.mediaId;
      expect(json.data.provenanceType).toBe('AI_GENERATED_ILLUSTRATION');
      // Crucial requirement: requiresAiLabel MUST be true!
      expect(json.data.requiresAiLabel).toBe(true);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/media/examples/media_ai_generated.json'),
        JSON.stringify(json.data, null, 2)
      );
    }
  });

  it('creates an authentic NASA archive media asset and verifies requiresAiLabel is FALSE', async () => {
    const res = await app.request('/api/v1/admin/media', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({
        title: 'Surveyor 3 Footpad on the Moon',
        mediaType: 'IMAGE',
        url: 'https://images.nasa.gov/details-AS12-48-7121.jpg',
        caption: 'Apollo 12 astronaut examines Surveyor 3 footpad.',
        credit: 'NASA / Pete Conrad',
        provenanceType: 'NASA_ARCHIVE',
        downloadStatus: 'AVAILABLE',
      }),
    });

    expect(res.status).toBe(201);
    const json = (await res.json()) as MediaResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      archiveMediaId = json.data.mediaId;
      expect(json.data.provenanceType).toBe('NASA_ARCHIVE');
      // Non-AI media requiresAiLabel MUST be false!
      expect(json.data.requiresAiLabel).toBe(false);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/media/examples/get_media.json'),
        JSON.stringify(json.data, null, 2)
      );
    }
  });

  it('allows public anonymous access to media list and detail with accurate AI flags', async () => {
    // List
    const listRes = await app.request('/api/v1/media?pageSize=10');
    expect(listRes.status).toBe(200);
    const listJson = (await listRes.json()) as ListMediaResponse;
    expect(listJson.success).toBe(true);
    if (listJson.success) {
      expect(listJson.data.length).toBeGreaterThanOrEqual(2);
      writeFileSync(
        resolve(process.cwd(), 'docs/entities/media/examples/list_media.json'),
        JSON.stringify(listJson.data, null, 2)
      );
    }

    // Single item
    const getRes = await app.request(`/api/v1/media/${aiMediaId}`);
    expect(getRes.status).toBe(200);
    const getJson = (await getRes.json()) as MediaDetailResponse;
    expect(getJson.success).toBe(true);
    if (getJson.success) {
      expect(getJson.data.requiresAiLabel).toBe(true);
    }
  });

  it('links and unlinks media to equipment with representationType', async () => {
    // 1. Link
    const linkRes = await app.request(`/api/v1/admin/media/${archiveMediaId}/equipment/${equipmentId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({
        representationType: 'PRIMARY_PHOTO',
      }),
    });
    expect(linkRes.status).toBe(200);

    // 2. Fetch with include
    const getRes = await app.request(`/api/v1/media/${archiveMediaId}?include=equipments`);
    expect(getRes.status).toBe(200);
    const getJson = (await getRes.json()) as MediaDetailResponse;
    expect(getJson.success).toBe(true);
    if (getJson.success) {
      expect(getJson.data.equipments).toBeDefined();
      expect(getJson.data.equipments?.length).toBe(1);
      expect(getJson.data.equipments?.[0]?.representationType).toBe('PRIMARY_PHOTO');
    }

    // 3. Unlink
    const unlinkRes = await app.request(`/api/v1/admin/media/${archiveMediaId}/equipment/${equipmentId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${editorToken}`,
      },
    });
    expect(unlinkRes.status).toBe(200);
  });

  it('enforces RBAC on media deletion: EDITOR forbidden (403), ADMIN allowed (200)', async () => {
    // Editor tries to delete -> 403 Forbidden
    const editorDelRes = await app.request(`/api/v1/admin/media/${aiMediaId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${editorToken}`,
      },
    });
    expect(editorDelRes.status).toBe(403);

    // Admin deletes -> 200 OK
    const adminDelRes = await app.request(`/api/v1/admin/media/${aiMediaId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });
    expect(adminDelRes.status).toBe(200);

    // Verify deleted
    const verifyRes = await app.request(`/api/v1/media/${aiMediaId}`);
    expect(verifyRes.status).toBe(404);
  });
});
