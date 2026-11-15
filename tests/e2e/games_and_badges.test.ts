import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp } from '../helpers/test_app.js';
import { prisma } from '#infrastructure/database/prisma_client';

describe('Stage S7: Games, Quizzes, Badges & Visitor Merge (E2E-P4)', () => {
  const app = getTestApp();

  let anonToken: string;
  let anonVisitorId: string;
  let testAccountToken: string;
  let testAccountVisitorId: string;
  const testEmail = 'quiz.gamer.s7@spacelegacy.test';
  const testPassword = 'SecurePassword789!';

  async function cleanup() {
    const existing = await prisma.account.findUnique({
      where: { email: testEmail },
      include: { visitor: true },
    });
    if (existing) {
      await prisma.visitor.delete({ where: { id: existing.visitorId } }).catch(() => {});
    }
  }

  beforeAll(async () => {
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
  });

  it('Journey P4: Step 1 - Visitor lists published quizzes with optional filters', async () => {
    const res = await app.request('/api/v1/quizzes');

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.quizzes).toBeDefined();
    expect(Array.isArray(body.quizzes)).toBe(true);
    expect(body.quizzes.length).toBeGreaterThanOrEqual(2);

    for (const q of body.quizzes) {
      expect(q.slug).toBeDefined();
      expect(q.title).toBeDefined();
      expect(q.level).toBeDefined();
      expect(typeof q.questionCount).toBe('number');
      expect(q.questionCount).toBeGreaterThan(0);
    }

    // Filter by body=moon
    const moonRes = await app.request('/api/v1/quizzes?body=moon');
    expect(moonRes.status).toBe(200);
    const moonBody = await moonRes.json();
    for (const q of moonBody.quizzes) {
      expect(q.body.slug).toBe('moon');
    }

    // Filter by level=EXPLORER
    const explorerRes = await app.request('/api/v1/quizzes?level=EXPLORER');
    expect(explorerRes.status).toBe(200);
    const explorerBody = await explorerRes.json();
    for (const q of explorerBody.quizzes) {
      expect(q.level).toBe('EXPLORER');
    }
  });

  it('Journey P4: Step 2 - Visitor opens quiz by slug without exposing answers (isCorrect & explanation hidden)', async () => {
    const res = await app.request('/api/v1/quizzes/moon-explorer');

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.quiz).toBeDefined();
    const quiz = body.quiz;

    expect(quiz.slug).toBe('moon-explorer');
    expect(quiz.title).toBe('Moon Explorer Quiz');
    expect(quiz.questions.length).toBeGreaterThanOrEqual(2);

    // CRITICAL: Ensure neither isCorrect nor explanation are exposed
    for (const question of quiz.questions) {
      expect(question.prompt).toBeDefined();
      expect(question.explanation).toBeUndefined();

      expect(question.options.length).toBeGreaterThanOrEqual(2);
      for (const option of question.options) {
        expect(option.label).toBeDefined();
        expect(option.sortOrder).toBeDefined();
        expect(option.isCorrect).toBeUndefined();
      }
    }
  });

  it('Journey P4: Step 3 - Anonymous visitor submits perfect score attempt and unlocks badges', async () => {
    // 1. Create anonymous session
    const anonRes = await app.request('/api/v1/session/anonymous', { method: 'POST' });
    const anonData = await anonRes.json();
    anonToken = anonData.token;
    anonVisitorId = anonData.visitorId;

    // 2. Fetch the true answers directly from database for the test assertion
    const dbQuiz = await prisma.quiz.findUnique({
      where: { slug: 'moon-explorer' },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
    expect(dbQuiz).toBeDefined();

    const answersPayload = dbQuiz!.questions.map((q) => {
      const correctOption = q.options.find((o) => o.isCorrect);
      return {
        questionId: q.id,
        optionId: correctOption!.id,
      };
    });

    // 3. Submit attempt
    const attemptRes = await app.request('/api/v1/quizzes/moon-explorer/attempts', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${anonToken}`,
      },
      body: JSON.stringify({ answers: answersPayload }),
    });

    expect(attemptRes.status).toBe(201);
    const attemptBody = await attemptRes.json();

    expect(attemptBody.attempt).toBeDefined();
    expect(attemptBody.attempt.score).toBe(dbQuiz!.questions.length);
    expect(attemptBody.attempt.maxScore).toBe(dbQuiz!.questions.length);
    expect(attemptBody.attempt.percentage).toBe(100);

    // After submission, answers include correctness and explanations
    for (const ans of attemptBody.attempt.answers) {
      expect(ans.isCorrect).toBe(true);
      expect(ans.explanation).toBeTruthy();
    }

    // Verify badges awarded: first-steps (1st quiz completed) and lunar-scholar (all Moon quizzes completed)
    expect(attemptBody.newBadges).toBeDefined();
    expect(attemptBody.newBadges.length).toBeGreaterThanOrEqual(2);

    const badgeSlugs = attemptBody.newBadges.map((b: any) => b.slug);
    expect(badgeSlugs).toContain('first-steps');
    expect(badgeSlugs).toContain('lunar-scholar');
  });

  it('Journey P4: Step 4 - Visitor checks GET /me/progress', async () => {
    const res = await app.request('/api/v1/me/progress', {
      headers: {
        authorization: `Bearer ${anonToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.progress).toBeDefined();
    const progress = body.progress;

    expect(progress.visitorId).toBe(anonVisitorId);
    expect(progress.totalAttempts).toBeGreaterThanOrEqual(1);
    expect(progress.completedQuizzesCount).toBeGreaterThanOrEqual(1);
    expect(progress.perfectScoresCount).toBeGreaterThanOrEqual(1);
    expect(progress.badgesCount).toBeGreaterThanOrEqual(2);

    const badgeSlugs = progress.badges.map((b: any) => b.slug);
    expect(badgeSlugs).toContain('first-steps');
    expect(badgeSlugs).toContain('lunar-scholar');
  });

  it('Journey P4: Step 5 - Visitor checks GET /badges with unlocked status', async () => {
    const res = await app.request('/api/v1/badges', {
      headers: {
        authorization: `Bearer ${anonToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.badges).toBeDefined();
    expect(body.badges.length).toBeGreaterThanOrEqual(4);

    const firstSteps = body.badges.find((b: any) => b.slug === 'first-steps');
    expect(firstSteps.unlocked).toBe(true);
    expect(firstSteps.earnedAt).toBeTruthy();

    const lunarScholar = body.badges.find((b: any) => b.slug === 'lunar-scholar');
    expect(lunarScholar.unlocked).toBe(true);
    expect(lunarScholar.earnedAt).toBeTruthy();

    // Check unearned badges (perfectionist requires 3 perfect scores, martian requires Mars quiz)
    const perfectionist = body.badges.find((b: any) => b.slug === 'perfectionist');
    expect(perfectionist.unlocked).toBe(false);
    expect(perfectionist.earnedAt).toBeNull();

    // Check an unearned badge
    const martian = body.badges.find((b: any) => b.slug === 'martian-pioneer');
    expect(martian.unlocked).toBe(false);
    expect(martian.earnedAt).toBeNull();
  });

  it('Visitor Merging: Registering preserves progress and badges under account', async () => {
    // Register account using the anonymous session that just earned badges
    const regRes = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${anonToken}`,
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        displayName: 'Gamer Alex',
      }),
    });

    expect(regRes.status).toBe(201);
    const regData = await regRes.json();
    testAccountToken = regData.token;
    testAccountVisitorId = regData.visitorId;
    expect(testAccountVisitorId).toBe(anonVisitorId);

    // Verify progress is intact on the registered account
    const progRes = await app.request('/api/v1/me/progress', {
      headers: { authorization: `Bearer ${testAccountToken}` },
    });
    expect(progRes.status).toBe(200);
    const progData = await progRes.json();
    expect(progData.progress.badgesCount).toBeGreaterThanOrEqual(2);
  });

  it('Visitor Merging: Logging into account from new anonymous session merges games progress', async () => {
    // 1. Create a second anonymous visitor
    const anon2Res = await app.request('/api/v1/session/anonymous', { method: 'POST' });
    const anon2Data = await anon2Res.json();
    const anon2Token = anon2Data.token;
    const anon2VisitorId = anon2Data.visitorId;

    // 2. Play a quiz with anon2 (e.g. mars-curiosity-expert if available, or moon-explorer)
    const dbQuiz = await prisma.quiz.findFirst({
      where: { isPublished: true },
      include: { questions: { include: { options: true } } },
    });

    const answersPayload = dbQuiz!.questions.map((q) => ({
      questionId: q.id,
      optionId: q.options[0]!.id,
    }));

    await app.request(`/api/v1/quizzes/${dbQuiz!.slug}/attempts`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${anon2Token}`,
      },
      body: JSON.stringify({ answers: answersPayload }),
    });

    // Verify anon2 has 1 attempt
    const beforeAttempts = await prisma.quizAttempt.findMany({
      where: { visitorId: anon2VisitorId },
    });
    expect(beforeAttempts).toHaveLength(1);

    // 3. Log in to test account while carrying anon2's Bearer token
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${anon2Token}`,
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    expect(loginRes.status).toBe(200);
    const loginData = await loginRes.json();

    // 4. Verify anon2 was deleted
    const deletedAnon2 = await prisma.visitor.findUnique({ where: { id: anon2VisitorId } });
    expect(deletedAnon2).toBeNull();

    // 5. Verify the attempt was reassigned to the account's visitor
    const reassignedAttempt = await prisma.quizAttempt.findUnique({
      where: { id: beforeAttempts[0]!.id },
    });
    expect(reassignedAttempt?.visitorId).toBe(testAccountVisitorId);

    // 6. Check total progress on account
    const progRes = await app.request('/api/v1/me/progress', {
      headers: { authorization: `Bearer ${loginData.token}` },
    });
    const progData = await progRes.json();
    expect(progData.progress.totalAttempts).toBeGreaterThanOrEqual(2);
  });

  it('Edge Case: Rejects attempt without session (401)', async () => {
    const res = await app.request('/api/v1/quizzes/moon-explorer/attempts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        answers: [
          { questionId: '12345678-1234-1234-1234-123456789012', optionId: '12345678-1234-1234-1234-123456789012' },
        ],
      }),
    });
    expect(res.status).toBe(401);
  });

  it('Edge Case: 404 with N12 envelope when quiz does not exist', async () => {
    const res = await app.request('/api/v1/quizzes/non-existent-quiz');
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.error.message).toContain('non-existent-quiz');
  });

  it('Edge Case: Validation error when submitting empty answers array', async () => {
    const res = await app.request('/api/v1/quizzes/moon-explorer/attempts', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${testAccountToken}`,
      },
      body: JSON.stringify({ answers: [] }),
    });
    expect([400, 422]).toContain(res.status);
  });
});
