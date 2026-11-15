import { ERROR_CODES } from './error-codes.js';
export class AppException extends Error {
    code;
    status;
    details;
    retryAfterSeconds;
    expose;
    constructor(options) {
        const errorMeta = ERROR_CODES[options.code];
        const message = options.message ?? errorMeta.defaultMessage;
        super(message, { cause: options.cause });
        this.name = 'AppException';
        this.code = options.code;
        this.status = options.status ?? errorMeta.status;
        if (options.details !== undefined) {
            this.details = options.details;
        }
        if (options.retryAfterSeconds !== undefined) {
            this.retryAfterSeconds = options.retryAfterSeconds;
        }
        this.expose = options.expose ?? this.status < 500;
    }
    static badRequest(message, details) {
        return new AppException({ code: 'BAD_REQUEST', message, details });
    }
    static unauthenticated(message) {
        return new AppException({ code: 'UNAUTHENTICATED', message });
    }
    static forbidden(message) {
        return new AppException({ code: 'FORBIDDEN', message });
    }
    static notFound(resource = 'Resource', message) {
        return new AppException({ code: 'NOT_FOUND', message: message ?? `${resource} not found.` });
    }
    static methodNotAllowed(message) {
        return new AppException({ code: 'METHOD_NOT_ALLOWED', message });
    }
    static timeout(message) {
        return new AppException({ code: 'TIMEOUT', message });
    }
    static conflict(message, details) {
        return new AppException({ code: 'CONFLICT', message, details });
    }
    static payloadTooLarge(message) {
        return new AppException({ code: 'PAYLOAD_TOO_LARGE', message });
    }
    static unsupportedMediaType(message) {
        return new AppException({ code: 'UNSUPPORTED_MEDIA_TYPE', message });
    }
    static validation(details, message = 'Request validation failed.') {
        return new AppException({ code: 'VALIDATION_ERROR', message, details });
    }
    static unprocessable(message = 'Unprocessable entity.', details) {
        return new AppException({ code: 'VALIDATION_ERROR', message, details });
    }
    static accountLocked(message) {
        return new AppException({ code: 'ACCOUNT_LOCKED', message });
    }
    static tooManyRequests(retryAfterSeconds = 60, message) {
        return new AppException({ code: 'TOO_MANY_REQUESTS', retryAfterSeconds, message });
    }
    static internal(message, cause) {
        return new AppException({ code: 'INTERNAL_ERROR', message, cause, expose: false });
    }
    static serviceUnavailable(message) {
        return new AppException({ code: 'SERVICE_UNAVAILABLE', message, expose: false });
    }
}
