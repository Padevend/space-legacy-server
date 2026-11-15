import { AppException } from '../exceptions/AppException.js';
import { securityConfig } from '../../../config/security.js';
export const timeoutMiddleware = (timeoutMs = securityConfig.requestTimeoutMs) => {
    return async (c, next) => {
        let timer;
        const timeoutPromise = new Promise((_, reject) => {
            timer = setTimeout(() => {
                reject(AppException.timeout(`Request processing timed out after ${timeoutMs}ms.`));
            }, timeoutMs);
        });
        try {
            await Promise.race([next(), timeoutPromise]);
        }
        finally {
            if (timer)
                clearTimeout(timer);
        }
    };
};
