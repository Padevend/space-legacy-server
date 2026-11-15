import { env } from '../start/env.js';

export const ingestionConfig = {
  bundleDirectory: env.INGESTION_BUNDLE_DIR,
  maxArchiveBytes: 25 * 1024 * 1024, // 25MB
  maxEntries: 300,
  maxTotalUncompressedBytes: 120 * 1024 * 1024, // 120MB
  maxEntryUncompressedBytes: 15 * 1024 * 1024, // 15MB
  maxJsonSizeBytes: 512 * 1024, // 512KB
  maxCompressionRatio: 50,
  maxPathDepth: 4,
  maxFilenameLength: 120,
  maxImageWidth: 4000,
  maxImageHeight: 4000,
  maxMegapixels: 16,
  allowedExtensions: ['json', 'jpg', 'jpeg', 'png', 'webp'] as const,
  allowedSourceHosts: ['nasa.gov', 'jpl.nasa.gov'],
} as const;
