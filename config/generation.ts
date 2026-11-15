import { env } from '../start/env.js';

export const generationConfig = {
  serviceUrl: env.PYTHON_SERVICE_URL,
  apiKey: env.PYTHON_SERVICE_API_KEY,
  timeoutMs: env.PYTHON_SERVICE_TIMEOUT_MS,
  retryCount: env.PYTHON_SERVICE_RETRY_COUNT,
  allowedResultHosts: env.PYTHON_ALLOWED_RESULT_HOSTS.split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean),
} as const;
