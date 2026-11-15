export const defaultRedactPaths = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-csrf-token"]',
  'password',
  'token',
  'refreshToken',
  'secret',
  'apiKey',
  'accessToken',
  '*.password',
  '*.token',
  '*.refreshToken',
];
