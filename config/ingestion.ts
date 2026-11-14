import { env } from '../start/env.js';

export const ingestionConfig = {
  bundleDirectory: env.INGESTION_BUNDLE_DIR,
  maxFileSizeBytes: 15 * 1024 * 1024, // 15MB
  maxRecordsPerTable: 5000,
  maxNestingDepth: 4,
} as const;
