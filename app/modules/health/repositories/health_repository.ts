import { Prisma } from '@prisma/client';
import { prisma } from '#infrastructure/database/prisma_client';

export interface DatabaseHealthResult {
  isHealthy: boolean;
  latencyMs: number;
  error?: string;
}

export class HealthRepository {
  async pingDatabase(): Promise<DatabaseHealthResult> {
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
}

export const healthRepository = new HealthRepository();
