import { env } from '../start/env.js';

export const securityConfig = {
  requestTimeoutMs: env.REQUEST_TIMEOUT_MS,
  bodyLimitBytes: env.BODY_LIMIT_BYTES,
  ingestionBodyLimitBytes: 15 * 1024 * 1024, // 15MB for bulk bundles
  trustedProxies: env.TRUSTED_PROXIES.split(',')
    .map((p) => p.trim())
    .filter(Boolean),
  csrf: {
    enabled: true,
    customHeader: 'x-csrf-token',
  },
  headers: {
    contentSecurityPolicy: "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    xContentTypeOptions: 'nosniff',
    referrerPolicy: 'no-referrer',
    permissionsPolicy:
      'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
    crossOriginResourcePolicy: 'cross-origin', // Allows frontend app on other origin to read public resources
    strictTransportSecurity: env.NODE_ENV === 'production' ? 'max-age=31536000; includeSubDomains; preload' : undefined,
  },
} as const;
