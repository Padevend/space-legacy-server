import { z } from 'zod';
import { AppException } from '../exceptions/AppException.js';
export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export function parseSort(sortParam, allowedFields, defaultSort = 'createdAt:desc') {
    const raw = sortParam || defaultSort;
    const parts = raw
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
    const result = [];
    for (const part of parts) {
        let field = part;
        let order = 'asc';
        if (part.startsWith('-')) {
            field = part.substring(1);
            order = 'desc';
        }
        else if (part.includes(':')) {
            const [f, o] = part.split(':');
            field = f ?? '';
            order = o?.toLowerCase() === 'desc' ? 'desc' : 'asc';
        }
        if (!allowedFields.includes(field)) {
            throw AppException.validation([
                {
                    path: 'query.sort',
                    code: 'invalid_sort_field',
                    message: `Field '${field}' is not allowed for sorting. Allowed fields: ${allowedFields.join(', ')}`,
                },
            ]);
        }
        result.push({ field, order });
    }
    return result;
}
export function parseInclude(includeParam, allowedRelations, maxRelations = 3) {
    if (!includeParam)
        return [];
    const requested = includeParam
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean);
    if (requested.length > maxRelations) {
        throw AppException.validation([
            {
                path: 'query.include',
                code: 'too_many_includes',
                message: `Maximum of ${maxRelations} relations can be included at once.`,
            },
        ]);
    }
    for (const rel of requested) {
        if (!allowedRelations.includes(rel)) {
            throw AppException.validation([
                {
                    path: 'query.include',
                    code: 'invalid_include',
                    message: `Relation '${rel}' is not allowed for inclusion. Allowed relations: ${allowedRelations.join(', ')}`,
                },
            ]);
        }
    }
    return requested;
}
