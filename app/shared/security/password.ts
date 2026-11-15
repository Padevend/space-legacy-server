import argon2 from '@node-rs/argon2';
import { ValidationError } from '../errors.js';

export const MIN_PASSWORD_LENGTH = 10;

/**
 * Validates password rules: minimum 10 characters (Section 7).
 */
export function validatePassword(password: string): void {
  if (!password || typeof password !== 'string') {
    throw new ValidationError('Password is required', [{ field: 'password', message: 'Password is required' }]);
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`, [
      { field: 'password', message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` },
    ]);
  }
}

/**
 * Hash password with Argon2id using safe default parameters.
 */
export async function hashPassword(password: string): Promise<string> {
  validatePassword(password);
  return argon2.hash(password, {
    algorithm: argon2.Algorithm.Argon2id,
  });
}

/**
 * Verify password against Argon2id hash.
 */
export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  if (!hash || !plain) return false;
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false;
  }
}
