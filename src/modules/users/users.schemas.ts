import { z } from '@hono/zod-openapi';
import { UserRoleEnum, userProfileSchema } from '../auth/auth.schemas.js';

export const listUsersQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1).openapi({ example: 1 }),
    pageSize: z.coerce.number().int().min(1).max(100).default(20).openapi({ example: 20 }),
    search: z.string().optional().openapi({ example: 'admin' }),
    role: UserRoleEnum.optional().openapi({ example: 'ADMIN' }),
    isActive: z
      .enum(['true', 'false'])
      .transform((val) => val === 'true')
      .optional()
      .openapi({ example: 'true' }),
    sort: z.enum(['email', 'role', 'createdAt', 'lastLoginAt']).default('createdAt').openapi({ example: 'createdAt' }),
    order: z.enum(['asc', 'desc']).default('desc').openapi({ example: 'desc' }),
  })
  .openapi('ListUsersQuery');

export type ListUsersQueryDto = z.infer<typeof listUsersQuerySchema>;

export const createUserRequestSchema = z
  .object({
    email: z.string().email().openapi({ example: 'neweditor@spacelegacy.org' }),
    role: UserRoleEnum.default('EDITOR').openapi({ example: 'EDITOR' }),
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters long.')
      .max(128, 'Password must not exceed 128 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.')
      .openapi({ example: 'ValidStrongPass123!#' }),
  })
  .strict()
  .openapi('CreateUserRequest');

export type CreateUserRequestDto = z.infer<typeof createUserRequestSchema>;

export const updateUserRequestSchema = z
  .object({
    role: UserRoleEnum.optional().openapi({ example: 'EDITOR' }),
    isActive: z.boolean().optional().openapi({ example: true }),
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters long.')
      .max(128, 'Password must not exceed 128 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.')
      .optional()
      .openapi({ example: 'NewValidStrongPass123!#' }),
  })
  .strict()
  .openapi('UpdateUserRequest');

export type UpdateUserRequestDto = z.infer<typeof updateUserRequestSchema>;

export const userIdParamSchema = z
  .object({
    id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  })
  .openapi('UserIdParam');

export type UserIdParamDto = z.infer<typeof userIdParamSchema>;

export { userProfileSchema };
