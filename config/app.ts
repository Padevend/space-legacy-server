import { env } from '../start/env.js';

export const appConfig = {
  name: 'SPACE LEGACY API',
  env: env.NODE_ENV,
  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV === 'development',
  isTest: env.NODE_ENV === 'test',
  host: env.HOST,
  port: env.PORT,
  url: env.APP_URL,
  apiPrefix: '/api/v1',
  docsEnabled: env.DOCS_ENABLED,
  exposeErrorDetails: env.EXPOSE_ERROR_DETAILS,
} as const;
