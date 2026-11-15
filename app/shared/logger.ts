import pino from 'pino';
import { config } from './config.js';

const options: pino.LoggerOptions = {
  level: config.NODE_ENV === 'test' ? 'silent' : 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["x-session-token"]',
      'res.headers["set-cookie"]',
      'password',
      'passwordHash',
      'token',
      'tokenHash',
      'secret',
      'key',
      'apiKey',
      '*.password',
      '*.passwordHash',
      '*.token',
      '*.tokenHash',
    ],
    censor: '[REDACTED]',
  },
};

if (config.NODE_ENV === 'development') {
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
    },
  };
}

export const logger = pino(options);
