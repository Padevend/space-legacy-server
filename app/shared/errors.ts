export interface AppErrorDetail {
  field?: string | undefined;
  message: string;
  code?: string | undefined;
}

export interface AppErrorResponse {
  error: {
    code: string;
    message: string;
    details: AppErrorDetail[];
  };
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details: AppErrorDetail[];

  constructor(message: string, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', details: AppErrorDetail[] = []) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON(): AppErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details: AppErrorDetail[] = [], code = 'BAD_REQUEST') {
    super(message, 400, code, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required', details: AppErrorDetail[] = [], code = 'UNAUTHORIZED') {
    super(message, 401, code, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access forbidden', details: AppErrorDetail[] = [], code = 'FORBIDDEN') {
    super(message, 403, code, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details: AppErrorDetail[] = [], code = 'NOT_FOUND') {
    super(message, 404, code, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', details: AppErrorDetail[] = [], code = 'CONFLICT') {
    super(message, 409, code, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details: AppErrorDetail[] = [], code = 'VALIDATION_ERROR') {
    super(message, 422, code, details);
  }
}

export class RateLimitExceededError extends AppError {
  constructor(
    message = 'Too many requests, please try again later',
    details: AppErrorDetail[] = [],
    code = 'RATE_LIMIT_EXCEEDED'
  ) {
    super(message, 429, code, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error', details: AppErrorDetail[] = [], code = 'INTERNAL_SERVER_ERROR') {
    super(message, 500, code, details);
  }
}

/**
 * Format any thrown error into a safe, uniform N12 error response.
 * Guarantees no stack trace, file path, or secret/internal data leaks.
 */
export function formatErrorResponse(err: unknown): { response: AppErrorResponse; status: number } {
  if (err instanceof AppError) {
    return {
      response: err.toJSON(),
      status: err.statusCode,
    };
  }

  // Handle Zod error if passed raw
  if (err && typeof err === 'object' && 'issues' in err && Array.isArray((err as any).issues)) {
    const issues = (err as any).issues;
    const details: AppErrorDetail[] = issues.map((i: any) => ({
      field: Array.isArray(i.path) ? i.path.join('.') : undefined,
      message: i.message,
      code: i.code,
    }));
    return {
      response: {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details,
        },
      },
      status: 422,
    };
  }

  // For unhandled generic errors: sanitize completely
  const isProduction = process.env['NODE_ENV'] === 'production';
  let message = 'Internal server error';

  if (!isProduction && err instanceof Error) {
    // In dev/test, use the error message only if it does not contain file paths or SQL keywords
    const raw = err.message;
    if (!raw.includes('/') && !raw.includes('\\') && !raw.toLowerCase().includes('select * from')) {
      message = raw;
    }
  }

  return {
    response: {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message,
        details: [],
      },
    },
    status: 500,
  };
}
