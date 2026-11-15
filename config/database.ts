import { env } from '../start/env.js';

export const databaseConfig = {
  url: env.DATABASE_URL,
  caString: env.CA_STRING,
  maxConnections: env.NODE_ENV === 'production' ? 50 : 10,
  idleTimeoutMs: 30000,
  connectionTimeoutMs: 5000,
} as const;
