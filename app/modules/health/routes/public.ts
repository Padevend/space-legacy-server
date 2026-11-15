import type { Router } from '#infrastructure/http/router';
import { HealthController } from '../controllers/health_controller.js';
import { healthLiveResponseSchema, healthReadyResponseSchema } from '../validators/health.js';

export function registerHealthPublicRoutes(router: Router): void {
  const r = router.forModule('health');
  r.get('/health/live', [HealthController, 'live'])
    .as('health.live')
    .docs({
      summary: 'Process Liveness Probe',
      description: 'Checks whether the API server process is running.',
      tags: ['Health'],
      responses: { 200: healthLiveResponseSchema },
    });

  r.get('/health/ready', [HealthController, 'ready'])
    .as('health.ready')
    .docs({
      summary: 'System Readiness Probe',
      description: 'Checks external dependencies (PostgreSQL database).',
      tags: ['Health'],
      responses: { 200: healthReadyResponseSchema, 503: 'SERVICE_UNAVAILABLE' },
    });
}
