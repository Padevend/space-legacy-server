import { describe, it, expect, beforeAll } from 'vitest';
import { createServer } from '../../bin/server.js';
import { prisma } from '#infrastructure/database/prisma_client';
import { hashPassword } from '#infrastructure/security/password_hasher';
import { signAccessToken } from '#infrastructure/security/token_service';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ApiErrorResponse } from '#exceptions/handler';
import type { ListUsersResponse, GetUserResponse, CreateUserResponse } from '../../docs/entities/user/api_response.js';

describe('Security: RBAC & Admin Users Authorization', () => {
  const app = createServer();
  let adminToken = '';
  let editorToken = '';
  let adminUserId = '';
  let editorUserId = '';

  beforeAll(async () => {
    // 1. Create an ADMIN user
    const adminPassHash = await hashPassword('AdminSecurePass123!#');
    const adminUser = await prisma.user.create({
      data: {
        email: `rbac-admin-${Date.now()}@spacelegacy.test`,
        passwordHash: adminPassHash,
        role: 'ADMIN',
        isActive: true,
      },
    });
    adminUserId = adminUser.userId;
    adminToken = await signAccessToken({
      userId: adminUser.userId,
      email: adminUser.email,
      role: 'ADMIN',
    });

    // 2. Create an EDITOR user
    const editorPassHash = await hashPassword('EditorSecurePass123!#');
    const editorUser = await prisma.user.create({
      data: {
        email: `rbac-editor-${Date.now()}@spacelegacy.test`,
        passwordHash: editorPassHash,
        role: 'EDITOR',
        isActive: true,
      },
    });
    editorUserId = editorUser.userId;
    editorToken = await signAccessToken({
      userId: editorUser.userId,
      email: editorUser.email,
      role: 'EDITOR',
    });
  });

  it('rejects unauthenticated requests to /api/v1/admin/users with 401 UNAUTHENTICATED', async () => {
    const res = await app.request('/api/v1/admin/users');
    expect(res.status).toBe(401);
    const json = (await res.json()) as ApiErrorResponse;
    expect(json.error.code).toBe('UNAUTHENTICATED');
  });

  it('rejects EDITOR requests to /api/v1/admin/users with 403 FORBIDDEN (RBAC enforcement)', async () => {
    const res = await app.request('/api/v1/admin/users', {
      headers: { authorization: `Bearer ${editorToken}` },
    });
    expect(res.status).toBe(403);
    const json = (await res.json()) as ApiErrorResponse;
    expect(json.error.code).toBe('FORBIDDEN');
    expect(json.error.message).toContain('Admin role required');
  });

  it('allows ADMIN to list users with pagination and search', async () => {
    const res = await app.request('/api/v1/admin/users?page=1&pageSize=10', {
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(res.status).toBe(200);

    const json = (await res.json()) as ListUsersResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.meta.page).toBe(1);
      expect(json.meta.pageSize).toBe(10);
      expect(json.meta.total).toBeGreaterThanOrEqual(2);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/user/examples/list_users_success.json'),
        JSON.stringify(json, null, 2),
        'utf-8'
      );
    }
  });

  it('allows ADMIN to perform full CRUD on users', async () => {
    const newEmail = `crud-user-${Date.now()}@spacelegacy.test`;

    // 1. Create User
    const createRes = await app.request('/api/v1/admin/users', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        email: newEmail,
        role: 'EDITOR',
        password: 'ValidStrongPassword123!#',
      }),
    });

    expect(createRes.status).toBe(201);
    expect(createRes.headers.get('location')).toBeDefined();

    const createdData = (await createRes.json()) as CreateUserResponse;
    expect(createdData.success).toBe(true);
    let targetUserId = '';
    if (createdData.success) {
      targetUserId = createdData.data.userId;
      expect(createdData.data.email).toBe(newEmail);
      expect(createdData.data.role).toBe('EDITOR');

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/user/examples/create_user_success.json'),
        JSON.stringify(createdData, null, 2),
        'utf-8'
      );
    }

    // 2. Get User by ID
    const getRes = await app.request(`/api/v1/admin/users/${targetUserId}`, {
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(getRes.status).toBe(200);
    const getData = (await getRes.json()) as GetUserResponse;
    expect(getData.success).toBe(true);
    if (getData.success) {
      expect(getData.data.userId).toBe(targetUserId);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/user/examples/get_user_success.json'),
        JSON.stringify(getData, null, 2),
        'utf-8'
      );
    }

    // 3. Update User (promote to ADMIN)
    const updateRes = await app.request(`/api/v1/admin/users/${targetUserId}`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        role: 'ADMIN',
      }),
    });
    expect(updateRes.status).toBe(200);
    const updatedData = await updateRes.json();
    expect(updatedData.data.role).toBe('ADMIN');

    // 4. Delete User
    const deleteRes = await app.request(`/api/v1/admin/users/${targetUserId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${adminToken}`,
        origin: 'http://localhost:3000',
      },
    });
    expect(deleteRes.status).toBe(200);

    // 5. Verify deleted user no longer exists
    const verifyGet = await app.request(`/api/v1/admin/users/${targetUserId}`, {
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(verifyGet.status).toBe(404);
  });

  it('rejects mass assignment: unknown keys in request bodies return validation error', async () => {
    const res = await app.request('/api/v1/admin/users', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({
        email: `mass-assign-${Date.now()}@spacelegacy.test`,
        role: 'EDITOR',
        password: 'ValidStrongPassword123!#',
        injectedField: 'malicious-data',
        __proto__: { isAdmin: true },
      }),
    });

    expect(res.status).toBe(422);
    const json = (await res.json()) as ApiErrorResponse;
    expect(json.error.code).toBe('VALIDATION_ERROR');
    expect(json.error.details).toBeDefined();

    writeFileSync(
      resolve(process.cwd(), 'docs/entities/user/examples/validation_error.json'),
      JSON.stringify(json, null, 2),
      'utf-8'
    );
  });
});
