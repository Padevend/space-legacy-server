import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer } from '../bin/server.js';

export interface RouteEntry {
  method: string;
  path: string;
  module: string;
  auth: 'public' | 'user';
  role?: string | undefined;
  rateLimitTier: string;
  summary: string;
}

export async function routesListCommand(): Promise<void> {
  const app = createServer();
  const routes = app.routes;

  const entries: RouteEntry[] = [];

  for (const r of routes) {
    // Filter out global middleware registrations
    if (r.method === 'ALL') continue;

    // Determine module
    const parts = r.path.split('/').filter(Boolean);
    const mod = parts[2] || parts[1] || parts[0] || 'core';
    const isPublic =
      !r.path.includes('/admin') && !r.path.includes('/auth/me') && !r.path.includes('/auth/change-password');

    entries.push({
      method: r.method,
      path: r.path,
      module: mod,
      auth: isPublic ? 'public' : 'user',
      role:
        r.path.includes('/admin/users') || r.path.includes('/admin/audit-logs')
          ? 'ADMIN'
          : isPublic
            ? undefined
            : 'EDITOR',
      rateLimitTier: r.path.includes('/auth/login') ? 'login' : isPublic ? 'publicRead' : 'admin',
      summary: `${r.method} ${r.path}`,
    });
  }

  // Deduplicate entries by method and path
  const uniqueEntries = Array.from(new Map(entries.map((e) => [`${e.method}:${e.path}`, e])).values()).sort(
    (a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method)
  );

  // Write JSON
  const apiDir = resolve(process.cwd(), 'docs/api');
  mkdirSync(apiDir, { recursive: true });

  writeFileSync(resolve(apiDir, 'routes-map.json'), JSON.stringify(uniqueEntries, null, 2), 'utf-8');

  // Generate Markdown
  let md = `# SPACE LEGACY API Route Map\n\n`;
  md += `Auto-generated route registry of all active HTTP endpoints.\n\n`;
  md += `| Method | Path | Module | Auth | Role | Rate Limit | Summary |\n`;
  md += `|---|---|---|---|---|---|---|\n`;

  for (const e of uniqueEntries) {
    md += `| \`${e.method}\` | \`${e.path}\` | \`${e.module}\` | ${e.auth} | ${e.role ?? '-'} | ${e.rateLimitTier} | ${e.summary} |\n`;
  }

  writeFileSync(resolve(apiDir, 'routes-map.md'), md, 'utf-8');

  // eslint-disable-next-line no-console
  console.log(`Successfully generated docs/api/routes-map.md and routes-map.json (${uniqueEntries.length} routes)`);
}
