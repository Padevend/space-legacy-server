import { env } from '../start/env.js';

export const loggerConfig = {
  level: env.LOG_LEVEL,
  format: env.LOG_FORMAT,
  redact: [
    'req.headers.authorization',
    'req.headers.cookie',
    'res.headers["set-cookie"]',
    'password',
    'passwordHash',
    'token',
    'refreshToken',
    'secret',
    'creditCard',
    'tokenHash',
  ],
} as const;
