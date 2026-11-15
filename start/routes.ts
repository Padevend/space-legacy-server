import type { Hono } from 'hono';
import router from '#infrastructure/http/router';
import { HealthController } from '#modules/health/controllers/health_controller';

// Module route registrars
import { registerHealthPublicRoutes } from '#modules/health/routes/public';
import { registerAuthPublicRoutes } from '#modules/auth/routes/public';
import { registerAuthAdminRoutes } from '#modules/auth/routes/admin';
import { registerAuditAdminRoutes } from '#modules/audit/routes/admin';
import { registerCelestialBodiesPublicRoutes } from '#modules/celestial_bodies/routes/public';
import { registerCelestialBodiesAdminRoutes } from '#modules/celestial_bodies/routes/admin';
import { registerLocationsPublicRoutes } from '#modules/locations/routes/public';
import { registerLocationsAdminRoutes } from '#modules/locations/routes/admin';
import { registerPeoplePublicRoutes } from '#modules/people/routes/public';
import { registerPeopleAdminRoutes } from '#modules/people/routes/admin';
import { registerSourcesPublicRoutes } from '#modules/sources/routes/public';
import { registerSourcesAdminRoutes } from '#modules/sources/routes/admin';
import { registerMissionsPublicRoutes } from '#modules/missions/routes/public';
import { registerMissionsAdminRoutes } from '#modules/missions/routes/admin';
import { registerEquipmentPublicRoutes } from '#modules/equipment/routes/public';
import { registerEquipmentAdminRoutes } from '#modules/equipment/routes/admin';
import { registerEventsPublicRoutes } from '#modules/events/routes/public';
import { registerEventsAdminRoutes } from '#modules/events/routes/admin';
import { registerMeasurementsPublicRoutes } from '#modules/measurements/routes/public';
import { registerMeasurementsAdminRoutes } from '#modules/measurements/routes/admin';
import { registerMediaPublicRoutes } from '#modules/media/routes/public';
import { registerMediaAdminRoutes } from '#modules/media/routes/admin';
import { registerStoriesPublicRoutes } from '#modules/stories/routes/public';
import { registerStoriesAdminRoutes } from '#modules/stories/routes/admin';
import { registerArchivesAdminRoutes } from '#modules/archives/routes/admin';
import { registerIngestionAdminRoutes } from '#modules/ingestion/routes/admin';
import { registerCatalogPublicRoutes } from '#modules/catalog/routes/public';
import { registerDashboardAdminRoutes } from '#modules/dashboard/routes/admin';

// Root health aliases for infrastructure/container orchestration probes
const rHealth = router.forModule('health');
rHealth.get('/health/live', [HealthController, 'live']).as('health.root_live');
rHealth.get('/health/ready', [HealthController, 'ready']).as('health.root_ready');

// Group all versioned API routes under /api/v1
router.enterGroup('/api/v1', []);

// Health Module
registerHealthPublicRoutes(router);

// Auth Module (Public + Admin)
registerAuthPublicRoutes(router);
registerAuthAdminRoutes(router);

// Audit Module (Admin)
registerAuditAdminRoutes(router);

// Reference Data Modules (Public + Admin)
registerCelestialBodiesPublicRoutes(router);
registerCelestialBodiesAdminRoutes(router);

registerLocationsPublicRoutes(router);
registerLocationsAdminRoutes(router);

registerPeoplePublicRoutes(router);
registerPeopleAdminRoutes(router);

registerSourcesPublicRoutes(router);
registerSourcesAdminRoutes(router);

// Core Domain Modules (Public + Admin)
registerMissionsPublicRoutes(router);
registerMissionsAdminRoutes(router);

registerEquipmentPublicRoutes(router);
registerEquipmentAdminRoutes(router);

registerEventsPublicRoutes(router);
registerEventsAdminRoutes(router);

registerMeasurementsPublicRoutes(router);
registerMeasurementsAdminRoutes(router);

registerMediaPublicRoutes(router);
registerMediaAdminRoutes(router);

registerStoriesPublicRoutes(router);
registerStoriesAdminRoutes(router);

// Archives & Ingestion Modules (Admin)
registerArchivesAdminRoutes(router);
registerIngestionAdminRoutes(router);

// Projections & Composed Query Modules
registerCatalogPublicRoutes(router);
registerDashboardAdminRoutes(router);

router.leaveGroup();

export function registerRoutes(app: Hono): void {
  router.toHono(app);
}

export default router;
