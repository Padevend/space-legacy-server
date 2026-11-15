import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

function scanDirectory(dir: string, fileList: string[] = []): string[] {
  if (!dir) return fileList;
  try {
    const files = readdirSync(dir);
    for (const file of files) {
      const fullPath = join(dir, file);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        scanDirectory(fullPath, fileList);
      } else if (file.endsWith('.ts') || file.endsWith('.js')) {
        fileList.push(fullPath);
      }
    }
  } catch {
    // Directory might not exist yet
  }
  return fileList;
}

describe('Legacy Quarantine Isolation Test', () => {
  it('ensures no application file imports from legacy/', () => {
    const activeDirs = [
      resolve(process.cwd(), 'app'),
      resolve(process.cwd(), 'src'),
      resolve(process.cwd(), 'start'),
      resolve(process.cwd(), 'config'),
      resolve(process.cwd(), 'bin'),
      resolve(process.cwd(), 'commands'),
      resolve(process.cwd(), 'providers'),
    ];

    const violations: { file: string; line: string }[] = [];

    for (const dir of activeDirs) {
      const files = scanDirectory(dir);
      for (const file of files) {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        for (const line of lines) {
          if (
            (line.includes('import ') || line.includes('require(')) &&
            (line.includes('/legacy/') || line.includes('../legacy') || line.includes('#legacy'))
          ) {
            violations.push({ file, line: line.trim() });
          }
        }
      }
    }

    expect(
      violations,
      `Detected active application files importing quarantined legacy code:\n${JSON.stringify(violations, null, 2)}`
    ).toEqual([]);
  });
});
