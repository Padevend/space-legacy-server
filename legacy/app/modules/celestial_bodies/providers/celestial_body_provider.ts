import { container } from '#infrastructure/container/container';
import { CelestialBodyRepository } from '../repositories/celestial_body_repository.js';
import { CelestialBodyService } from '../services/celestial_body_service.js';
import { CelestialBodySerializer } from '../serializers/celestial_body_serializer.js';
import { CelestialBodyPolicy } from '../policies/celestial_body_policy.js';
import { CelestialBodyController } from '../controllers/celestial_body_controller.js';
import { AdminCelestialBodyController } from '../controllers/admin_celestial_body_controller.js';

export class CelestialBodyProvider {
  register(): void {
    const mod = container.forModule('celestial_bodies');

    mod.singleton(CelestialBodyRepository, () => new CelestialBodyRepository());
    mod.singleton(CelestialBodySerializer, () => new CelestialBodySerializer());
    mod.singleton(CelestialBodyPolicy, () => new CelestialBodyPolicy());
    mod.singleton(CelestialBodyService, () => new CelestialBodyService(mod.make(CelestialBodyRepository)));

    mod.bind(
      CelestialBodyController,
      () => new CelestialBodyController(mod.make(CelestialBodyService), mod.make(CelestialBodySerializer))
    );
    mod.bind(
      AdminCelestialBodyController,
      () => new AdminCelestialBodyController(mod.make(CelestialBodyService), mod.make(CelestialBodySerializer))
    );
  }
}

export const celestialBodyProvider = new CelestialBodyProvider();
