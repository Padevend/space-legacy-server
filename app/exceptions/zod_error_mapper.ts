import { ZodError } from 'zod';
import { AppException, type ValidationErrorDetail } from './app_exception.js';

export function mapZodError(error: ZodError, prefix = ''): AppException {
  const details: ValidationErrorDetail[] = error.issues.map((issue) => {
    const fullPath = prefix ? `${prefix}.${issue.path.join('.')}` : issue.path.join('.');

    return {
      path: fullPath || 'body',
      code: issue.code,
      message: issue.message,
    };
  });

  return AppException.validation(details);
}
