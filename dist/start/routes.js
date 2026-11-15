import { healthRouter } from '../src/modules/health/health.routes.js';
import { authRouter } from '../src/modules/auth/auth.routes.js';
import { usersRouter } from '../src/modules/users/users.routes.js';
import { publicCelestialBodiesRouter, adminCelestialBodiesRouter, } from '../src/modules/celestial-bodies/celestial-bodies.routes.js';
import { publicLocationsRouter, adminLocationsRouter } from '../src/modules/locations/locations.routes.js';
import { publicPeopleRouter, adminPeopleRouter } from '../src/modules/people/people.routes.js';
import { publicSourcesRouter, adminSourcesRouter } from '../src/modules/sources/sources.routes.js';
import { publicMissionsRouter, adminMissionsRouter } from '../src/modules/missions/missions.routes.js';
import { publicEquipmentRouter, adminEquipmentRouter } from '../src/modules/equipment/equipment.routes.js';
import { publicEventsRouter, adminEventsRouter } from '../src/modules/events/events.routes.js';
import { publicMeasurementsRouter, adminMeasurementsRouter } from '../src/modules/measurements/measurements.routes.js';
import { publicMediaRouter, adminMediaRouter } from '../src/modules/media/media.routes.js';
import { publicStoriesRouter, adminStoriesRouter } from '../src/modules/stories/stories.routes.js';
export function registerRoutes(app) {
    // Liveness and Readiness Probes
    app.route('/api/v1/health', healthRouter);
    app.route('/health', healthRouter); // Root alias for infrastructure probes
    // Auth & Session Management
    app.route('/api/v1/auth', authRouter);
    // Reference Data (Public)
    app.route('/api/v1/celestial-bodies', publicCelestialBodiesRouter);
    app.route('/api/v1/locations', publicLocationsRouter);
    app.route('/api/v1/people', publicPeopleRouter);
    app.route('/api/v1/sources', publicSourcesRouter);
    // Core Domain (Public)
    app.route('/api/v1/missions', publicMissionsRouter);
    app.route('/api/v1/equipment', publicEquipmentRouter);
    app.route('/api/v1/events', publicEventsRouter);
    app.route('/api/v1/measurements', publicMeasurementsRouter);
    // Editorial Content (Public)
    app.route('/api/v1/media', publicMediaRouter);
    app.route('/api/v1/stories', publicStoriesRouter);
    // Admin Management Surfaces
    app.route('/api/v1/admin/users', usersRouter);
    app.route('/api/v1/admin/celestial-bodies', adminCelestialBodiesRouter);
    app.route('/api/v1/admin/locations', adminLocationsRouter);
    app.route('/api/v1/admin/people', adminPeopleRouter);
    app.route('/api/v1/admin/sources', adminSourcesRouter);
    // Core Domain (Admin)
    app.route('/api/v1/admin/missions', adminMissionsRouter);
    app.route('/api/v1/admin/equipment', adminEquipmentRouter);
    app.route('/api/v1/admin/events', adminEventsRouter);
    app.route('/api/v1/admin/measurements', adminMeasurementsRouter);
    // Editorial Content (Admin)
    app.route('/api/v1/admin/media', adminMediaRouter);
    app.route('/api/v1/admin/stories', adminStoriesRouter);
}
