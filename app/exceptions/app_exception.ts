import { ERROR_CODES, type ErrorCode, type HttpStatus } from './error_codes.js';

export interface ValidationErrorDetail {
  path: string;
  code: string;
  message: string;
}

export interface AppExceptionOptions {
  code: ErrorCode;
  message?: string | undefined;
  status?: HttpStatus | undefined;
  details?: ValidationErrorDetail[] | undefined;
  retryAfterSeconds?: number | undefined;
  expose?: boolean | undefined;
  cause?: unknown;
}

export class AppException extends Error {
  public readonly code: ErrorCode;
  public readonly status: HttpStatus;
  public readonly details?: ValidationErrorDetail[] | undefined;
  public readonly retryAfterSeconds?: number | undefined;
  public readonly expose: boolean;

  constructor(options: AppExceptionOptions) {
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

  static badRequest(message?: string, details?: ValidationErrorDetail[]): AppException {
    return new AppException({ code: 'BAD_REQUEST', message, details });
  }

  static unauthenticated(message?: string): AppException {
    return new AppException({ code: 'UNAUTHENTICATED', message });
  }

  static forbidden(message?: string): AppException {
    return new AppException({ code: 'FORBIDDEN', message });
  }

  static notFound(resource = 'Resource', message?: string): AppException {
    return new AppException({ code: 'NOT_FOUND', message: message ?? `${resource} not found.` });
  }

  static methodNotAllowed(message?: string): AppException {
    return new AppException({ code: 'METHOD_NOT_ALLOWED', message });
  }

  static timeout(message?: string): AppException {
    return new AppException({ code: 'TIMEOUT', message });
  }

  static conflict(message?: string, details?: ValidationErrorDetail[]): AppException {
    return new AppException({ code: 'CONFLICT', message, details });
  }

  static payloadTooLarge(message?: string): AppException {
    return new AppException({ code: 'PAYLOAD_TOO_LARGE', message });
  }

  static unsupportedMediaType(message?: string): AppException {
    return new AppException({ code: 'UNSUPPORTED_MEDIA_TYPE', message });
  }

  static validation(details: ValidationErrorDetail[], message = 'Request validation failed.'): AppException {
    return new AppException({ code: 'VALIDATION_ERROR', message, details });
  }

  static unprocessable(message = 'Unprocessable entity.', details?: ValidationErrorDetail[]): AppException {
    return new AppException({ code: 'VALIDATION_ERROR', message, details });
  }

  static accountLocked(message?: string): AppException {
    return new AppException({ code: 'ACCOUNT_LOCKED', message });
  }

  static tooManyRequests(retryAfterSeconds = 60, message?: string): AppException {
    return new AppException({ code: 'TOO_MANY_REQUESTS', retryAfterSeconds, message });
  }

  static internal(message?: string, cause?: unknown): AppException {
    return new AppException({ code: 'INTERNAL_ERROR', message, cause, expose: false });
  }

  static serviceUnavailable(message?: string): AppException {
    return new AppException({ code: 'SERVICE_UNAVAILABLE', message, expose: false });
  }
}
