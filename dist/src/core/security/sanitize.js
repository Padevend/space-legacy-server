import sanitizeHtml from 'sanitize-html';
import { z } from 'zod';
export function sanitizePlainText(input) {
    if (!input || typeof input !== 'string')
        return '';
    // 1. Unicode NFC normalization
    const normalized = input.normalize('NFC');
    // 2. Strip control characters (except common whitespace \t, \n, \r)
    const noControlChars = normalized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    // 3. Strip all HTML tags
    const sanitized = sanitizeHtml(noControlChars, {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'discard',
    });
    // 4. Trim whitespace
    return sanitized.trim();
}
export function safeTextSchema(min = 1, max = 255) {
    return z
        .string()
        .transform((val) => sanitizePlainText(val))
        .pipe(z.string().min(min).max(max));
}
export function optionalSafeTextSchema(max = 2000) {
    return z
        .string()
        .nullable()
        .optional()
        .transform((val) => {
        if (val === null || val === undefined || val === '')
            return null;
        const cleaned = sanitizePlainText(val);
        return cleaned.length > 0 ? cleaned : null;
    })
        .pipe(z.string().max(max).nullable());
}
