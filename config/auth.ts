import { env } from '../start/env.js';

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    issuer: 'space-legacy',
    audience: 'space-legacy-client',
    expiresInSeconds: 15 * 60, // 15 minutes
    algorithm: 'HS256',
  },
  refreshToken: {
    secret: env.REFRESH_TOKEN_SECRET,
    expiresInDays: 7,
    cookieName: 'space_legacy_refresh',
    cookiePath: '/api/v1/auth',
  },
  password: {
    minLength: 12,
    maxLength: 128,
  },
  argon2: {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  },
} as const;
