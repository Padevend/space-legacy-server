import { z } from 'zod';

export const UserRoleEnum = z.enum(['ADMIN', 'EDITOR']);
export type UserRole = z.infer<typeof UserRoleEnum>;

export const userProfileSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  role: UserRoleEnum,
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type UserProfileDto = z.infer<typeof userProfileSchema>;

export const loginRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .strict();

export type LoginRequestDto = z.infer<typeof loginRequestSchema>;

export const loginResponseDataSchema = z.object({
  user: userProfileSchema,
  accessToken: z.string(),
  tokenType: z.literal('Bearer'),
  expiresIn: z.number().int().positive(),
});

export type LoginResponseDataDto = z.infer<typeof loginResponseDataSchema>;

export const refreshRequestSchema = z
  .object({
    refreshToken: z.string().min(1).optional(),
  })
  .strict();

export type RefreshRequestDto = z.infer<typeof refreshRequestSchema>;

export const changePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(12, 'Password must be at least 12 characters long.')
      .max(128, 'Password must not exceed 128 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character.'),
  })
  .strict();

export type ChangePasswordRequestDto = z.infer<typeof changePasswordRequestSchema>;
