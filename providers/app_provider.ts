import { container } from '#infrastructure/container/container';
import { prisma } from '#infrastructure/database/prisma_client';
import { logger } from '#infrastructure/logger/logger';
import { rateLimiter } from '#infrastructure/rate_limit/limiter';

export class AppProvider {
  register(): void {
    container.singleton('database', () => prisma);
    container.singleton('prisma', () => prisma);
    container.singleton('logger', () => logger);
    container.singleton('rateLimiter', () => rateLimiter);
  }
}

export const appProvider = new AppProvider();
