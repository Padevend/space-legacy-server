import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Module Isolation & Architecture Boundaries (Section 2.2, 2.4, 2.5, 2.10)', () => {
  const rootDir = process.cwd();
  const modulesDir = path.resolve(rootDir, 'app/modules');
  const infraDir = path.resolve(rootDir, 'app/infrastructure');
  const middlewareDir = path.resolve(rootDir, 'app/middleware');
  const contractsDir = path.resolve(rootDir, 'app/contracts');
  const sharedDir = path.resolve(rootDir, 'app/shared');
  const exceptionsDir = path.resolve(rootDir, 'app/exceptions');

  function getAllFiles(dir: string, ext = '.ts'): string[] {
    if (!fs.existsSync(dir)) return [];
    let files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(getAllFiles(fullPath, ext));
      } else if (entry.isFile() && entry.name.endsWith(ext)) {
        files.push(fullPath);
      }
    }
    return files;
  }

  function extractImports(filePath: string): string[] {
    const content = fs.readFileSync(filePath, 'utf8');
    // Match import ... from '...' or import('...')
    const importRegex = /(?:import\s+(?:[\s\S]*?from\s+)?['"]([^'"]+)['"])|(?:import\(['"]([^'"]+)['"]\))/g;
    const imports: string[] = [];
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const captured = match[1] ?? match[2];
      if (captured) imports.push(captured);
    }
    return imports;
  }

  it('ensures infrastructure, middleware, contracts, exceptions, and shared never import from app/modules', () => {
    const checkedDirs = [infraDir, middlewareDir, contractsDir, sharedDir, exceptionsDir];
    for (const dir of checkedDirs) {
      const files = getAllFiles(dir);
      for (const file of files) {
        const imports = extractImports(file);
        for (const imp of imports) {
          expect(
            !imp.includes('#modules') && !imp.includes('/modules/'),
            `File ${path.relative(rootDir, file)} must not import from modules, found: ${imp}`
          ).toBe(true);
        }
      }
    }
  });

  it('ensures zero cross-module imports and no #modules/* imports within app/modules/**', () => {
    if (!fs.existsSync(modulesDir)) return;
    const moduleNames = fs.readdirSync(modulesDir).filter((f) => fs.statSync(path.join(modulesDir, f)).isDirectory());

    for (const mod of moduleNames) {
      const modFiles = getAllFiles(path.join(modulesDir, mod));
      for (const file of modFiles) {
        const imports = extractImports(file);
        for (const imp of imports) {
          // No #modules alias inside app/modules
          expect(
            !imp.startsWith('#modules'),
            `Module file ${path.relative(rootDir, file)} must use relative imports inside its module, not #modules: ${imp}`
          ).toBe(true);

          // If relative import, ensure it does not navigate outside its own module directory
          if (imp.startsWith('.')) {
            const resolved = path.resolve(path.dirname(file), imp);
            const relativeToMod = path.relative(path.join(modulesDir, mod), resolved);
            expect(
              !relativeToMod.startsWith('..'),
              `Module '${mod}' imports from outside its boundary: ${path.relative(rootDir, file)} -> ${imp}`
            ).toBe(true);
          }
        }
      }
    }
  });

  it('ensures file suffixes match their role folders and snake_case naming', () => {
    if (!fs.existsSync(modulesDir)) return;
    const moduleNames = fs.readdirSync(modulesDir).filter((f) => fs.statSync(path.join(modulesDir, f)).isDirectory());

    const roleSuffixes: Record<string, RegExp> = {
      controllers: /_controller\.ts$/,
      repositories: /_repository\.ts$/,
      services: /_service\.ts$/,
      serializers: /_serializer\.ts$/,
      policies: /_policy\.ts$/,
      exceptions: /_exception\.ts$/,
      providers: /_provider\.ts$/,
      models: /^[a-z0-9_]+\.ts$/,
      validators: /^[a-z0-9_]+\.ts$/,
      routes: /^(index|public|admin)\.ts$/,
      middleware: /_middleware\.ts$/,
    };

    for (const mod of moduleNames) {
      const modPath = path.join(modulesDir, mod);
      const roles = fs.readdirSync(modPath).filter((f) => fs.statSync(path.join(modPath, f)).isDirectory());

      for (const role of roles) {
        const rolePath = path.join(modPath, role);
        const files = fs.readdirSync(rolePath).filter((f) => f.endsWith('.ts'));
        const regex = roleSuffixes[role];
        if (!regex) continue;

        for (const file of files) {
          expect(
            regex.test(file),
            `File '${file}' in 'app/modules/${mod}/${role}' does not match expected naming convention`
          ).toBe(true);
        }
      }
    }
  });

  it('ensures layer dependency directions and Prisma import restrictions inside modules', () => {
    if (!fs.existsSync(modulesDir)) return;
    const files = getAllFiles(modulesDir);

    for (const file of files) {
      const relPath = path.relative(modulesDir, file).replace(/\\/g, '/');
      const parts = relPath.split('/');
      if (parts.length < 3) continue;
      const role = parts[1];
      const imports = extractImports(file);

      // Only repositories may import PrismaClient or @prisma/client
      if (role !== 'repositories') {
        for (const imp of imports) {
          expect(
            !imp.includes('@prisma/client') && !imp.includes('prisma_client'),
            `Role '${role}' in ${relPath} must not import Prisma, found: ${imp}`
          ).toBe(true);
        }
      }

      // Services must not import Hono
      if (role === 'services') {
        for (const imp of imports) {
          expect(
            !imp.includes('hono'),
            `Service in ${relPath} must not import HTTP framework (hono), found: ${imp}`
          ).toBe(true);
        }
      }

      // Controllers must not import repositories
      if (role === 'controllers') {
        for (const imp of imports) {
          expect(
            !imp.includes('repositories') && !imp.includes('_repository'),
            `Controller in ${relPath} must not import repositories, found: ${imp}`
          ).toBe(true);
        }
      }
    }
  });
});
