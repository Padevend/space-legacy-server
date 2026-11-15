import { config } from '../config.js';
import { ValidationError } from '../errors.js';

/**
 * Check if a hostname belongs to the allowed source hosts whitelist.
 * Matches exact hostname or any subdomain (e.g., science.nasa.gov matches nasa.gov).
 */
export function isAllowedHost(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase();
  for (const allowed of config.ALLOWED_SOURCE_HOSTS) {
    if (normalized === allowed || normalized.endsWith(`.${allowed}`)) {
      return true;
    }
  }
  return false;
}

/**
 * Validate that a URL string has an allowed hostname and http/https protocol.
 */
export function isAllowedSourceUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    return isAllowedHost(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * Assert that a source URL is allowed, throwing ValidationError otherwise.
 */
export function assertAllowedSourceUrl(urlStr: string, field = 'url'): void {
  if (!isAllowedSourceUrl(urlStr)) {
    throw new ValidationError(
      `Source URL domain is not allowed. Must belong to: ${config.ALLOWED_SOURCE_HOSTS.join(', ')}`,
      [
        {
          field,
          message: `URL host is not on the allowed list (${config.ALLOWED_SOURCE_HOSTS.join(', ')})`,
          code: 'UNSUPPORTED_SOURCE_HOST',
        },
      ]
    );
  }
}
