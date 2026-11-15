import { createServer } from '../../bin/server.js';
import type { Hono } from 'hono';

let cachedApp: Hono | null = null;

export function getTestApp(): Hono {
  if (!cachedApp) {
    cachedApp = createServer();
  }
  return cachedApp;
}
