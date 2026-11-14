export const rateLimitConfig = {
  global: {
    windowMs: 60 * 1000,
    max: 600,
  },
  publicRead: {
    windowMs: 60 * 1000,
    max: 120,
  },
  publicSearch: {
    windowMs: 60 * 1000,
    max: 30,
  },
  loginAttempt: {
    windowMs: 15 * 60 * 1000,
    maxAccount: 5,
    maxIp: 30,
    lockoutDurationMinutes: 15,
  },
  refresh: {
    windowMs: 15 * 60 * 1000,
    max: 20,
  },
  admin: {
    windowMs: 60 * 1000,
    max: 120,
  },
  ingestion: {
    windowMs: 60 * 60 * 1000,
    max: 5,
  },
} as const;
