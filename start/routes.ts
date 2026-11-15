import type { Hono } from 'hono';
import router from '#infrastructure/http/router';
import { HealthController } from '#modules/health/controllers/health_controller';
import { registerHealthPublicRoutes } from '#modules/health/routes/public';

// Root health aliases for infrastructure/container orchestration probes
const rHealth = router.forModule('health');
rHealth.get('/health/live', [HealthController, 'live']).as('health.root_live');
rHealth.get('/health/ready', [HealthController, 'ready']).as('health.root_ready');

// Group all versioned API routes under /api/v1
router.enterGroup('/api/v1', []);

// Health Module
registerHealthPublicRoutes(router);

router.leaveGroup();

export function registerRoutes(app: Hono): void {
  router.toHono(app);
}

export default router;
