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

    for (const r of routerRoutes) {
      const match = content.find((entry) => entry.path === r.path && entry.method === r.method);
      expect(
        match,
        `Route ${r.method} ${r.path} is registered in Hono router but missing from routes-map.json. Run 'pnpm routes:list'.`
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
});
