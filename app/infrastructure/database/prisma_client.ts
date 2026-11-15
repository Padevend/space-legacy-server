import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { databaseConfig } from '#config/database';
import { logger } from '#infrastructure/logger/logger';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __pgPool: pg.Pool | undefined;
}

export function createPgPool(): pg.Pool {
  const isNeonOrSsl =
    databaseConfig.url.includes('sslmode=require') ||
    databaseConfig.url.includes('sslmode=verify-full') ||
    databaseConfig.url.includes('neon.tech') ||
    databaseConfig.url.includes('pooler.supabase.com') ||
    !!databaseConfig.caString;

  let ssl: pg.PoolConfig['ssl'] = undefined;

  if (databaseConfig.caString) {
    const rawCa = databaseConfig.caString;
    const formattedCa = rawCa.includes('\\n') ? rawCa.replace(/\\n/g, '\n') : rawCa;
    ssl = {
      ca: formattedCa,
      rejectUnauthorized: false,
    };
  } else if (isNeonOrSsl) {
    ssl = {
      rejectUnauthorized: false,
    };
  }

  const pool = new pg.Pool({
    connectionString: databaseConfig.url,
    max: databaseConfig.maxConnections,
    idleTimeoutMillis: databaseConfig.idleTimeoutMs,
    connectionTimeoutMillis: databaseConfig.connectionTimeoutMs,
    ssl,
  });

  pool.on('error', (err) => {
    logger.error({ err }, 'Unexpected error on idle pg client');
  });

  return pool;
}

export function createPrismaClient(): PrismaClient {
  const pool = globalThis.__pgPool ?? createPgPool();
  if (process.env['NODE_ENV'] !== 'production') {
    globalThis.__pgPool = pool;
  }

  const adapter = new PrismaPg(pool as any);
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
    if (globalThis.__pgPool) {
      await globalThis.__pgPool.end();
      globalThis.__pgPool = undefined;
    }
    logger.info('Prisma disconnected successfully.');
  } catch (error) {
    logger.error({ err: error }, 'Error disconnecting Prisma.');
  }
}
