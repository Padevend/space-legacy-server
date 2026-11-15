import { healthService, HealthService } from './health.service.js';
import { healthSerializer, HealthSerializer } from './health.serializer.js';
export class HealthController {
    service;
    serializer;
    constructor(service = healthService, serializer = healthSerializer) {
        this.service = service;
        this.serializer = serializer;
    }
    live = (c) => {
        const raw = this.service.getLiveness();
        const data = this.serializer.serializeLive(raw);
        const requestId = c.get('requestId') || 'unknown';
        c.header('Content-Type', 'application/json; charset=utf-8');
        c.header('X-Request-Id', requestId);
        return c.json({ success: true, data, meta: { requestId } }, 200);
    };
    ready = async (c) => {
        const raw = await this.service.getReadiness();
        const data = this.serializer.serializeReady(raw);
        const requestId = c.get('requestId') || 'unknown';
        c.header('Content-Type', 'application/json; charset=utf-8');
        c.header('X-Request-Id', requestId);
        return c.json({ success: true, data, meta: { requestId } }, 200);
    };
}
export const healthController = new HealthController();
