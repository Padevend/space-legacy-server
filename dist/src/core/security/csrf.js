import { AppException } from '../exceptions/AppException.js';
import { corsConfig } from '../../../config/cors.js';
export const csrfGuardMiddleware = () => {
    return async (c, next) => {
        const method = c.req.method;
        // Only inspect state-changing requests (POST, PUT, PATCH, DELETE)
        if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
            await next();
            return;
        }
        const origin = c.req.header('origin');
        const referer = c.req.header('referer');
        // Extract origin candidate
        let sourceOrigin = null;
        if (origin) {
            sourceOrigin = origin;
        }
        else if (referer) {
            try {
                const parsedUrl = new URL(referer);
                sourceOrigin = parsedUrl.origin;
            }
            catch {
                // Invalid referer format
            }
        }
        // If source origin is present, verify against allow-list
        if (sourceOrigin && !corsConfig.origins.includes(sourceOrigin)) {
            throw AppException.forbidden('Disallowed origin. CSRF protection blocked the request.');
        }
        await next();
    };
};
export const strictCookieCsrfMiddleware = () => {
    return async (c, next) => {
        const method = c.req.method;
        if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
            await next();
            return;
        }
        const origin = c.req.header('origin');
        const customHeader = c.req.header('x-csrf-token');
        if (!origin || !corsConfig.origins.includes(origin)) {
            throw AppException.forbidden('Missing or invalid Origin header for sensitive session operation.');
        }
        if (!customHeader) {
            throw AppException.forbidden('Missing required X-CSRF-Token custom header.');
        }
        await next();
    };
};
