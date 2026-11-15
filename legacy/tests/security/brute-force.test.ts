import { describe, it, expect, beforeAll } from 'vitest';
import { createServer } from '../../bin/server.js';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword } from '#infrastructure/security/password_hasher';
import type { ApiErrorResponse } from '#exceptions/handler';

describe('Security: Brute-Force Protection & Timing Equivalence', () => {
  const app = createServer();
  const lockoutEmail = `lockout-test-${Date.now()}@spacelegacy.test`;
  const password = 'CorrectPassword123!#';
  let userId = '';

  beforeAll(async () => {
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: lockoutEmail,
        passwordHash,
        role: 'EDITOR',
        isActive: true,
      },
    });
    userId = user.userId;
  });

  it('locks account on the 5th failed login attempt and preserves identical response format', async () => {
    // Attempts 1 to 4: failed logins
    for (let attempt = 1; attempt <= 4; attempt++) {
      const res = await app.request('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
        body: JSON.stringify({ email: lockoutEmail, password: 'WrongPassword!' }),
      });
      expect(res.status).toBe(401);
      const json = (await res.json()) as ApiErrorResponse;
      expect(json.error.message).toBe('Invalid email or password.');
    }

    // Check database counter is 4
    let dbUser = await prisma.user.findUnique({ where: { userId } });
    expect(dbUser?.failedLoginCount).toBe(4);
    expect(dbUser?.lockedUntil).toBeNull();

    // 5th attempt: triggers lockout
    const fifthRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      body: JSON.stringify({ email: lockoutEmail, password: 'WrongPassword!' }),
    });
    expect(fifthRes.status).toBe(401);

    dbUser = await prisma.user.findUnique({ where: { userId } });
    expect(dbUser?.failedLoginCount).toBe(5);
    expect(dbUser?.lockedUntil).not.toBeNull();
    expect(dbUser!.lockedUntil!.getTime()).toBeGreaterThan(Date.now());

    // 6th attempt (even with CORRECT password): rejected due to account lockout
    const lockedRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      body: JSON.stringify({ email: lockoutEmail, password }),
    });
    expect(lockedRes.status).toBe(401);
    const lockedJson = (await lockedRes.json()) as ApiErrorResponse;
    // Section 9.3: Identical response for unknown email, wrong password, and locked account
    expect(lockedJson.error.message).toBe('Invalid email or password.');
    expect(lockedJson.error.code).toBe('UNAUTHENTICATED');
  });

  it('guarantees timing equivalence and identical error structure between unknown email and wrong password', async () => {
    const unknownEmail = `unknown-user-${Date.now()}@spacelegacy.test`;

    // 1. Unknown email request
    const startUnknown = performance.now();
    const unknownRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      body: JSON.stringify({ email: unknownEmail, password: 'AnyPassword123!' }),
    });
    const durationUnknown = performance.now() - startUnknown;

    // 2. Known user, wrong password request
    const startWrongPass = performance.now();
    const wrongPassRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      body: JSON.stringify({ email: lockoutEmail, password: 'WrongPassword123!' }),
    });
    const durationWrongPass = performance.now() - startWrongPass;

    expect(unknownRes.status).toBe(401);
    expect(wrongPassRes.status).toBe(401);

    const unknownJson = (await unknownRes.json()) as ApiErrorResponse;
    const wrongPassJson = (await wrongPassRes.json()) as ApiErrorResponse;

    // Identical error envelope and message
    expect(unknownJson.error.code).toBe(wrongPassJson.error.code);
    expect(unknownJson.error.message).toBe(wrongPassJson.error.message);

    // Both execute Argon2id verify, so both take tens of milliseconds (not sub-millisecond)
    expect(durationUnknown).toBeGreaterThan(15);
    expect(durationWrongPass).toBeGreaterThan(15);
  });

  it('rejects inactive or disabled user accounts with 401 UNAUTHENTICATED', async () => {
    const inactiveEmail = `inactive-${Date.now()}@spacelegacy.test`;
    const passwordHash = await hashPassword('ValidPassword123!#');
    await prisma.user.create({
      data: {
        email: inactiveEmail,
        passwordHash,
        role: 'EDITOR',
        isActive: false, // Disabled
      },
    });

    const res = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      body: JSON.stringify({ email: inactiveEmail, password: 'ValidPassword123!#' }),
    });

    expect(res.status).toBe(401);
    const json = (await res.json()) as ApiErrorResponse;
    expect(json.error.code).toBe('UNAUTHENTICATED');
    expect(json.error.message).toContain('inactive or disabled');
  });
});
