import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  TEST_DATABASE_URL: z.string().optional(),
  ALLOWED_SOURCE_HOSTS: z
    .string()
    .default('nasa.gov,jpl.nasa.gov')
    .transform((val) =>
      val
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    ),
  PYTHON_SERVICE_URL: z.string().url().default('http://localhost:8000'),
  PYTHON_SERVICE_API_KEY: z.string().default('test-python-key'),
  SESSION_SECRET: z.string().default('space-legacy-session-secret-min-32-chars-long!'),
  // Ingestion limits
  MAX_ZIP_SIZE_BYTES: z.coerce.number().default(25 * 1024 * 1024), // 25 MB
  MAX_TOTAL_UNCOMPRESSED_BYTES: z.coerce.number().default(120 * 1024 * 1024), // 120 MB
  MAX_FILE_UNCOMPRESSED_BYTES: z.coerce.number().default(15 * 1024 * 1024), // 15 MB
  MAX_ZIP_ENTRIES: z.coerce.number().default(300),
  MAX_COMPRESSION_RATIO: z.coerce.number().default(50),
  MAX_IMAGE_WIDTH: z.coerce.number().default(4000),
  MAX_IMAGE_HEIGHT: z.coerce.number().default(4000),
  MAX_IMAGE_MEGAPIXELS: z.coerce.number().default(16),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment configuration:', parsed.error.format());
  throw new Error('Environment configuration validation failed');
}

export const config = parsed.data;
export type AppConfig = typeof config;
