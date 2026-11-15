import { z } from 'zod';

export const personSchema = z.object({
  personId: z.string().uuid(),
  fullName: z.string(),
  biography: z.string().nullable(),
  affiliation: z.string().nullable(),
});

export type PersonDto = z.infer<typeof personSchema>;

export const listPeopleQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  affiliation: z.string().optional(),
  sort: z.enum(['fullName', 'affiliation']).default('fullName'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export type ListPeopleQueryDto = z.infer<typeof listPeopleQuerySchema>;

export const createPersonRequestSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required.').max(150),
    biography: z.string().max(5000).nullable().optional(),
    affiliation: z.string().max(100).nullable().optional(),
  })
  .strict();

export type CreatePersonRequestDto = z.infer<typeof createPersonRequestSchema>;

export const updatePersonRequestSchema = z
  .object({
    fullName: z.string().min(1).max(150).optional(),
    biography: z.string().max(5000).nullable().optional(),
    affiliation: z.string().max(100).nullable().optional(),
  })
  .strict();

export type UpdatePersonRequestDto = z.infer<typeof updatePersonRequestSchema>;

export const personIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type PersonIdParamDto = z.infer<typeof personIdParamSchema>;
