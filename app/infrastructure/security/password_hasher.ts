import { hash, verify } from '@node-rs/argon2';
import { authConfig } from '#config/auth';
import { AppException } from '#exceptions/app_exception';

export function validatePasswordStrength(password: string): void {
  if (typeof password !== 'string') {
    throw AppException.validation([{ path: 'password', code: 'invalid_type', message: 'Password must be a string.' }]);
  }

  if (password.length < authConfig.password.minLength) {
    throw AppException.validation([
      {
        path: 'password',
        code: 'too_short',
        message: `Password must be at least ${authConfig.password.minLength} characters long.`,
      },
    ]);
  }

  if (password.length > authConfig.password.maxLength) {
    throw AppException.validation([
      {
        path: 'password',
        code: 'too_long',
        message: `Password must not exceed ${authConfig.password.maxLength} characters.`,
      },
    ]);
  }
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    memoryCost: authConfig.argon2.memoryCost,
    timeCost: authConfig.argon2.timeCost,
    outputLen: 32,
    parallelism: authConfig.argon2.parallelism,
  });
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  try {
    return await verify(passwordHash, password);
  } catch {
    return false;
  }
}
