import { env } from '../start/env.js';
export const databaseConfig = {
    url: env.DATABASE_URL,
    maxConnections: env.NODE_ENV === 'production' ? 50 : 10,
    idleTimeoutMs: 30000,
    connectionTimeoutMs: 5000,
};
