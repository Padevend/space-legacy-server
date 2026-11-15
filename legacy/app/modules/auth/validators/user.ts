import { z } from 'zod';
import { UserRoleEnum } from './auth.js';

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  role: UserRoleEnum.optional(),
  isActive: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  sort: z.enum(['email', 'role', 'createdAt', 'lastLoginAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type ListUsersQueryDto = z.infer<typeof listUsersQuerySchema>;

export const createUserRequestSchema = z
  .object({
    email: z.string().email(),
    role: UserRoleEnum.default('EDITOR'),
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters long.')
      .max(128, 'Password must not exceed 128 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.'),
  })
  .strict();

export type CreateUserRequestDto = z.infer<typeof createUserRequestSchema>;

export const updateUserRequestSchema = z
  .object({
    email: z.string().email().optional(),
    role: UserRoleEnum.optional(),
    isActive: z.boolean().optional(),
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters long.')
      .max(128, 'Password must not exceed 128 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.')
      .optional(),
  })
  .strict();

export type UpdateUserRequestDto = z.infer<typeof updateUserRequestSchema>;
