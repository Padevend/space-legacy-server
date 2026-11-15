export const ERROR_CODES = {
  BAD_REQUEST: { code: 'BAD_REQUEST', status: 400, defaultMessage: 'Malformed request payload or syntax.' },
  UNAUTHENTICATED: { code: 'UNAUTHENTICATED', status: 401, defaultMessage: 'Missing, invalid or expired credentials.' },
  FORBIDDEN: { code: 'FORBIDDEN', status: 403, defaultMessage: 'Access denied.' },
  NOT_FOUND: { code: 'NOT_FOUND', status: 404, defaultMessage: 'Resource not found.' },
  METHOD_NOT_ALLOWED: { code: 'METHOD_NOT_ALLOWED', status: 405, defaultMessage: 'Method not allowed for this route.' },
  TIMEOUT: { code: 'TIMEOUT', status: 408, defaultMessage: 'Request timed out.' },
  CONFLICT: { code: 'CONFLICT', status: 409, defaultMessage: 'Resource state or uniqueness conflict.' },
  PAYLOAD_TOO_LARGE: {
    code: 'PAYLOAD_TOO_LARGE',
    status: 413,
    defaultMessage: 'Request payload exceeded maximum size limit.',
  },
  UNSUPPORTED_MEDIA_TYPE: {
    code: 'UNSUPPORTED_MEDIA_TYPE',
    status: 415,
    defaultMessage: 'Unsupported Content-Type header.',
  },
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', status: 422, defaultMessage: 'Request validation failed.' },
  ACCOUNT_LOCKED: {
    code: 'ACCOUNT_LOCKED',
    status: 423,
    defaultMessage: 'Account temporarily locked due to repeated failed logins.',
  },
  TOO_MANY_REQUESTS: {
    code: 'TOO_MANY_REQUESTS',
    status: 429,
    defaultMessage: 'Rate limit exceeded. Please retry later.',
  },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: 500, defaultMessage: 'An internal server error occurred.' },
  SERVICE_UNAVAILABLE: { code: 'SERVICE_UNAVAILABLE', status: 503, defaultMessage: 'Service temporarily unavailable.' },
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
export type HttpStatus = (typeof ERROR_CODES)[ErrorCode]['status'];
