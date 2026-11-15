import { ZodError } from 'zod';
import { AppException } from './AppException.js';
export function mapZodError(error, prefix = '') {
    const details = error.issues.map((issue) => {
        const fullPath = prefix ? `${prefix}.${issue.path.join('.')}` : issue.path.join('.');
        return {
            path: fullPath || 'body',
            code: issue.code,
            message: issue.message,
        };
    });
    return AppException.validation(details);
}
