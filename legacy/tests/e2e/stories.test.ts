import { describe, it, expect, beforeAll } from 'vitest';
import { createServer } from '../../bin/server.js';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword } from '#infrastructure/security/password_hasher';
import { signAccessToken } from '#infrastructure/security/token_service';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type {
  ListStoriesResponse,
  StoryResponse,
  StoryDetailResponse,
} from '../../docs/entities/story/api_response.js';

describe('E2E: Stories Editorial Workflow & Visibility', () => {
  const app = createServer();
  let adminToken = '';
  let editorToken = '';
  const testSlug = `silent-monuments-${Date.now()}`;
  let storyId = '';

  let missionId = '';
  let equipmentId = '';
  let eventId = '';
  let sourceId = '';

  beforeAll(async () => {
    // 1. Admin & Editor tokens
    const adminPass = await hashPassword('AdminPass123!#');
    const adminUser = await prisma.user.create({
      data: {
        email: `stories-admin-${Date.now()}@spacelegacy.test`,
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
        email: `stories-editor-${Date.now()}@spacelegacy.test`,
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

    // 2. Setup domain items for relations
    const mission = await prisma.mission.create({
      data: {
        name: `Apollo 12 Story Link ${Date.now()}`,
        slug: `apollo-12-${Date.now()}`,
      },
    });
    missionId = mission.missionId;

    const equipment = await prisma.equipment.create({
      data: {
        name: `Lunar Roving Vehicle ${Date.now()}`,
        slug: `lrv-${Date.now()}`,
        equipmentType: 'ROVER',
      },
    });
    equipmentId = equipment.equipmentId;

    const event = await prisma.event.create({
      data: {
        missionId,
        title: `Touchdown on Ocean of Storms ${Date.now()}`,
        eventType: 'LANDING',
      },
    });
    eventId = event.eventId;

    const source = await prisma.source.create({
      data: {
        title: `NASA Technical Note ${Date.now()}`,
        url: `https://ntrs.nasa.gov/citations/story-${Date.now()}`,
        publisher: 'NASA',
        sourceType: 'OFFICIAL_DOCUMENT',
      },
    });
    sourceId = source.sourceId;

    mkdirSync(resolve(process.cwd(), 'docs/entities/story/examples'), { recursive: true });
  });

  it('creates a story in DRAFT status and strips XSS tags from title, hook, and content', async () => {
    const res = await app.request('/api/v1/admin/stories', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({
        title: '<script>alert("xss")</script>Silent Monuments of the Moon',
        slug: testSlug,
        hook: 'Left behind in tranquility. <img src="x" onerror="evil()"/>',
        content:
          'Historical narrative recounting artifacts left on the lunar plains.<iframe src="malicious.html"></iframe>',
        storyType: 'LEGACY_STORY',
        durationSeconds: 240,
        language: 'en',
      }),
    });

    expect(res.status).toBe(201);
    expect(res.headers.get('location')).toBe(`/api/v1/stories/${testSlug}`);

    const json = (await res.json()) as StoryResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      storyId = json.data.storyId;
      // Publication status must always default to DRAFT
      expect(json.data.publicationStatus).toBe('DRAFT');
      expect(json.data.publishedAt).toBeNull();

      // XSS tags stripped
      expect(json.data.title).toBe('Silent Monuments of the Moon');
      expect(json.data.hook).toBe('Left behind in tranquility.');
      expect(json.data.content).toBe('Historical narrative recounting artifacts left on the lunar plains.');
    }
  });

  it('strictly conceals unpublished (DRAFT) stories from anonymous public routes', async () => {
    // 1. Direct slug lookup must return 404 Not Found (deny by default, reveal nothing)
    const publicGetRes = await app.request(`/api/v1/stories/${testSlug}`);
    expect(publicGetRes.status).toBe(404);

    // 2. Direct UUID lookup must also return 404 Not Found
    const publicUuidRes = await app.request(`/api/v1/stories/${storyId}`);
    expect(publicUuidRes.status).toBe(404);

    // 3. Public list must not contain the draft story
    const publicListRes = await app.request('/api/v1/stories');
    expect(publicListRes.status).toBe(200);
    const listJson = (await publicListRes.json()) as ListStoriesResponse;
    expect(listJson.success).toBe(true);
    if (listJson.success) {
      const found = listJson.data.find((s) => s.slug === testSlug);
      expect(found).toBeUndefined();
    }
  });

  it('enforces the editorial transition state machine and automatically populates publishedAt', async () => {
    // 1. Invalid transition: DRAFT -> PUBLISHED directly must be rejected with 409 Conflict
    const invalidRes = await app.request(`/api/v1/admin/stories/${storyId}/transitions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({ to: 'PUBLISHED' }),
    });
    expect(invalidRes.status).toBe(409);

    // 2. Valid transition: DRAFT -> REVIEW
    const toReviewRes = await app.request(`/api/v1/admin/stories/${storyId}/transitions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({ to: 'REVIEW' }),
    });
    expect(toReviewRes.status).toBe(200);
    const toReviewJson = (await toReviewRes.json()) as StoryResponse;
    expect(toReviewJson.success).toBe(true);
    if (toReviewJson.success) {
      expect(toReviewJson.data.publicationStatus).toBe('REVIEW');
    }

    // In-review stories are STILL not visible publicly!
    const reviewPublicRes = await app.request(`/api/v1/stories/${testSlug}`);
    expect(reviewPublicRes.status).toBe(404);

    // 3. Valid transition: REVIEW -> PUBLISHED
    const toPublishedRes = await app.request(`/api/v1/admin/stories/${storyId}/transitions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({ to: 'PUBLISHED' }),
    });
    expect(toPublishedRes.status).toBe(200);
    const toPublishedJson = (await toPublishedRes.json()) as StoryResponse;
    expect(toPublishedJson.success).toBe(true);
    if (toPublishedJson.success) {
      expect(toPublishedJson.data.publicationStatus).toBe('PUBLISHED');
      // publishedAt must be automatically set!
      expect(toPublishedJson.data.publishedAt).not.toBeNull();
      expect(typeof toPublishedJson.data.publishedAt).toBe('string');
    }

    // 4. NOW the story is visible on public routes!
    const publicNowRes = await app.request(`/api/v1/stories/${testSlug}`);
    expect(publicNowRes.status).toBe(200);
    const publicNowJson = (await publicNowRes.json()) as StoryDetailResponse;
    expect(publicNowJson.success).toBe(true);
    if (publicNowJson.success) {
      expect(publicNowJson.data.slug).toBe(testSlug);
      expect(publicNowJson.data.publicationStatus).toBe('PUBLISHED');

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/story/examples/get_story.json'),
        JSON.stringify(publicNowJson.data, null, 2)
      );
    }

    const publicListNowRes = await app.request('/api/v1/stories');
    expect(publicListNowRes.status).toBe(200);
    const publicListNowJson = (await publicListNowRes.json()) as ListStoriesResponse;
    expect(publicListNowJson.success).toBe(true);
    if (publicListNowJson.success) {
      writeFileSync(
        resolve(process.cwd(), 'docs/entities/story/examples/list_stories.json'),
        JSON.stringify(publicListNowJson.data, null, 2)
      );
    }
  });

  it('manages Story join relations with include capping', async () => {
    // 1. Link relations
    await app.request(`/api/v1/admin/stories/${storyId}/missions/${missionId}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${editorToken}` },
      body: JSON.stringify({ displayOrder: 1 }),
    });

    await app.request(`/api/v1/admin/stories/${storyId}/equipment/${equipmentId}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${editorToken}` },
      body: JSON.stringify({ displayOrder: 1, narrativeRole: 'Central subject' }),
    });

    await app.request(`/api/v1/admin/stories/${storyId}/events/${eventId}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${editorToken}` },
      body: JSON.stringify({ displayOrder: 1 }),
    });

    await app.request(`/api/v1/admin/stories/${storyId}/sources/${sourceId}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${editorToken}` },
      body: JSON.stringify({ displayOrder: 1, claimDescription: 'Mission telemetry log' }),
    });

    // 2. Fetch with 3 allowed includes
    const getRes = await app.request(`/api/v1/stories/${testSlug}?include=missions,equipments,events`);
    expect(getRes.status).toBe(200);
    const getJson = (await getRes.json()) as StoryDetailResponse;
    expect(getJson.success).toBe(true);
    if (getJson.success) {
      expect(getJson.data.missions?.length).toBe(1);
      expect(getJson.data.equipments?.length).toBe(1);
      expect(getJson.data.events?.length).toBe(1);
    }

    // 3. Include cap: >3 relations returns 422
    const overCapRes = await app.request(`/api/v1/stories/${testSlug}?include=missions,equipments,events,sources`);
    expect(overCapRes.status).toBe(422);

    // 4. Unlink relations
    const unlinkRes = await app.request(`/api/v1/admin/stories/${storyId}/missions/${missionId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${editorToken}` },
    });
    expect(unlinkRes.status).toBe(200);
  });

  it('enforces RBAC on story deletion: EDITOR forbidden (403), ADMIN allowed (200)', async () => {
    // Editor delete -> 403 Forbidden
    const editorDelRes = await app.request(`/api/v1/admin/stories/${storyId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${editorToken}` },
    });
    expect(editorDelRes.status).toBe(403);

    // Admin delete -> 200 OK
    const adminDelRes = await app.request(`/api/v1/admin/stories/${storyId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(adminDelRes.status).toBe(200);

    // Verify deleted
    const verifyRes = await app.request(`/api/v1/stories/${testSlug}`);
    expect(verifyRes.status).toBe(404);
  });
});
