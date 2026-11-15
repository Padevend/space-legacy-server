import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { appProvider } from '../providers/app_provider.js';
import { modulesProvider } from '../providers/modules_provider.js';
import { registerGlobalMiddleware } from '#start/kernel';
import { registerRoutes } from '#start/routes';
import { exceptionHandler } from '#exceptions/handler';
import { appConfig } from '#config/app';
import { logger } from '#infrastructure/logger/logger';
import { disconnectPrisma } from '#infrastructure/database/prisma_client';

export function createServer(): Hono {
  // 1. Register providers
  appProvider.register();
  modulesProvider.register();

  // 2. Initialize Hono application with centralized exception handling
  const app = new Hono();

  app.onError((err, c) => exceptionHandler.handle(err, c));
  app.notFound((c) => exceptionHandler.notFound(c));

  // 3. Mount global 13-stage middleware kernel
  registerGlobalMiddleware(app);

  // 4. Mount all module routes
  registerRoutes(app);

  return app;
}

export function startServer() {
  const app = createServer();

  logger.info(`Starting ${appConfig.name} on ${appConfig.host}:${appConfig.port} (${appConfig.env})...`);

  const server = serve(
    {
      fetch: app.fetch,
      port: appConfig.port,
      hostname: appConfig.host,
    },
    (info) => {
      logger.info(`Server listening on http://${info.address}:${info.port}`);
    }
  );

  let isShuttingDown = false;

  async function gracefulShutdown(signal: string) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    const shutdownTimer = setTimeout(() => {
      logger.error('Forced shutdown due to timeout while draining requests.');
      process.exit(1);
    }, 10000);

    try {
      server.close();
      logger.info('HTTP server closed. Disconnecting database...');
      await disconnectPrisma();
      clearTimeout(shutdownTimer);
      logger.info('Graceful shutdown completed successfully.');
      process.exit(0);
    } catch (error) {
      clearTimeout(shutdownTimer);
      logger.error({ err: error }, 'Error during graceful shutdown.');
      process.exit(1);
    }
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  return server;
}

if (process.argv[1]?.endsWith('server.ts') || process.argv[1]?.endsWith('server.js')) {
  startServer();
}
