import { z } from 'zod';
import dotenv from 'dotenv';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Load .env if present
dotenv.config();

// Helper to support Docker secrets (*_FILE convention)
function readSecret(envVarName: string, defaultValue?: string): string {
  const fileVar = `${envVarName}_FILE`;
  if (process.env[fileVar] && existsSync(process.env[fileVar])) {
    return readFileSync(process.env[fileVar], 'utf-8').trim();
  }
  return process.env[envVarName] ?? defaultValue ?? '';
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().positive().default(3000),
  APP_URL: z.string().url().default('http://localhost:3000'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  CA_STRING: z.string().optional(),
  REDIS_URL: z.string().optional(),

  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  REFRESH_TOKEN_SECRET: z.string().min(1, 'REFRESH_TOKEN_SECRET is required'),

  CORS_ALLOWED_ORIGINS: z.string().default('http://localhost:3000,http://localhost:5173'),
  TRUSTED_PROXIES: z.string().default('127.0.0.1,::1'),

  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  LOG_FORMAT: z.enum(['json', 'pretty']).default('json'),

  DOCS_ENABLED: z.coerce.boolean().default(false),
  EXPOSE_ERROR_DETAILS: z.coerce.boolean().default(false),

  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
  BODY_LIMIT_BYTES: z.coerce.number().int().positive().default(1048576), // 1MB default

  INGESTION_BUNDLE_DIR: z.string().default('/results'),

  PYTHON_SERVICE_URL: z.string().url().default('http://127.0.0.1:8001'),
  PYTHON_SERVICE_API_KEY: z.string().default('test-py-api-key'),
  PYTHON_SERVICE_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  PYTHON_SERVICE_RETRY_COUNT: z.coerce.number().int().min(0).default(3),
  PYTHON_ALLOWED_RESULT_HOSTS: z.string().default('nasa.gov,jpl.nasa.gov,media.nasa.gov'),
});

const rawEnv = {
  NODE_ENV: process.env['NODE_ENV'] ?? 'development',
  HOST: process.env['HOST'] ?? '0.0.0.0',
  PORT: process.env['PORT'] ?? 3000,
  APP_URL: process.env['APP_URL'] ?? 'http://localhost:3000',

  DATABASE_URL: readSecret('DATABASE_URL'),
  CA_STRING: readSecret('CA_STRING') || process.env['CA_STRING'] || undefined,
  REDIS_URL: readSecret('REDIS_URL') || undefined,

  JWT_SECRET: readSecret('JWT_SECRET'),
  REFRESH_TOKEN_SECRET: readSecret('REFRESH_TOKEN_SECRET'),

  CORS_ALLOWED_ORIGINS: process.env['CORS_ALLOWED_ORIGINS'] ?? 'http://localhost:3000,http://localhost:5173',
  TRUSTED_PROXIES: process.env['TRUSTED_PROXIES'] ?? '127.0.0.1,::1',

  LOG_LEVEL: process.env['LOG_LEVEL'] ?? (process.env['NODE_ENV'] === 'development' ? 'debug' : 'info'),
  LOG_FORMAT: process.env['LOG_FORMAT'] ?? (process.env['NODE_ENV'] === 'development' ? 'pretty' : 'json'),

  DOCS_ENABLED: process.env['DOCS_ENABLED'] ?? (process.env['NODE_ENV'] !== 'production' ? 'true' : 'false'),
  EXPOSE_ERROR_DETAILS:
    process.env['EXPOSE_ERROR_DETAILS'] ?? (process.env['NODE_ENV'] !== 'production' ? 'true' : 'false'),

  REQUEST_TIMEOUT_MS: process.env['REQUEST_TIMEOUT_MS'] ?? 15000,
  BODY_LIMIT_BYTES: process.env['BODY_LIMIT_BYTES'] ?? 1048576,

  INGESTION_BUNDLE_DIR:
    process.env['INGESTION_BUNDLE_DIR'] ?? resolve(process.cwd(), '../Data-pipeline/data-processing/results'),

  PYTHON_SERVICE_URL: process.env['PYTHON_SERVICE_URL'] ?? 'http://127.0.0.1:8001',
  PYTHON_SERVICE_API_KEY: readSecret('PYTHON_SERVICE_API_KEY', 'test-py-api-key'),
  PYTHON_SERVICE_TIMEOUT_MS: process.env['PYTHON_SERVICE_TIMEOUT_MS'] ?? 10000,
  PYTHON_SERVICE_RETRY_COUNT: process.env['PYTHON_SERVICE_RETRY_COUNT'] ?? 3,
  PYTHON_ALLOWED_RESULT_HOSTS: process.env['PYTHON_ALLOWED_RESULT_HOSTS'] ?? 'nasa.gov,jpl.nasa.gov,media.nasa.gov',
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('CRITICAL: Environment validation failed:');
  for (const issue of parsed.error.issues) {
    // eslint-disable-next-line no-console
    console.error(` - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

// In production, reject weak secrets (must be >= 32 characters)
if (parsed.data.NODE_ENV === 'production') {
  if (parsed.data.JWT_SECRET.length < 32) {
    // eslint-disable-next-line no-console
    console.error('CRITICAL: JWT_SECRET must be at least 32 characters long in production.');
    process.exit(1);
  }
  if (parsed.data.REFRESH_TOKEN_SECRET.length < 32) {
    // eslint-disable-next-line no-console
    console.error('CRITICAL: REFRESH_TOKEN_SECRET must be at least 32 characters long in production.');
    process.exit(1);
  }
}

export type Env = z.infer<typeof envSchema>;
export const env = parsed.data;
