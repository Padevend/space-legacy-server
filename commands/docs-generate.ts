import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer } from '../bin/server.js';
import { routesListCommand } from './routes-list.js';

export async function docsGenerateCommand(): Promise<void> {
  const app = createServer();

  // 1. Generate OpenAPI JSON document
  const openApiDoc = app.getOpenAPIDocument({
    openapi: '3.1.0',
    info: {
      title: 'SPACE LEGACY API',
      version: '1.0.0',
      description: 'Educational API for NASA equipment abandoned in space (NASA Space Apps Challenge 2026).',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Local Development Server',
      },
    ],
  });

  const apiDir = resolve(process.cwd(), 'docs/api');
  mkdirSync(apiDir, { recursive: true });

  writeFileSync(resolve(apiDir, 'openapi.json'), JSON.stringify(openApiDoc, null, 2), 'utf-8');

  // eslint-disable-next-line no-console
  console.log('Successfully generated docs/api/openapi.json');

  // 2. Also refresh route map
  await routesListCommand();
}
