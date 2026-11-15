import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { healthService, HealthService } from '../services/health_service.js';
import { healthSerializer, HealthSerializer } from '../serializers/health_serializer.js';

export class HealthController {
  constructor(
    private readonly service: HealthService = healthService,
    private readonly serializer: HealthSerializer = healthSerializer
  ) {}

  live = (ctxOrC: HttpContext | Context) => {
    const raw = this.service.getLiveness();
    const data = this.serializer.serializeLive(raw);
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const requestId = (c.get('requestId') as string) || 'unknown';
    c.header('Content-Type', 'application/json; charset=utf-8');
    c.header('X-Request-Id', requestId);
    return c.json({ success: true as const, data, meta: { requestId } }, 200);
  };

  ready = async (ctxOrC: HttpContext | Context) => {
    const raw = await this.service.getReadiness();
    const data = this.serializer.serializeReady(raw);
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const requestId = (c.get('requestId') as string) || 'unknown';
    c.header('Content-Type', 'application/json; charset=utf-8');
    c.header('X-Request-Id', requestId);
    return c.json({ success: true as const, data, meta: { requestId } }, 200);
  };
}

export const healthController = new HealthController();
