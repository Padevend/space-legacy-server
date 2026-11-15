import { describe, it, expect, beforeAll } from 'vitest';
import { createServer } from '../../bin/server.js';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword } from '#infrastructure/security/password_hasher';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ApiErrorResponse } from '#exceptions/handler';
import type { LoginResponse, RefreshResponse, GetMeResponse } from '../../docs/entities/user/api_response.js';

describe('E2E: Authentication & Session Lifecycle', () => {
  const app = createServer();
  const testEmail = `auth-test-${Date.now()}@spacelegacy.test`;
  const initialPassword = 'InitialStrongPassword123!#';
  const newPassword = 'NewStrongPassword456!#';
  let createdUserId = '';

  beforeAll(async () => {
    // Provision a test user
    const passwordHash = await hashPassword(initialPassword);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash,
        role: 'EDITOR',
        isActive: true,
      },
    });
    createdUserId = user.userId;

    // Ensure examples directory exists
    mkdirSync(resolve(process.cwd(), 'docs/entities/user/examples'), { recursive: true });
  });

  it('authenticates with valid credentials, sets HttpOnly refresh cookie, and issues JWT', async () => {
    const res = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        email: testEmail,
        password: initialPassword,
      }),
    });

    expect(res.status).toBe(200);

    // Verify Set-Cookie header
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain('space_legacy_refresh=');
    expect(setCookie).toContain('Path=/api/v1/auth');
    expect(setCookie).toContain('SameSite=Strict');

    const json = (await res.json()) as LoginResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(json.data.user.email).toBe(testEmail);
      expect(json.data.accessToken).toBeDefined();
      expect(json.data.tokenType).toBe('Bearer');
      expect(json.data.expiresIn).toBe(900);
      expect(json.meta.requestId).toBeDefined();

      // Capture real JSON example
      writeFileSync(
        resolve(process.cwd(), 'docs/entities/user/examples/login_success.json'),
        JSON.stringify(json, null, 2),
        'utf-8'
      );
    }
  });

  it('rejects login with wrong password and returns unified error envelope', async () => {
    const res = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'IncorrectPassword123!',
      }),
    });

    expect(res.status).toBe(401);
    const json = (await res.json()) as ApiErrorResponse;
    expect(json.success).toBe(false);
    expect(json.error.code).toBe('UNAUTHENTICATED');
    expect(json.error.message).toBe('Invalid email or password.');

    // Capture real JSON error example
    writeFileSync(
      resolve(process.cwd(), 'docs/entities/user/examples/login_invalid_credentials.json'),
      JSON.stringify(json, null, 2),
      'utf-8'
    );
  });

  it('allows access to GET /auth/me with valid Bearer token and rejects without it', async () => {
    // 1. Login to get token
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      body: JSON.stringify({ email: testEmail, password: initialPassword }),
    });
    const loginData = (await loginRes.json()) as LoginResponse;
    expect(loginData.success).toBe(true);
    const token = loginData.success ? loginData.data.accessToken : '';

    // 2. Access with Bearer token
    const meRes = await app.request('/api/v1/auth/me', {
      headers: { authorization: `Bearer ${token}` },
    });
    expect(meRes.status).toBe(200);
    const meData = (await meRes.json()) as GetMeResponse;
    expect(meData.success).toBe(true);
    if (meData.success) {
      expect(meData.data.email).toBe(testEmail);
      expect(meData.data.role).toBe('EDITOR');

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/user/examples/get_me_success.json'),
        JSON.stringify(meData, null, 2),
        'utf-8'
      );
    }

    // 3. Access without token returns 401
    const unauthRes = await app.request('/api/v1/auth/me');
    expect(unauthRes.status).toBe(401);
  });

  it('refreshes token family, rotates cookie, and rejects when CSRF token is missing', async () => {
    // 1. Login to obtain cookie
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      body: JSON.stringify({ email: testEmail, password: initialPassword }),
    });
    const cookieHeader = loginRes.headers.get('set-cookie')!;
    const refreshCookie = cookieHeader.split(';')[0]!;

    // 2. Request without X-CSRF-Token is blocked
    const csrfBlocked = await app.request('/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        cookie: refreshCookie,
        origin: 'http://localhost:3000',
      },
    });
    expect(csrfBlocked.status).toBe(403);

    // 3. Request with valid origin and X-CSRF-Token succeeds
    const refreshRes = await app.request('/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        cookie: refreshCookie,
        origin: 'http://localhost:3000',
        'x-csrf-token': 'csrf-session-token',
      },
    });

    expect(refreshRes.status).toBe(200);
    const rotatedCookieHeader = refreshRes.headers.get('set-cookie')!;
    expect(rotatedCookieHeader).toBeDefined();

    const refreshData = (await refreshRes.json()) as RefreshResponse;
    expect(refreshData.success).toBe(true);
    if (refreshData.success) {
      expect(refreshData.data.accessToken).toBeDefined();

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/user/examples/refresh_success.json'),
        JSON.stringify(refreshData, null, 2),
        'utf-8'
      );
    }

    // 4. Token Reuse Detection: presenting old refresh token revokes entire family!
    const reuseAttempt = await app.request('/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        cookie: refreshCookie, // Using old revoked cookie!
        origin: 'http://localhost:3000',
        'x-csrf-token': 'csrf-session-token',
      },
    });

    expect(reuseAttempt.status).toBe(401);
    const reuseJson = (await reuseAttempt.json()) as ApiErrorResponse;
    expect(reuseJson.error.message).toContain('Refresh token reuse detected');
  });

  it('changes password, revokes existing sessions, and allows login with new password', async () => {
    // 1. Login with initial password
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      body: JSON.stringify({ email: testEmail, password: initialPassword }),
    });
    const loginData = (await loginRes.json()) as LoginResponse;
    const token = loginData.success ? loginData.data.accessToken : '';

    // 2. Change password with wrong current password
    const wrongCurrentRes = await app.request('/api/v1/auth/change-password', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        currentPassword: 'WrongInitialPassword123!',
        newPassword,
      }),
    });
    expect(wrongCurrentRes.status).toBe(400);

    // 3. Change password with valid current password
    const changeRes = await app.request('/api/v1/auth/change-password', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        currentPassword: initialPassword,
        newPassword,
      }),
    });
    expect(changeRes.status).toBe(200);

    // 4. Verify old password no longer works
    const oldLogin = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      body: JSON.stringify({ email: testEmail, password: initialPassword }),
    });
    expect(oldLogin.status).toBe(401);

    // 5. Verify new password works
    const newLogin = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      body: JSON.stringify({ email: testEmail, password: newPassword }),
    });
    expect(newLogin.status).toBe(200);
  });

  it('logs out and clears refresh cookie', async () => {
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
      body: JSON.stringify({ email: testEmail, password: newPassword }),
    });
    const cookieHeader = loginRes.headers.get('set-cookie')!;
    const refreshCookie = cookieHeader.split(';')[0]!;

    const logoutRes = await app.request('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        cookie: refreshCookie,
        origin: 'http://localhost:3000',
        'x-csrf-token': 'csrf-token-123',
      },
    });

    expect(logoutRes.status).toBe(200);
    const clearedCookie = logoutRes.headers.get('set-cookie');
    expect(clearedCookie).toContain('space_legacy_refresh=;');
  });
});
