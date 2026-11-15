import pino from 'pino';
import { loggerConfig } from '../../../config/logger.js';
import { appConfig } from '../../../config/app.js';
const options = {
    level: loggerConfig.level,
    redact: {
        paths: [...loggerConfig.redact],
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
