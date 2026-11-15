import { z } from 'zod';

export function isValidUrl(input: string, maxLen = 2048): boolean {
  if (!input || typeof input !== 'string' || input.length > maxLen) {
    return false;
  }

  try {
    const parsed = new URL(input);
    // Protocol must strictly be http: or https:
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    // Must not contain credentials
    if (parsed.username || parsed.password) {
      return false;
    }

    // Hostname must exist and not be empty
    if (!parsed.hostname || parsed.hostname.trim() === '') {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export const safeUrlSchema = (maxLen = 2048) =>
  z
    .string()
    .max(maxLen)
    .refine((val) => isValidUrl(val, maxLen), {
      message: 'Invalid URL. Must be an http or https URL without credentials, under 2048 characters.',
    });

export const optionalSafeUrlSchema = (maxLen = 2048) =>
  z
    .string()
    .nullable()
    .optional()
    .refine((val) => val === null || val === undefined || val === '' || isValidUrl(val, maxLen), {
      message: 'Invalid URL. Must be an http or https URL without credentials, under 2048 characters.',
    });
