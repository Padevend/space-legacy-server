import { healthRouter } from '../src/modules/health/health.routes.js';
import { authRouter } from '../src/modules/auth/auth.routes.js';
import { usersRouter } from '../src/modules/users/users.routes.js';
import { publicCelestialBodiesRouter, adminCelestialBodiesRouter, } from '../src/modules/celestial-bodies/celestial-bodies.routes.js';
import { publicLocationsRouter, adminLocationsRouter } from '../src/modules/locations/locations.routes.js';
import { publicPeopleRouter, adminPeopleRouter } from '../src/modules/people/people.routes.js';
import { publicSourcesRouter, adminSourcesRouter } from '../src/modules/sources/sources.routes.js';
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
    // Admin Management Surfaces
    app.route('/api/v1/admin/users', usersRouter);
    app.route('/api/v1/admin/celestial-bodies', adminCelestialBodiesRouter);
    app.route('/api/v1/admin/locations', adminLocationsRouter);
    app.route('/api/v1/admin/people', adminPeopleRouter);
    app.route('/api/v1/admin/sources', adminSourcesRouter);
}
