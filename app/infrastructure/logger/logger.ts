import pino from 'pino';
import { loggerConfig } from '#config/logger';
import { appConfig } from '#config/app';
import { defaultRedactPaths } from './redaction.js';

const options: pino.LoggerOptions = {
  level: loggerConfig.level,
  redact: {
    paths: [...new Set([...defaultRedactPaths, ...(loggerConfig.redact || [])])],
    censor: '[REDACTED]',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

if (loggerConfig.format === 'pretty' && !appConfig.isProduction) {
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  };
}

export const logger = pino(options);
export type Logger = typeof logger;
