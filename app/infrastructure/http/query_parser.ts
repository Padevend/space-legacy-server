import { z } from 'zod';
import { AppException } from '#exceptions/app_exception';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export interface ParsedSortOrder {
  field: string;
  order: 'asc' | 'desc';
}

export function parseSort(
  sortParam: string | undefined,
  allowedFields: readonly string[],
  defaultSort = 'createdAt:desc'
): ParsedSortOrder[] {
  const raw = sortParam || defaultSort;
  const parts = raw
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  const result: ParsedSortOrder[] = [];

  for (const part of parts) {
    let field = part;
    let order: 'asc' | 'desc' = 'asc';

    if (part.startsWith('-')) {
      field = part.substring(1);
      order = 'desc';
    } else if (part.includes(':')) {
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

export function parseInclude(
  includeParam: string | undefined,
  allowedRelations: readonly string[],
  maxRelations = 3
): string[] {
  if (!includeParam) return [];

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
