import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Module Ownership Matrix & Repository Purity (Section 2.4 & 2.10)', () => {
  const schemaPath = path.resolve(process.cwd(), 'prisma/schema.prisma');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');

  // Expected model-to-module mapping for active modules
  const expectedOwnership: Record<string, string> = {
    Mission: 'missions',
    Equipment: 'equipment',
    Event: 'events',
    CelestialBody: 'celestial_bodies',
    Location: 'locations',
    Source: 'sources',
    Story: 'stories',
    MissionEquipment: 'missions',
    MissionSource: 'sources',
    EventEquipment: 'events',
    EquipmentLocation: 'locations',
    EquipmentSource: 'sources',
    EventLocation: 'events',
    EventSource: 'sources',
    StoryMission: 'stories',
    StoryEquipment: 'stories',
    StoryEvent: 'stories',
    StorySource: 'stories',
    User: 'auth',
    RefreshToken: 'auth',
    IngestionRun: 'ingestion',
  };

  it('verifies that every Prisma model has an owner marker matching the ownership matrix', () => {
    const modelMatches = [
      ...schemaContent.matchAll(/(?:\/\/\s*module:\s*([a-z_]+)\s*\n)?model\s+([A-Za-z0-9_]+)\s*\{/g),
    ];
    expect(modelMatches.length).toBeGreaterThan(0);

    for (const match of modelMatches) {
      const moduleMarker = match[1];
      const modelName = match[2];

      expect(moduleMarker, `Model ${modelName} is missing a '// module: <name>' marker in schema.prisma`).toBeDefined();
      if (!modelName || !moduleMarker) continue;
      expect(
        expectedOwnership[modelName],
        `Model ${modelName} has no registered owner in docs/architecture/module-ownership.md`
      ).toBeDefined();
      expect(
        moduleMarker,
        `Model ${modelName} marker (${moduleMarker}) does not match expected owner (${expectedOwnership[modelName]})`
      ).toBe(expectedOwnership[modelName]);
    }
  });

  it('verifies that all repositories touch only their owned model delegates', () => {
    const modulesDir = path.resolve(process.cwd(), 'app/modules');
    if (!fs.existsSync(modulesDir)) return;

    // Model name to Prisma delegate name mapping (e.g. CelestialBody -> celestialBody)
    const modelToDelegate = (model: string) => model.charAt(0).toLowerCase() + model.slice(1);

    const moduleEntries = fs.readdirSync(modulesDir, { withFileTypes: true });
    for (const entry of moduleEntries) {
      if (!entry.isDirectory()) continue;
      const moduleName = entry.name;
      const repoDir = path.join(modulesDir, moduleName, 'repositories');
      if (!fs.existsSync(repoDir)) continue;

      // Read-only query modules (catalog, dashboard) have no owned tables and are exempt
      if (moduleName === 'catalog' || moduleName === 'dashboard') continue;

      // Ingestion module does bulk upserts across tables in dependency order per ADR / spec 2.4
      if (moduleName === 'ingestion') continue;

      const ownedModels = Object.entries(expectedOwnership)
        .filter(([_, mod]) => mod === moduleName)
        .map(([model, _]) => modelToDelegate(model));

      const repoFiles = fs.readdirSync(repoDir).filter((f) => f.endsWith('.ts'));
      for (const file of repoFiles) {
        const filePath = path.join(repoDir, file);
        const code = fs.readFileSync(filePath, 'utf8');

        // Match patterns like prisma.<delegate> or tx.<delegate> or this.client.<delegate>
        const delegateMatches = [
          ...code.matchAll(
            /(?:prisma|tx|client)\.([a-zA-Z0-9_]+)\.(?:find|create|update|delete|count|upsert|aggregate|groupBy)/g
          ),
        ];
        for (const match of delegateMatches) {
          const delegate = match[1];
          // Skip $queryRaw or internal prisma methods
          if (!delegate || delegate.startsWith('$')) continue;

          expect(
            ownedModels.includes(delegate),
            `Repository ${file} in module '${moduleName}' touches foreign delegate '${delegate}'. Owned models are: [${ownedModels.join(', ')}]`
          ).toBe(true);
        }
      }
    }
  });
});
