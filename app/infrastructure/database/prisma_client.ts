import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { databaseConfig } from '#config/database';
import { logger } from '#infrastructure/logger/logger';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: databaseConfig.url });
  const client = new PrismaClient({
    adapter,
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
export const prismaClient = prisma;
export type ExtendedPrismaClient = PrismaClient;

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
