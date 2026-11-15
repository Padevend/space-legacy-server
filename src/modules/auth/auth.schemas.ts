import { z } from '@hono/zod-openapi';

export const UserRoleEnum = z.enum(['ADMIN', 'EDITOR']);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const userProfileSchema = z
  .object({
    userId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    email: z.string().email().openapi({ example: 'admin@spacelegacy.org' }),
    role: UserRoleEnum.openapi({ example: 'ADMIN' }),
    isActive: z.boolean().openapi({ example: true }),
    createdAt: z.string().datetime().openapi({ example: '2026-01-01T00:00:00.000Z' }),
    updatedAt: z.string().datetime().openapi({ example: '2026-01-01T00:00:00.000Z' }),
  })
  .openapi('UserProfile');

export type UserProfileDto = z.infer<typeof userProfileSchema>;

export const loginRequestSchema = z
  .object({
    email: z.string().email().openapi({ example: 'admin@spacelegacy.org' }),
    password: z.string().min(1).openapi({ example: 'SuperSecureSecretPassword123!' }),
  })
  .strict()
  .openapi('LoginRequest');

export type LoginRequestDto = z.infer<typeof loginRequestSchema>;

export const loginResponseDataSchema = z
  .object({
    user: userProfileSchema,
    accessToken: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    tokenType: z.literal('Bearer').openapi({ example: 'Bearer' }),
    expiresIn: z.number().int().positive().openapi({ example: 900 }),
  })
  .openapi('LoginResponseData');

export type LoginResponseDataDto = z.infer<typeof loginResponseDataSchema>;

export const refreshResponseDataSchema = z
  .object({
    accessToken: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    tokenType: z.literal('Bearer').openapi({ example: 'Bearer' }),
    expiresIn: z.number().int().positive().openapi({ example: 900 }),
  })
  .openapi('RefreshResponseData');

export type RefreshResponseDataDto = z.infer<typeof refreshResponseDataSchema>;

export const changePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1).openapi({ example: 'OldPassword123!' }),
    newPassword: z
      .string()
      .min(12, 'Password must be at least 12 characters long.')
      .max(128, 'Password must not exceed 128 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.')
      .openapi({ example: 'NewStrongPassword2026!#' }),
  })
  .strict()
  .openapi('ChangePasswordRequest');

export type ChangePasswordRequestDto = z.infer<typeof changePasswordRequestSchema>;
