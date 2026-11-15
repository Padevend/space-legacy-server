import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import router from '#infrastructure/http/router';
import '#start/routes';

export interface RouteEntry {
  method: string;
  path: string;
  module: string;
  name?: string | undefined;
  auth: 'public' | 'user';
  role?: string | undefined;
  rateLimitTier: string;
  summary: string;
}

export async function routesListCommand(): Promise<void> {
  const routes = router.getRoutes();
  const entries: RouteEntry[] = [];

  for (const r of routes) {
    const isPublic =
      !r.path.includes('/admin') && !r.path.includes('/auth/me') && !r.path.includes('/auth/change-password');
    const mod = r.moduleName || 'core';

    entries.push({
      method: r.method,
      path: r.path,
      module: mod,
      name: r.name,
      auth: isPublic ? 'public' : 'user',
      role:
        r.path.includes('/admin/users') || r.path.includes('/admin/audit-logs')
          ? 'ADMIN'
          : isPublic
            ? undefined
            : 'EDITOR',
      rateLimitTier: r.path.includes('/auth/login') ? 'login' : isPublic ? 'publicRead' : 'admin',
      summary: r.docsMetadata?.summary || `${r.method} ${r.path}`,
    });
  }

  const uniqueEntries = Array.from(new Map(entries.map((e) => [`${e.method}:${e.path}`, e])).values()).sort(
    (a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method)
  );

  const apiDir = resolve(process.cwd(), 'docs/api');
  mkdirSync(apiDir, { recursive: true });

  writeFileSync(resolve(apiDir, 'routes-map.json'), JSON.stringify(uniqueEntries, null, 2), 'utf-8');

  let md = `# SPACE LEGACY API Route Map\n\n`;
  md += `Auto-generated route registry of all active HTTP endpoints.\n\n`;
  md += `| Method | Path | Module | Name | Auth | Role | Rate Limit | Summary |\n`;
  md += `|---|---|---|---|---|---|---|---|\n`;

  for (const e of uniqueEntries) {
    md += `| \`${e.method}\` | \`${e.path}\` | \`${e.module}\` | \`${e.name ?? '-'}\` | ${e.auth} | ${e.role ?? '-'} | ${e.rateLimitTier} | ${e.summary} |\n`;
  }

  writeFileSync(resolve(apiDir, 'routes-map.md'), md, 'utf-8');

  // eslint-disable-next-line no-console
  console.log(`Successfully generated docs/api/routes-map.md and routes-map.json (${uniqueEntries.length} routes)`);
}
