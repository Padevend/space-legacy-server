import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { databaseConfig } from '../../../config/database.js';
import { logger } from '../logger/index.js';
export function createPrismaClient() {
    const adapter = new PrismaPg({ connectionString: databaseConfig.url });
    const client = new PrismaClient({
        adapter,
        log: [
            { level: 'warn', emit: 'event' },
            { level: 'error', emit: 'event' },
        ],
    });
    client.$on('warn', (e) => {
        logger.warn({ prisma: true }, e.message);
    });
    client.$on('error', (e) => {
        logger.error({ prisma: true }, e.message);
    });
    return client;
}
export const prisma = globalThis.__prisma ?? createPrismaClient();
if (process.env['NODE_ENV'] !== 'production') {
    globalThis.__prisma = prisma;
}
export async function disconnectPrisma() {
    try {
        await prisma.$disconnect();
        logger.info('Prisma disconnected successfully.');
    }
    catch (error) {
        logger.error({ err: error }, 'Error disconnecting Prisma.');
    }
}
