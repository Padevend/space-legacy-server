import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import router from '#infrastructure/http/router';
import { generateOpenApiFromRoutes } from '#infrastructure/http/openapi';
import { routesListCommand } from './routes_list.js';
import '#start/routes';

export async function docsGenerateCommand(): Promise<void> {
  const routes = router.getRoutes();
  const openApiDoc = generateOpenApiFromRoutes(routes);

  const apiDir = resolve(process.cwd(), 'docs/api');
  mkdirSync(apiDir, { recursive: true });

  writeFileSync(resolve(apiDir, 'openapi.json'), JSON.stringify(openApiDoc, null, 2), 'utf-8');

  // eslint-disable-next-line no-console
  console.log('Successfully generated docs/api/openapi.json');

  await routesListCommand();
}
