import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Module Ownership Matrix & Repository Purity (Section 4 & 5)', () => {
  const schemaPath = path.resolve(process.cwd(), 'prisma/schema.prisma');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');

  // Expected model-to-module mapping for the 7 MVP modules
  const expectedOwnership: Record<string, string> = {
    Visitor: 'identity',
    Account: 'identity',
    Session: 'identity',
    CelestialBody: 'celestial_bodies',
    Machine: 'machines',
    MachineSource: 'machines',
    MachineFact: 'machines',
    MachineEvent: 'machines',
    MachineImage: 'machines',
    LogbookEntry: 'logbook',
    GenerationJob: 'generation',
    Quiz: 'games',
    QuizQuestion: 'games',
    QuizOption: 'games',
    QuizAttempt: 'games',
    QuizAnswer: 'games',
    Badge: 'games',
    VisitorBadge: 'games',
    IngestionBatch: 'ingestion',
  };

  it('verifies that every Prisma model has an owner marker matching the ownership matrix', () => {
    const modelMatches = [
      ...schemaContent.matchAll(/(?:\/\/\s*module:\s*([a-z_]+)\s*\n)?model\s+([A-Za-z0-9_]+)\s*\{/g),
    ];
    expect(modelMatches.length).toBe(19);

    for (const match of modelMatches) {
      const moduleMarker = match[1];
      const modelName = match[2];

      expect(moduleMarker, `Model ${modelName} is missing a '// module: <name>' marker in schema.prisma`).toBeDefined();
      if (!modelName || !moduleMarker) continue;
      expect(
        expectedOwnership[modelName],
        `Model ${modelName} has no registered owner in expectedOwnership`
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

    const modelToDelegate = (model: string) => model.charAt(0).toLowerCase() + model.slice(1);

    const moduleEntries = fs.readdirSync(modulesDir, { withFileTypes: true });
    for (const entry of moduleEntries) {
      if (!entry.isDirectory()) continue;
      const moduleName = entry.name;
      const repoDir = path.join(modulesDir, moduleName, 'repositories');
      if (!fs.existsSync(repoDir)) continue;

      if (moduleName === 'catalog' || moduleName === 'dashboard') continue;
      if (moduleName === 'ingestion') continue;

      const ownedModels = Object.entries(expectedOwnership)
        .filter(([_, mod]) => mod === moduleName)
        .map(([model, _]) => modelToDelegate(model));

      const repoFiles = fs.readdirSync(repoDir).filter((f) => f.endsWith('.ts'));
      for (const file of repoFiles) {
        const filePath = path.join(repoDir, file);
        const code = fs.readFileSync(filePath, 'utf8');

        const delegateMatches = [
          ...code.matchAll(
            /(?:prisma|tx|client)\.([a-zA-Z0-9_]+)\.(?:find|create|update|delete|count|upsert|aggregate|groupBy)/g
          ),
        ];
        for (const match of delegateMatches) {
          const delegate = match[1];
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
