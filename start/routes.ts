import type { Hono } from 'hono';
import router from '#infrastructure/http/router';
import { HealthController } from '#modules/health/controllers/health_controller';
import { registerHealthPublicRoutes } from '#modules/health/routes/public';
import { registerCelestialBodiesPublicRoutes } from '#modules/celestial_bodies/routes/public';
import { registerMachinesPublicRoutes } from '#modules/machines/routes/public';
import { registerLogbookPublicRoutes } from '#modules/logbook/routes/public';
import { registerIdentityPublicRoutes } from '#modules/identity/routes/public';
import { registerGamesPublicRoutes } from '#modules/games/routes/public';
import { registerDashboardAdminRoutes } from '#modules/dashboard/routes/admin';
import { registerCelestialBodiesAdminRoutes } from '#modules/celestial_bodies/routes/admin';
import { registerMachinesAdminRoutes } from '#modules/machines/routes/admin';
import { registerLogbookAdminRoutes } from '#modules/logbook/routes/admin';
import { registerIngestionAdminRoutes } from '#modules/ingestion/routes/admin';
import { registerGenerationAdminRoutes } from '#modules/generation/routes/admin';
import { auth } from '#middleware/auth_middleware';
import { requireRole } from '#middleware/ability_middleware';

// Root health aliases for infrastructure/container orchestration probes
const rHealth = router.forModule('health');
rHealth.get('/health/live', [HealthController, 'live']).as('health.root_live');
rHealth.get('/health/ready', [HealthController, 'ready']).as('health.root_ready');

// Group all versioned API routes under /api/v1
router.enterGroup('/api/v1', []);

// Health Module
registerHealthPublicRoutes(router);

// Stage S4: Reference & Core Domain Public Routes
registerCelestialBodiesPublicRoutes(router);
registerMachinesPublicRoutes(router);

// Stage S5: Logbook Public Routes
registerLogbookPublicRoutes(router);

// Stage S6: Identity & Session Management Routes
registerIdentityPublicRoutes(router);

// Stage S7: Games, Quizzes & Badges Routes
registerGamesPublicRoutes(router);

// Stage S8: Administration Surface (Role ADMIN Required, Targeted PATCH)
router.enterGroup('/admin', [auth(), requireRole('ADMIN')]);
registerDashboardAdminRoutes(router);
registerCelestialBodiesAdminRoutes(router);
registerMachinesAdminRoutes(router);
registerLogbookAdminRoutes(router);
registerIngestionAdminRoutes(router);
registerGenerationAdminRoutes(router);
router.leaveGroup();

router.leaveGroup();

export function registerRoutes(app: Hono): void {
  router.toHono(app);
}

export default router;
