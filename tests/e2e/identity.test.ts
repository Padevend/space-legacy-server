import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestApp } from '../helpers/test_app.js';
import { prisma } from '#infrastructure/database/prisma_client';

describe('Stage S6: Identity, Sessions, Merging & Account Lifecycle (E2E-P5 / E2E-P6)', () => {
  const app = getTestApp();

  let anonToken1: string;
  let anonVisitorId1: string;
  let accountToken: string;
  let accountVisitorId: string;
  let accountId: string;

  const testEmail = 'alex.explorer.s6@spacelegacy.test';
  const initialPassword = 'InitialSecurePassword123!';
  const updatedPassword = 'NewSecretPassword456!';

  async function cleanupTestUser() {
    const existing = await prisma.account.findUnique({
      where: { email: testEmail },
      include: { visitor: true },
    });
    if (existing) {
      await prisma.visitor.delete({ where: { id: existing.visitorId } }).catch(() => {});
    }
  }

  beforeAll(async () => {
    await cleanupTestUser();
  });

  afterAll(async () => {
    await cleanupTestUser();
  });

  it('Journey P5: Step 1 - Visitor creates anonymous session and receives 32-byte token', async () => {
    const res = await app.request('/api/v1/session/anonymous', {
      method: 'POST',
    });

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.token).toBeDefined();
    // 32-byte token hex string is 64 characters
    expect(body.token).toHaveLength(64);
    expect(body.isAnonymous).toBe(true);
    expect(body.visitorId).toBeDefined();

    anonToken1 = body.token;
    anonVisitorId1 = body.visitorId;

    // Check DB session persistence
    const dbVisitor = await prisma.visitor.findUnique({
      where: { id: anonVisitorId1 },
      include: { sessions: true },
    });
    expect(dbVisitor).toBeDefined();
    expect(dbVisitor?.sessions).toHaveLength(1);
    expect(dbVisitor?.sessions[0]?.tokenHash).toBeDefined();
  });

  it('Journey P5: Step 2 - Anonymous session creation is idempotent with valid bearer token', async () => {
    const res = await app.request('/api/v1/session/anonymous', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${anonToken1}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.token).toBe(anonToken1);
    expect(body.visitorId).toBe(anonVisitorId1);
    expect(body.isAnonymous).toBe(true);
  });

  it('Journey P5: Step 3 - Anonymous visitor checks GET /me', async () => {
    const res = await app.request('/api/v1/me', {
      headers: {
        authorization: `Bearer ${anonToken1}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.isAnonymous).toBe(true);
    expect(body.visitorId).toBe(anonVisitorId1);
    expect(body.account).toBeNull();
  });

  it('Journey P5: Step 4 - Anonymous visitor registers an account (ties to current visitorId)', async () => {
    const res = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${anonToken1}`,
      },
      body: JSON.stringify({
        email: '  Alex.Explorer.S6@SpaceLegacy.Test  ',
        password: initialPassword,
        displayName: 'Alex Explorer',
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();

    expect(body.token).toBeDefined();
    expect(body.token).toHaveLength(64);
    expect(body.isAnonymous).toBe(false);
    // Crucial: visitorId is preserved from the anonymous session
    expect(body.visitorId).toBe(anonVisitorId1);

    expect(body.account).toBeDefined();
    expect(body.account.email).toBe(testEmail); // Lowercased and trimmed
    expect(body.account.displayName).toBe('Alex Explorer');
    expect(body.account.role).toBe('USER');

    accountToken = body.token;
    accountVisitorId = body.visitorId;
    accountId = body.account.id;
  });

  it('Journey P5: Step 5 - Authenticated user checks GET /me', async () => {
    const res = await app.request('/api/v1/me', {
      headers: {
        authorization: `Bearer ${accountToken}`,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.isAnonymous).toBe(false);
    expect(body.visitorId).toBe(accountVisitorId);
    expect(body.account).toBeDefined();
    expect(body.account.id).toBe(accountId);
    expect(body.account.email).toBe(testEmail);
    expect(body.account.displayName).toBe('Alex Explorer');
  });

  it('Journey P5: Step 6 - Rejects duplicate registration on same visitor (409 Conflict)', async () => {
    const res = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${accountToken}`,
      },
      body: JSON.stringify({
        email: 'another.email@spacelegacy.test',
        password: initialPassword,
        displayName: 'Another Name',
      }),
    });

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error.code).toBe('CONFLICT');
  });

  it('Journey P5: Step 7 - Rejects duplicate registration on existing email (409 Conflict)', async () => {
    // New anonymous visitor tries to register with the same email
    const anonRes = await app.request('/api/v1/session/anonymous', { method: 'POST' });
    const anonBody = await anonRes.json();

    const res = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${anonBody.token}`,
      },
      body: JSON.stringify({
        email: testEmail.toUpperCase(),
        password: initialPassword,
        displayName: 'Imposter',
      }),
    });

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error.code).toBe('CONFLICT');

    // Clean up temporary visitor
    await prisma.visitor.delete({ where: { id: anonBody.visitorId } }).catch(() => {});
  });

  it('Journey P5: Step 8 - Rejects password shorter than 10 characters', async () => {
    const res = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email: 'short.pass@spacelegacy.test',
        password: 'short',
        displayName: 'Short',
      }),
    });

    expect([400, 422]).toContain(res.status);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it('Journey P5: Step 9 - Login returns identical 401 error for unknown email and wrong password', async () => {
    // Unknown email
    const unknownRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'unknown.ghost@spacelegacy.test',
        password: 'SomeRandomPassword123!',
      }),
    });
    expect(unknownRes.status).toBe(401);
    const unknownBody = await unknownRes.json();

    // Wrong password on existing account
    const wrongPassRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'IncorrectPassword123!',
      }),
    });
    expect(wrongPassRes.status).toBe(401);
    const wrongPassBody = await wrongPassRes.json();

    // Identical error code and message
    expect(unknownBody.error.code).toBe('UNAUTHORIZED');
    expect(wrongPassBody.error.code).toBe('UNAUTHORIZED');
    expect(unknownBody.error.message).toBe(wrongPassBody.error.message);
  });

  it('Journey P5: Step 10 - Login merges anonymous visitor into account and deletes anonymous visitor', async () => {
    // 1. Create a fresh anonymous visitor
    const anonRes = await app.request('/api/v1/session/anonymous', { method: 'POST' });
    const anonData = await anonRes.json();
    const tempAnonVisitorId = anonData.visitorId;

    // Verify temp visitor exists in DB
    const tempDbVisitor = await prisma.visitor.findUnique({ where: { id: tempAnonVisitorId } });
    expect(tempDbVisitor).toBeDefined();

    // 2. Log in with existing account credentials while presenting temp visitor token
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${anonData.token}`,
      },
      body: JSON.stringify({
        email: testEmail,
        password: initialPassword,
      }),
    });

    expect(loginRes.status).toBe(200);
    const loginData = await loginRes.json();

    expect(loginData.token).toBeDefined();
    expect(loginData.isAnonymous).toBe(false);
    expect(loginData.visitorId).toBe(accountVisitorId);

    // 3. Verify the temporary anonymous visitor was physically deleted
    const deletedAnon = await prisma.visitor.findUnique({ where: { id: tempAnonVisitorId } });
    expect(deletedAnon).toBeNull();

    // 4. Update active account token
    accountToken = loginData.token;
  });

  it('Journey P5: Step 11 - Logout revokes the session token', async () => {
    const logoutRes = await app.request('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accountToken}`,
      },
    });

    expect(logoutRes.status).toBe(200);
    const logoutBody = await logoutRes.json();
    expect(logoutBody.success).toBe(true);

    // Subsequent GET /me with that token must be rejected with 401
    const meRes = await app.request('/api/v1/me', {
      headers: {
        authorization: `Bearer ${accountToken}`,
      },
    });
    expect(meRes.status).toBe(401);
  });

  it('Journey P6: Step 12 - Targeted PATCH update of user profile', async () => {
    // Re-login to get fresh token
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: initialPassword }),
    });
    const loginData = await loginRes.json();
    accountToken = loginData.token;

    // Partial update: displayName only
    const patchRes = await app.request('/api/v1/me', {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${accountToken}`,
      },
      body: JSON.stringify({ displayName: 'Commander Alex' }),
    });

    expect(patchRes.status).toBe(200);
    const patchBody = await patchRes.json();
    expect(patchBody.account.displayName).toBe('Commander Alex');
    expect(patchBody.account.email).toBe(testEmail); // Email untouched
  });

  it('Journey P6: Step 13 - Targeted PATCH update of password and re-login verification', async () => {
    // Wrong current password fails
    const badPassRes = await app.request('/api/v1/me/password', {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${accountToken}`,
      },
      body: JSON.stringify({
        currentPassword: 'WrongPassword!',
        newPassword: updatedPassword,
      }),
    });
    expect(badPassRes.status).toBe(401);

    // Correct current password succeeds
    const goodPassRes = await app.request('/api/v1/me/password', {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${accountToken}`,
      },
      body: JSON.stringify({
        currentPassword: initialPassword,
        newPassword: updatedPassword,
      }),
    });
    expect(goodPassRes.status).toBe(200);

    // Old password no longer works
    const oldLoginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: initialPassword }),
    });
    expect(oldLoginRes.status).toBe(401);

    // New password succeeds
    const newLoginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: updatedPassword }),
    });
    expect(newLoginRes.status).toBe(200);
    const newLoginData = await newLoginRes.json();
    accountToken = newLoginData.token;
  });

  it('Journey P6: Step 14 - Physical cascade hard deletion (N8)', async () => {
    // Verify rejection if confirmation is not 'DELETE'
    const badConfirmRes = await app.request('/api/v1/me', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${accountToken}`,
      },
      body: JSON.stringify({
        password: updatedPassword,
        confirmation: 'delete', // lowercase rejected
      }),
    });
    expect([400, 422]).toContain(badConfirmRes.status);

    // Verify rejection on wrong password
    const badPassDeleteRes = await app.request('/api/v1/me', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${accountToken}`,
      },
      body: JSON.stringify({
        password: 'WrongPassword123!',
        confirmation: 'DELETE',
      }),
    });
    expect(badPassDeleteRes.status).toBe(401);

    // Verify account and visitor exist before deletion
    const beforeAccount = await prisma.account.findUnique({ where: { id: accountId } });
    const beforeVisitor = await prisma.visitor.findUnique({ where: { id: accountVisitorId } });
    expect(beforeAccount).toBeDefined();
    expect(beforeVisitor).toBeDefined();

    // Perform valid hard deletion
    const deleteRes = await app.request('/api/v1/me', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${accountToken}`,
      },
      body: JSON.stringify({
        password: updatedPassword,
        confirmation: 'DELETE',
      }),
    });

    expect(deleteRes.status).toBe(200);
    const deleteBody = await deleteRes.json();
    expect(deleteBody.deleted).toBe(true);

    // Verify physical deletion across tables (N8 Hard Deletion Rule)
    const afterAccount = await prisma.account.findUnique({ where: { id: accountId } });
    const afterVisitor = await prisma.visitor.findUnique({ where: { id: accountVisitorId } });
    const afterSessions = await prisma.session.findMany({
      where: { visitorId: accountVisitorId },
    });

    expect(afterAccount).toBeNull();
    expect(afterVisitor).toBeNull();
    expect(afterSessions).toHaveLength(0);

    // Verify session token is permanently invalid (401)
    const postDeleteMeRes = await app.request('/api/v1/me', {
      headers: {
        authorization: `Bearer ${accountToken}`,
      },
    });
    expect(postDeleteMeRes.status).toBe(401);
  });
});
