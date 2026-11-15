import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp } from '../helpers/test_app.js';
import { prisma } from '#infrastructure/database/prisma_client';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  makeValidTemplateZip,
  makeZipSlipZip,
  makeZipBombZip,
  makeEncryptedZip,
  makeForbiddenExtensionZip,
  makeSignatureMismatchZip,
  makeImageOversizedZip,
  makeManifestMissingZip,
  makeManifestMismatchZip,
  makeSchemaInvalidZip,
  makeUnknownReferenceZip,
  makeForbiddenHostSourceZip,
  makeDuplicateSlugZip,
} from '../fixtures/make-zips.js';

describe('Stage S9: Ingestion Pipeline & ZIP Bundle Security (E2E-Ingestion)', () => {
  const app = getTestApp();

  let adminToken: string;
  let userToken: string;
  let anonToken: string;

  const testUserEmail = 'regular.user.s9@spacelegacy.test';
  const testUserPassword = 'RegularUserPassword123!';
  const adminEmail = 'admin@spacelegacy.test';
  const adminPassword = 'AdminSpaceLegacy2026!';

  const targetMachineSlug = 'surveyor-3';
  const targetQuizSlug = 'surveyor-3-quiz';
  const diskImageDir = path.resolve(process.cwd(), `public/images/machines/${targetMachineSlug}`);

  async function cleanup() {
    // 1. Delete quiz attempts and quizzes
    const quiz = await prisma.quiz.findUnique({ where: { slug: targetQuizSlug } });
    if (quiz) {
      await prisma.quizAttempt.deleteMany({ where: { quizId: quiz.id } });
      await prisma.quiz.delete({ where: { id: quiz.id } });
    }

    // 2. Delete test machine and sub-resources
    await prisma.machine.deleteMany({
      where: { slug: targetMachineSlug },
    });

    // 3. Delete ingestion batches created in tests
    await prisma.ingestionBatch.deleteMany({
      where: {
        filename: { in: ['bundle-template.zip', 'surveyor-3.zip', 'test-bundle.zip', 'malicious.zip', 'rejected.zip'] },
      },
    });

    // 4. Delete files on disk
    try {
      await fs.rm(diskImageDir, { recursive: true, force: true });
    } catch {
      // ignore
    }

    // 5. Clean up test user
    const existingUser = await prisma.account.findUnique({
      where: { email: testUserEmail },
    });
    if (existingUser) {
      await prisma.visitor.delete({ where: { id: existingUser.visitorId } }).catch(() => {});
    }
  }

  beforeAll(async () => {
    await cleanup();

    // 1. Anonymous session
    const anonRes = await app.request('/api/v1/session/anonymous', { method: 'POST' });
    expect(anonRes.status).toBe(200);
    const anonBody = await anonRes.json();
    anonToken = anonBody.token;

    // 2. Login as Admin
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonToken}`,
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
      }),
    });
    expect(loginRes.status).toBe(200);
    const loginBody = await loginRes.json();
    adminToken = loginBody.token;

    // 3. Register regular user
    const regAnonRes = await app.request('/api/v1/session/anonymous', { method: 'POST' });
    const regAnonBody = await regAnonRes.json();
    const userRegRes = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${regAnonBody.token}`,
      },
      body: JSON.stringify({
        email: testUserEmail,
        password: testUserPassword,
        displayName: 'Test User S9',
      }),
    });
    expect(userRegRes.status).toBe(201);
    const userRegBody = await userRegRes.json();
    userToken = userRegBody.token;
  });

  afterAll(async () => {
    await cleanup();
  });

  // --- ACCESS CONTROL MATRIX ---
  describe('Admin Access Control on Ingestion Endpoints', () => {
    it('rejects unauthenticated request to GET /api/v1/admin/ingestion/spec with 401', async () => {
      const res = await app.request('/api/v1/admin/ingestion/spec');
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error.code).toBe('UNAUTHENTICATED');
    });

    it('rejects regular USER request to GET /api/v1/admin/ingestion/spec with 403', async () => {
      const res = await app.request('/api/v1/admin/ingestion/spec', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.error.code).toBe('FORBIDDEN');
    });

    it('allows ADMIN to GET /api/v1/admin/ingestion/spec with 200', async () => {
      const res = await app.request('/api/v1/admin/ingestion/spec', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.spec).toBeDefined();
      expect(body.spec.limits.maxArchiveBytes).toBe(25 * 1024 * 1024);
      expect(body.spec.errorCodes).toContain('ZIP_BOMB_SUSPECTED');
      expect(body.spec.errorCodes).toContain('ZIP_PATH_TRAVERSAL');
    });
  });

  // --- TEMPLATE DOWNLOAD & DRY-RUN VALIDATION ---
  describe('Template Generation & Dry-Run Validation', () => {
    let downloadedZipBuffer: Buffer;

    it('allows ADMIN to download template ZIP via GET /api/v1/admin/ingestion/template.zip', async () => {
      const res = await app.request('/api/v1/admin/ingestion/template.zip', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toBe('application/zip');
      expect(res.headers.get('content-disposition')).toContain('bundle-template.zip');

      const arrayBuf = await res.arrayBuffer();
      downloadedZipBuffer = Buffer.from(arrayBuf);
      expect(downloadedZipBuffer.length).toBeGreaterThan(500);
    });

    it('validates template ZIP in dry-run mode via POST /api/v1/admin/ingestion/validate without committing to database', async () => {
      const res = await app.request('/api/v1/admin/ingestion/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/zip',
          'x-filename': 'surveyor-3.zip',
          Authorization: `Bearer ${adminToken}`,
        },
        body: downloadedZipBuffer,
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.batchId).toBeDefined();
      expect(body.report.status).toBe('VALIDATED');
      expect(body.report.summary.machinesCount).toBe(1);
      expect(body.report.summary.quizzesCount).toBe(1);
      expect(body.report.summary.imagesCount).toBe(1);
      expect(body.report.errors).toHaveLength(0);

      // Verify ZERO database writes to machines and quizzes
      const machineInDb = await prisma.machine.findUnique({
        where: { slug: targetMachineSlug },
      });
      expect(machineInDb).toBeNull();

      const quizInDb = await prisma.quiz.findUnique({
        where: { slug: targetQuizSlug },
      });
      expect(quizInDb).toBeNull();

      // Verify batch record in database has status VALIDATED
      const batch = await prisma.ingestionBatch.findUnique({
        where: { id: body.batchId },
      });
      expect(batch).not.toBeNull();
      expect(batch!.status).toBe('VALIDATED');
    });
  });

  // --- COMMIT BUNDLE & PUBLIC VERIFICATION ---
  describe('Transactional Commit of Valid Bundle', () => {
    let committedBatchId: string;

    it('commits valid bundle via POST /api/v1/admin/ingestion with 201 Created and creates all entities', async () => {
      const zipBuffer = makeValidTemplateZip();

      const res = await app.request('/api/v1/admin/ingestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/zip',
          'x-filename': 'surveyor-3.zip',
          Authorization: `Bearer ${adminToken}`,
        },
        body: zipBuffer,
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.batchId).toBeDefined();
      expect(body.report.status).toBe('COMMITTED');
      expect(body.report.summary.machinesCount).toBe(1);
      expect(body.report.summary.quizzesCount).toBe(1);
      committedBatchId = body.batchId;

      // 1. Verify Machine in DB
      const machine = await prisma.machine.findUnique({
        where: { slug: targetMachineSlug },
        include: {
          sources: true,
          facts: true,
          events: true,
          images: true,
          body: true,
        },
      });
      expect(machine).not.toBeNull();
      expect(machine!.name).toBe('Surveyor 3');
      expect(machine!.body.slug).toBe('moon');
      expect(machine!.sources).toHaveLength(1);
      expect(machine!.facts).toHaveLength(1);
      expect(machine!.events).toHaveLength(1);
      expect(machine!.images).toHaveLength(1);

      // 2. Verify Quiz in DB
      const quiz = await prisma.quiz.findUnique({
        where: { slug: targetQuizSlug },
        include: {
          questions: {
            include: { options: true },
          },
        },
      });
      expect(quiz).not.toBeNull();
      expect(quiz!.title).toBe('Surveyor 3 Lunar Pioneer Quiz');
      expect(quiz!.questions).toHaveLength(1);
      expect(quiz!.questions[0]!.options).toHaveLength(3);

      // 3. Verify Image file written to disk
      const imagePathOnDisk = path.join(diskImageDir, 'surveyor3.png');
      const fileStat = await fs.stat(imagePathOnDisk);
      expect(fileStat.isFile()).toBe(true);
      expect(fileStat.size).toBeGreaterThan(0);
    });

    it('allows ADMIN to fetch batch details via GET /api/v1/admin/ingestion/:id', async () => {
      const res = await app.request(`/api/v1/admin/ingestion/${committedBatchId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.batch.id).toBe(committedBatchId);
      expect(body.batch.status).toBe('COMMITTED');
      expect(body.batch.report.summary.machinesCount).toBe(1);
    });

    it('verifies committed machine is immediately accessible on public API', async () => {
      const res = await app.request(`/api/v1/machines/${targetMachineSlug}`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.machine.slug).toBe(targetMachineSlug);
      expect(body.machine.name).toBe('Surveyor 3');
      expect(body.machine.sources).toHaveLength(1);
      expect(body.machine.facts).toHaveLength(1);
      expect(body.machine.events).toHaveLength(1);
      expect(body.machine.images).toHaveLength(1);
    });

    it('verifies committed quiz is immediately accessible on public API with masked answers', async () => {
      const res = await app.request(`/api/v1/quizzes/${targetQuizSlug}`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.quiz.slug).toBe(targetQuizSlug);
      expect(body.quiz.questions).toHaveLength(1);

      // Verify answers are strictly masked / omitted from public API
      for (const opt of body.quiz.questions[0].options) {
        expect(opt.isCorrect).toBeUndefined();
        expect(opt.explanation).toBeUndefined();
      }
    });
  });

  // --- REJECTION SUITE (SECURITY & VALIDATION GATES) ---
  describe('Security & Validation Rejection Gates (Section 8 Rejection Codes)', () => {
    async function assertRejection(zipBuffer: Buffer, expectedCode: string, filename = 'rejected.zip') {
      const res = await app.request('/api/v1/admin/ingestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/zip',
          'x-filename': filename,
          Authorization: `Bearer ${adminToken}`,
        },
        body: zipBuffer,
      });

      expect(res.status).toBe(422);
      const body = await res.json();
      expect(body.error).toBeDefined();
      expect(body.error.code).toBe(expectedCode);
      expect(body.error.message).toBeDefined();
      expect(Array.isArray(body.error.details)).toBe(true);

      // Verify batch record in DB reflects REJECTED status
      const latestBatch = await prisma.ingestionBatch.findFirst({
        where: { filename },
        orderBy: { createdAt: 'desc' },
      });
      expect(latestBatch).not.toBeNull();
      expect(latestBatch!.status).toBe('REJECTED');
      expect(latestBatch!.rejectCode).toBe(expectedCode);
    }

    it('rejects corrupt / non-zip file with ZIP_INVALID', async () => {
      const corruptBuffer = Buffer.from('NOT A ZIP FILE HEADER 1234567890');
      await assertRejection(corruptBuffer, 'ZIP_INVALID', 'corrupt.zip');
    });

    it('rejects Zip Slip attack (path traversal) with ZIP_PATH_TRAVERSAL', async () => {
      const zip = makeZipSlipZip();
      await assertRejection(zip, 'ZIP_PATH_TRAVERSAL');
    });

    it('rejects Zip Bomb (extreme compression ratio) with ZIP_BOMB_SUSPECTED', async () => {
      const zip = makeZipBombZip();
      await assertRejection(zip, 'ZIP_BOMB_SUSPECTED');
    });

    it('rejects encrypted entry with ZIP_ENCRYPTED', async () => {
      const zip = makeEncryptedZip();
      await assertRejection(zip, 'ZIP_ENCRYPTED');
    });

    it('rejects forbidden file extensions (.exe) with FORBIDDEN_EXTENSION', async () => {
      const zip = makeForbiddenExtensionZip();
      await assertRejection(zip, 'FORBIDDEN_EXTENSION');
    });

    it('rejects fake image file (text masquerading as .png) with SIGNATURE_MISMATCH', async () => {
      const zip = makeSignatureMismatchZip();
      await assertRejection(zip, 'SIGNATURE_MISMATCH');
    });

    it('rejects oversized image (5000x5000 px > 4000x4000) with IMAGE_INVALID', async () => {
      const zip = makeImageOversizedZip();
      await assertRejection(zip, 'IMAGE_INVALID');
    });

    it('rejects archive without manifest.json with MANIFEST_MISSING', async () => {
      const zip = makeManifestMissingZip();
      await assertRejection(zip, 'MANIFEST_MISSING');
    });

    it('rejects archive when manifest lists missing machine with MANIFEST_MISMATCH', async () => {
      const zip = makeManifestMismatchZip();
      await assertRejection(zip, 'MANIFEST_MISMATCH');
    });

    it('rejects invalid machine JSON schema with SCHEMA_INVALID', async () => {
      const zip = makeSchemaInvalidZip();
      await assertRejection(zip, 'SCHEMA_INVALID');
    });

    it('rejects unknown celestial body reference with REFERENCE_UNKNOWN', async () => {
      const zip = makeUnknownReferenceZip();
      await assertRejection(zip, 'REFERENCE_UNKNOWN');
    });

    it('rejects unapproved source host (non-NASA domain) with URL_NOT_ALLOWED', async () => {
      const zip = makeForbiddenHostSourceZip();
      await assertRejection(zip, 'URL_NOT_ALLOWED');
    });

    it('rejects duplicate slugs in manifest with DUPLICATE_SLUG', async () => {
      const zip = makeDuplicateSlugZip();
      await assertRejection(zip, 'DUPLICATE_SLUG');
    });
  });
});
