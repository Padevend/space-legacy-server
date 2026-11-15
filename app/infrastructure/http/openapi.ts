import type { RouteDefinition } from './router.js';

export interface OpenApiDoc {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  paths: Record<string, any>;
}

export function generateOpenApiFromRoutes(routes: readonly RouteDefinition[]): OpenApiDoc {
  const paths: Record<string, any> = {};

  for (const route of routes) {
    const formattedPath = route.path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
    if (!paths[formattedPath]) {
      paths[formattedPath] = {};
    }

    const methodLower = route.method.toLowerCase();
    const docMeta = route.docsMetadata || {};

    paths[formattedPath][methodLower] = {
      summary: docMeta.summary || `${route.method} ${route.path}`,
      description: docMeta.description || '',
      tags: docMeta.tags || [route.moduleName || 'Default'],
      operationId: route.name || `${methodLower}_${route.path.replace(/[^a-zA-Z0-9]/g, '_')}`,
      responses: docMeta.responses || {
        200: { description: 'Successful operation' },
      },
    };
  }

  return {
    openapi: '3.1.0',
    info: {
      title: 'SPACE LEGACY API',
      version: '1.0.0',
      description: 'Educational API for NASA legacy space equipment and historical artifacts.',
    },
    paths,
  };
}
