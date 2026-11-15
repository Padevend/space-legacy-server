import { z } from '@hono/zod-openapi';
export const personSchema = z
    .object({
    personId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    fullName: z.string().openapi({ example: 'Neil Armstrong' }),
    biography: z
        .string()
        .nullable()
        .openapi({ example: 'American astronaut and aeronautical engineer, first person to walk on the Moon.' }),
    affiliation: z.string().nullable().openapi({ example: 'NASA' }),
})
    .openapi('Person');
export const listPeopleQuerySchema = z
    .object({
    page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
    pageSize: z.coerce.number().int().min(1).max(100).default(20).openapi({ example: 20 }),
    search: z.string().optional().openapi({ example: 'Neil' }),
    affiliation: z.string().optional().openapi({ example: 'NASA' }),
    sort: z.enum(['fullName', 'affiliation']).default('fullName').openapi({ example: 'fullName' }),
    order: z.enum(['asc', 'desc']).default('asc').openapi({ example: 'asc' }),
})
    .openapi('ListPeopleQuery');
export const createPersonRequestSchema = z
    .object({
    fullName: z.string().min(1, 'Full name is required.').max(150).openapi({ example: 'Neil Armstrong' }),
    biography: z
        .string()
        .max(5000)
        .nullable()
        .optional()
        .openapi({ example: 'American astronaut and aeronautical engineer.' }),
    affiliation: z.string().max(100).nullable().optional().openapi({ example: 'NASA' }),
})
    .strict()
    .openapi('CreatePersonRequest');
export const updatePersonRequestSchema = z
    .object({
    fullName: z.string().min(1).max(150).optional().openapi({ example: 'Neil A. Armstrong' }),
    biography: z.string().max(5000).nullable().optional().openapi({ example: 'Updated biography.' }),
    affiliation: z.string().max(100).nullable().optional().openapi({ example: 'NASA / Purdue' }),
})
    .strict()
    .openapi('UpdatePersonRequest');
export const personIdParamSchema = z
    .object({
    id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
})
    .openapi('PersonIdParam');
