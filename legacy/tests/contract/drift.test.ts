import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer } from '../../bin/server.js';
import type { RouteEntry } from '../../commands/routes_list.js';

describe('Documentation Anti-Drift Verification (Contract)', () => {
  it('ensures routes-map.json exists and accurately mirrors the server routing registry', () => {
    const routeMapPath = resolve(process.cwd(), 'docs/api/routes-map.json');
    expect(existsSync(routeMapPath)).toBe(true);

    const content = JSON.parse(readFileSync(routeMapPath, 'utf-8')) as RouteEntry[];
    const app = createServer();
    const routerRoutes = app.routes.filter((r) => r.method !== 'ALL');

    // Every non-ALL route must appear in routes-map.json
    for (const r of routerRoutes) {
      const match = content.find((entry) => entry.path === r.path && entry.method === r.method);
      expect(
        match,
        `Route ${r.method} ${r.path} is registered in Hono router but missing from routes-map.json. Run 'pnpm ace routes:list'.`
      ).toBeDefined();
    }
  });

  it('ensures openapi.json exists and is valid JSON', () => {
    const openApiPath = resolve(process.cwd(), 'docs/api/openapi.json');
    expect(existsSync(openApiPath)).toBe(true);

    const doc = JSON.parse(readFileSync(openApiPath, 'utf-8'));
    expect(doc.openapi).toBe('3.1.0');
    expect(doc.info.title).toBe('SPACE LEGACY API');
    expect(doc.paths).toBeDefined();
  });

  it('verifies mutual type assignability between User serializer and docs/entities/user/model.ts', async () => {
    // Compile-time assignability assertion
    type UserSerializerType = import('../../app/modules/auth/validators/auth.js').UserProfileDto;
    type UserEntityType = import('../../docs/entities/user/model.js').User;

    type AssertAssignable<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;
    const isAssignable: AssertAssignable<UserSerializerType, UserEntityType> = true;
    expect(isAssignable).toBe(true);
  });

  it('verifies mutual type assignability for all Stage 3 reference entities', async () => {
    type AssertAssignable<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;

    // CelestialBody
    type CBSerializer = import('../../app/modules/celestial_bodies/validators/celestial_body.js').CelestialBodyDto;
    type CBEntity = import('../../docs/entities/celestial-body/model.js').CelestialBody;
    const cbAssignable: AssertAssignable<CBSerializer, CBEntity> = true;
    expect(cbAssignable).toBe(true);

    // Location
    type LocSerializer = import('../../app/modules/locations/validators/location.js').LocationDto;
    type LocEntity = import('../../docs/entities/location/model.js').Location;
    const locAssignable: AssertAssignable<LocSerializer, LocEntity> = true;
    expect(locAssignable).toBe(true);

    // Source
    type SourceSerializer = import('../../app/modules/sources/validators/source.js').SourceDto;
    type SourceEntity = import('../../docs/entities/source/model.js').Source;
    const sourceAssignable: AssertAssignable<SourceSerializer, SourceEntity> = true;
    expect(sourceAssignable).toBe(true);
  });

  it('verifies mutual type assignability for all Stage 4 core domain entities', async () => {
    type AssertAssignable<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;

    // Mission
    type MissionSerializer = import('../../app/modules/missions/validators/mission.js').MissionDto;
    type MissionEntity = import('../../docs/entities/mission/model.js').Mission;
    const missionAssignable: AssertAssignable<MissionSerializer, MissionEntity> = true;
    expect(missionAssignable).toBe(true);

    // Equipment
    type EquipmentSerializer = import('../../app/modules/equipment/validators/equipment.js').EquipmentDto;
    type EquipmentEntity = import('../../docs/entities/equipment/model.js').Equipment;
    const equipAssignable: AssertAssignable<EquipmentSerializer, EquipmentEntity> = true;
    expect(equipAssignable).toBe(true);

    // Event
    type EventSerializer = import('../../app/modules/events/validators/event.js').EventDto;
    type EventEntity = import('../../docs/entities/event/model.js').Event;
    const eventAssignable: AssertAssignable<EventSerializer, EventEntity> = true;
    expect(eventAssignable).toBe(true);
  });

  it('verifies mutual type assignability for all Stage 5 editorial entities', async () => {
    type AssertAssignable<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;

    // Story
    type StorySerializer = import('../../app/modules/stories/validators/story.js').StoryDto;
    type StoryEntity = import('../../docs/entities/story/model.js').Story;
    const storyAssignable: AssertAssignable<StorySerializer, StoryEntity> = true;
    expect(storyAssignable).toBe(true);
  });
});
