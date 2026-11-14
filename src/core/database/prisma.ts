import { PrismaClient } from '@prisma/client';
import { logger } from '../logger/index.js';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: [
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
    ],
  });

  client.$on('warn' as never, (e: { message: string }) => {
    logger.warn({ prisma: true }, e.message);
  });

  client.$on('error' as never, (e: { message: string }) => {
    logger.error({ prisma: true }, e.message);
  });

  return client;
}

export const prisma: PrismaClient = globalThis.__prisma ?? createPrismaClient();

if (process.env['NODE_ENV'] !== 'production') {
  globalThis.__prisma = prisma;
}

export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('Prisma disconnected successfully.');
  } catch (error) {
    logger.error({ err: error }, 'Error disconnecting Prisma.');
  }
}
