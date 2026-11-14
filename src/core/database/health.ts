import { Prisma } from '@prisma/client';
import { prisma } from './prisma.js';

export interface DatabaseHealthResult {
  isHealthy: boolean;
  latencyMs: number;
  error?: string;
}

export async function checkDatabaseHealth(): Promise<DatabaseHealthResult> {
  const start = performance.now();
  try {
    await prisma.$queryRaw(Prisma.sql`SELECT 1`);
    const latencyMs = Math.round(performance.now() - start);
    return { isHealthy: true, latencyMs };
  } catch (error) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      isHealthy: false,
      latencyMs,
      error: error instanceof Error ? error.message : 'Database ping failed',
    };
  }
}
