import crypto from 'node:crypto';

const ANONYMOUS_SESSION_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days
const ACCOUNT_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Generate a cryptographically secure 32-byte opaque session token as a 64-character hex string.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Compute SHA-256 hash of a session token for storage.
 */
export function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
}

/**
 * Returns sliding expiry date for an anonymous session (90 days from now).
 */
export function getAnonymousSessionExpiry(): Date {
  return new Date(Date.now() + ANONYMOUS_SESSION_TTL_MS);
}

/**
 * Returns sliding expiry date for an authenticated account session (30 days from now).
 */
export function getAccountSessionExpiry(): Date {
  return new Date(Date.now() + ACCOUNT_SESSION_TTL_MS);
}
