import { serve } from '@hono/node-server';
import { createApp } from '../src/core/http/app.js';
import { registerGlobalMiddleware } from '../start/kernel.js';
import { registerRoutes } from '../start/routes.js';
import { appConfig } from '../config/app.js';
import { logger } from '../src/core/logger/index.js';
import { disconnectPrisma } from '../src/core/database/prisma.js';

export function createServer() {
  const app = createApp();

  // 1. Mount global 13-stage middleware kernel
  registerGlobalMiddleware(app);

  // 2. Mount API and health routes
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

  // Graceful shutdown handling
  let isShuttingDown = false;

  async function gracefulShutdown(signal: string) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    // Give in-flight requests 5 seconds to finish
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

// Direct execution
if (process.argv[1]?.endsWith('server.ts') || process.argv[1]?.endsWith('server.js')) {
  startServer();
}
