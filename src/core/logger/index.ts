import pino from 'pino';
import { loggerConfig } from '../../../config/logger.js';
import { appConfig } from '../../../config/app.js';

export const logger = pino({
  level: loggerConfig.level,
  redact: {
    paths: [...loggerConfig.redact],
    censor: '[REDACTED]',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport:
    loggerConfig.format === 'pretty' && !appConfig.isProduction
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

export type Logger = typeof logger;
