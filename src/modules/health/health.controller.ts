import type { Context } from 'hono';
import { healthService, HealthService } from './health.service.js';
import { healthSerializer, HealthSerializer } from './health.serializer.js';

export class HealthController {
  constructor(
    private readonly service: HealthService = healthService,
    private readonly serializer: HealthSerializer = healthSerializer
  ) {}

  live = (c: Context) => {
    const raw = this.service.getLiveness();
    const data = this.serializer.serializeLive(raw);
    const requestId = c.get('requestId') || 'unknown';
    c.header('Content-Type', 'application/json; charset=utf-8');
    c.header('X-Request-Id', requestId);
    return c.json({ success: true as const, data, meta: { requestId } }, 200);
  };

  ready = async (c: Context) => {
    const raw = await this.service.getReadiness();
    const data = this.serializer.serializeReady(raw);
    const requestId = c.get('requestId') || 'unknown';
    c.header('Content-Type', 'application/json; charset=utf-8');
    c.header('X-Request-Id', requestId);
    return c.json({ success: true as const, data, meta: { requestId } }, 200);
  };
}

export const healthController = new HealthController();
