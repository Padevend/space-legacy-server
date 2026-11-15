import { describe, it, expect } from 'vitest';
import { prisma } from '#infrastructure/database/prisma_client';
import {
  hashPassword,
  verifyPassword,
  validatePassword,
  generateSessionToken,
  hashSessionToken,
  getAnonymousSessionExpiry,
  getAccountSessionExpiry,
  isAllowedSourceUrl,
  assertAllowedSourceUrl,
  eventBus,
  formatErrorResponse,
  ValidationError,
  NotFoundError,
} from '../../app/shared/index.js';

describe('Stage S3 Exit Gate: Schema, Migrations, Seed & Shared Socle (Section 5 & N7)', () => {
  it('verifies that the database has exactly 2 published celestial bodies (Moon and Mars)', async () => {
    const bodies = await prisma.celestialBody.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    expect(bodies).toHaveLength(2);
    expect(bodies[0]?.slug).toBe('moon');
    expect(bodies[0]?.name).toBe('Moon');
    expect(bodies[1]?.slug).toBe('mars');
    expect(bodies[1]?.name).toBe('Mars');
  });

  it('verifies authentic NASA machines are seeded for both Moon and Mars', async () => {
    const machines = await prisma.machine.findMany({
      include: {
        body: true,
        sources: true,
        facts: true,
        events: true,
        images: true,
        logbook: true,
      },
    });

    expect(machines.length).toBeGreaterThanOrEqual(7);

    const slugs = machines.map((m) => m.slug);
    const seededSlugs = [
      'apollo-11-lm',
      'surveyor-1',
      'apollo-15-lrv',
      'curiosity',
      'perseverance',
      'ingenuity',
      'viking-1',
    ];

    for (const slug of seededSlugs) {
      expect(slugs).toContain(slug);
    }

    const seededMachines = machines.filter((m) => seededSlugs.includes(m.slug));
    for (const m of seededMachines) {
      expect(['moon', 'mars']).toContain(m.body.slug);
      expect(m.name).toBeTruthy();
      expect(m.description).toBeTruthy();
      expect(m.missionPurpose).toBeTruthy();
      expect(m.howItWorked).toBeTruthy();
      expect(m.discoveries).toBeTruthy();
      expect(m.sources.length).toBeGreaterThan(0);
      expect(m.facts.length).toBeGreaterThan(0);
    }
  });

  it('enforces Rule N7: all MachineSource URLs must belong to allowed NASA domains', async () => {
    const sources = await prisma.machineSource.findMany();
    expect(sources.length).toBeGreaterThanOrEqual(7);

    for (const source of sources) {
      expect(source.url.startsWith('https://') || source.url.startsWith('http://')).toBe(true);
      expect(isAllowedSourceUrl(source.url), `Source URL '${source.url}' violates ALLOWED_SOURCE_HOSTS whitelist`).toBe(
        true
      );

      expect(() => assertAllowedSourceUrl(source.url)).not.toThrow();
    }
  });

  it('verifies that every MachineFact and MachineEvent links to a valid MachineSource', async () => {
    const facts = await prisma.machineFact.findMany({
      include: { source: true },
    });
    expect(facts.length).toBeGreaterThan(0);
    for (const fact of facts) {
      expect(fact.source).toBeDefined();
      expect(fact.source.machineId).toBe(fact.machineId);
      expect(fact.label).toBeTruthy();
      expect(fact.value).toBeTruthy();
    }

    const events = await prisma.machineEvent.findMany({
      include: { source: true },
    });
    expect(events.length).toBeGreaterThan(0);
    for (const event of events) {
      expect(event.source).toBeDefined();
      expect(event.source.machineId).toBe(event.machineId);
      expect(event.title).toBeTruthy();
      expect(event.description).toBeTruthy();
    }
  });

  it('verifies seeded quizzes, questions, options, and badges integrity', async () => {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    expect(quizzes.length).toBeGreaterThanOrEqual(2);

    for (const quiz of quizzes) {
      expect(quiz.title).toBeTruthy();
      expect(quiz.questions.length).toBeGreaterThan(0);

      for (const q of quiz.questions) {
        expect(q.prompt).toBeTruthy();
        expect(q.explanation).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.options.length).toBeLessThanOrEqual(4);

        const correctOptions = q.options.filter((opt) => opt.isCorrect);
        expect(correctOptions, `Question "${q.prompt}" must have exactly 1 correct option`).toHaveLength(1);
      }
    }

    const badges = await prisma.badge.findMany();
    expect(badges.length).toBeGreaterThanOrEqual(4);
    const badgeRules = badges.map((b) => b.rule);
    expect(badgeRules).toContain('QUIZ_COMPLETED_COUNT');
    expect(badgeRules).toContain('BODY_ALL_QUIZZES');
    expect(badgeRules).toContain('PERFECT_SCORE_COUNT');
  });

  it('verifies admin account exists and password verifies with Argon2id', async () => {
    const admin = await prisma.account.findUnique({
      where: { email: 'admin@spacelegacy.test' },
      include: { visitor: true },
    });

    expect(admin).toBeDefined();
    expect(admin?.role).toBe('ADMIN');
    expect(admin?.visitor).toBeDefined();

    const isMatch = await verifyPassword(admin!.passwordHash, 'AdminSpaceLegacy2026!');
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyPassword(admin!.passwordHash, 'WrongPassword123!');
    expect(isWrongMatch).toBe(false);
  });

  it('tests password validation rules (min 10 characters per Section 7)', async () => {
    expect(() => validatePassword('short')).toThrow(ValidationError);
    expect(() => validatePassword('123456789')).toThrow(ValidationError);
    expect(() => validatePassword('1234567890')).not.toThrow();

    const hash = await hashPassword('ValidSecurePassword2026!');
    expect(hash.startsWith('$argon2id$')).toBe(true);
    expect(await verifyPassword(hash, 'ValidSecurePassword2026!')).toBe(true);
  });

  it('tests 32-byte session token generation and SHA-256 hashing', () => {
    const token = generateSessionToken();
    expect(token).toHaveLength(64); // 32 bytes in hex = 64 characters
    expect(/^[0-9a-f]{64}$/.test(token)).toBe(true);

    const hash1 = hashSessionToken(token);
    const hash2 = hashSessionToken(token);
    expect(hash1).toHaveLength(64);
    expect(hash1).toBe(hash2);

    const anonExpiry = getAnonymousSessionExpiry();
    const accountExpiry = getAccountSessionExpiry();
    const now = Date.now();

    // Anonymous is ~90 days in the future
    const anonDiffDays = (anonExpiry.getTime() - now) / (1000 * 60 * 60 * 24);
    expect(Math.round(anonDiffDays)).toBe(90);

    // Account is ~30 days in the future
    const accountDiffDays = (accountExpiry.getTime() - now) / (1000 * 60 * 60 * 24);
    expect(Math.round(accountDiffDays)).toBe(30);
  });

  it('tests transactional event bus with VisitorMerged and VisitorDeleted events', async () => {
    let mergedPayload: { fromId: string; toId: string } | null = null;
    let deletedPayload: { id: string } | null = null;

    const unsubMerge = eventBus.subscribe('VisitorMerged', async (payload, _tx) => {
      mergedPayload = payload;
    });

    const unsubDelete = eventBus.subscribe('VisitorDeleted', async (payload, _tx) => {
      deletedPayload = payload;
    });

    await prisma.$transaction(async (tx) => {
      await eventBus.emit('VisitorMerged', { fromId: 'uuid-1', toId: 'uuid-2' }, tx);
      await eventBus.emit('VisitorDeleted', { id: 'uuid-3' }, tx);
    });

    expect(mergedPayload).toEqual({ fromId: 'uuid-1', toId: 'uuid-2' });
    expect(deletedPayload).toEqual({ id: 'uuid-3' });

    unsubMerge();
    unsubDelete();
  });

  it('tests Rule N12 uniform error formatting and absence of leaked internals', () => {
    const notFound = new NotFoundError('Machine was not found');
    const { response: res404, status: s404 } = formatErrorResponse(notFound);
    expect(s404).toBe(404);
    expect(res404).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'Machine was not found',
        details: [],
      },
    });

    const genericError = new Error('/var/app/internal/db.ts:42 syntax error near SELECT * FROM users');
    const { response: res500, status: s500 } = formatErrorResponse(genericError);
    expect(s500).toBe(500);
    expect(res500.error.code).toBe('INTERNAL_SERVER_ERROR');
    expect(res500.error.message).not.toContain('/var/app');
    expect(res500.error.message).not.toContain('SELECT * FROM');
    expect((res500.error as any).stack).toBeUndefined();
  });
});
