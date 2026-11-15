import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';

export function sanitizePlainText(input: string): string {
  if (!input || typeof input !== 'string') return '';

  const normalized = input.normalize('NFC');
  const noControlChars = normalized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  const sanitized = sanitizeHtml(noControlChars, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
  });

  return sanitized.trim();
}

export function safeTextSchema(min = 1, max = 255): z.ZodType<string> {
  return z
    .string()
    .transform((val) => sanitizePlainText(val))
    .pipe(z.string().min(min).max(max));
}

export function optionalSafeTextSchema(max = 2000): z.ZodType<string | null> {
  return z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null || val === undefined || val === '') return null;
      const cleaned = sanitizePlainText(val);
      return cleaned.length > 0 ? cleaned : null;
    })
    .pipe(z.string().max(max).nullable());
}
