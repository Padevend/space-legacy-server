import { describe, it, expect, beforeAll } from 'vitest';
import { createServer } from '../../bin/server.js';
import { prisma } from '../../src/core/database/prisma.js';
import { hashPassword } from '../../src/core/security/password.js';
import { signAccessToken } from '../../src/core/security/tokens.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type {
  MeasurementListResponse,
  MeasurementResponse,
  MeasurementDetailResponse,
} from '../../docs/entities/measurement/api_response.js';

describe('E2E: Measurements Core Domain Module & Scientific Decimal Precision', () => {
  const app = createServer();
  let adminToken = '';
  let editorToken = '';
  let equipmentId = '';
  let sourceId = '';
  let createdMeasurementId = '';

  beforeAll(async () => {
    // 1. Auth Tokens
    const adminPass = await hashPassword('AdminPass123!#');
    const adminUser = await prisma.user.create({
      data: {
        email: `meas-admin-${Date.now()}@spacelegacy.test`,
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
        email: `meas-editor-${Date.now()}@spacelegacy.test`,
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

    // 2. Dependencies
    const equip = await prisma.equipment.create({
      data: {
        name: `LRV Rover Mass Test-${Date.now()}`,
        slug: `lrv-mass-${Date.now()}`,
        equipmentType: 'ROVER',
      },
    });
    equipmentId = equip.equipmentId;

    const source = await prisma.source.create({
      data: {
        title: `Lunar Surface Science Report-${Date.now()}`,
        url: `https://ntrs.nasa.gov/archive/nasa/casi.ntrs.nasa.gov-${Date.now()}.pdf`,
        publisher: 'NASA Technical Reports Server',
        sourceType: 'SCIENTIFIC_PAPER',
      },
    });
    sourceId = source.sourceId;

    mkdirSync(resolve(process.cwd(), 'docs/entities/measurement/examples'), { recursive: true });
  });

  it('allows ADMIN to record measurement and strictly verifies string serialization of Decimal(24, 8)', async () => {
    const highPrecisionValue = '210.45678901';
    const highPrecisionUncertainty = '0.05000001';

    const res = await app.request('/api/v1/admin/measurements', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        equipmentId,
        name: 'Total Lunar Roving Vehicle Mass',
        value: highPrecisionValue,
        unit: 'kg',
        measurementType: 'MASS',
        context: 'Earth weight including chassis, suspension, steering and battery assemblies.',
        measurementDate: '1972-12-07T05:33:00.000Z',
        isApproximate: false,
        uncertainty: highPrecisionUncertainty,
      }),
    });

    expect(res.status).toBe(201);
    const json = (await res.json()) as MeasurementResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      createdMeasurementId = json.data.measurementId;
      expect(res.headers.get('location')).toBe(`/api/v1/measurements/${createdMeasurementId}`);

      // Crucial: values must be strings, not numbers!
      expect(typeof json.data.value).toBe('string');
      expect(json.data.value).toBe(highPrecisionValue);
      expect(typeof json.data.uncertainty).toBe('string');
      expect(json.data.uncertainty).toBe(highPrecisionUncertainty);
      expect(json.data.measurementType).toBe('MASS');

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/measurement/examples/create_success.json'),
        JSON.stringify(json, null, 2)
      );
    }
  });

  it('allows public listing of measurements with type filter, pagination, and ETag', async () => {
    const res = await app.request('/api/v1/measurements?measurementType=MASS&page=1&pageSize=10');
    expect(res.status).toBe(200);
    expect(res.headers.get('etag')).toBeDefined();

    const json = (await res.json()) as MeasurementListResponse;
    expect(json.success).toBe(true);
    if (json.success) {
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.some((m: { measurementId: string }) => m.measurementId === createdMeasurementId)).toBe(true);

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/measurement/examples/list_success.json'),
        JSON.stringify(json, null, 2)
      );
    }
  });

  it('manages source relations and verifies single measurement detail with includes', async () => {
    // 1. Link Source
    const linkSourceRes = await app.request(`/api/v1/admin/measurements/${createdMeasurementId}/sources/${sourceId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({ claimDescription: 'Apollo 17 Mission Report table 4-2' }),
    });
    expect(linkSourceRes.status).toBe(200);

    // 2. Query measurement with include=equipment,sources
    const includeRes = await app.request(`/api/v1/measurements/${createdMeasurementId}?include=equipment,sources`);
    expect(includeRes.status).toBe(200);
    const detailJson = (await includeRes.json()) as MeasurementDetailResponse;
    expect(detailJson.success).toBe(true);
    if (detailJson.success) {
      expect(detailJson.data.equipment?.equipmentId).toBe(equipmentId);
      expect(detailJson.data.sources?.length).toBeGreaterThan(0);
      expect(detailJson.data.sources?.[0]?.claimDescription).toBe('Apollo 17 Mission Report table 4-2');

      writeFileSync(
        resolve(process.cwd(), 'docs/entities/measurement/examples/get_success.json'),
        JSON.stringify(detailJson, null, 2)
      );
    }
  });

  it('allows EDITOR to update measurement, but restricts DELETE to ADMIN', async () => {
    // 1. Update as EDITOR -> 200
    const updateRes = await app.request(`/api/v1/admin/measurements/${createdMeasurementId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${editorToken}`,
      },
      body: JSON.stringify({ context: 'Updated weight measurement context.' }),
    });
    expect(updateRes.status).toBe(200);

    // 2. Try delete as EDITOR -> 403
    const editorDeleteRes = await app.request(`/api/v1/admin/measurements/${createdMeasurementId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${editorToken}` },
    });
    expect(editorDeleteRes.status).toBe(403);

    // 3. Delete as ADMIN -> 200
    const adminDeleteRes = await app.request(`/api/v1/admin/measurements/${createdMeasurementId}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(adminDeleteRes.status).toBe(200);

    // 4. Verify 404
    const verifyRes = await app.request(`/api/v1/measurements/${createdMeasurementId}`);
    expect(verifyRes.status).toBe(404);
  });
});
