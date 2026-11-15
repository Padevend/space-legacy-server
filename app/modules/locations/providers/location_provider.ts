import { container } from '#infrastructure/container/container';
import { LocationRepository } from '../repositories/location_repository.js';
import { LocationService } from '../services/location_service.js';
import { LocationSerializer } from '../serializers/location_serializer.js';
import { LocationPolicy } from '../policies/location_policy.js';
import { LocationController } from '../controllers/location_controller.js';
import { AdminLocationController } from '../controllers/admin_location_controller.js';

export class LocationProvider {
  register(): void {
    const mod = container.forModule('locations');

    mod.singleton(LocationRepository, () => new LocationRepository());
    mod.singleton(LocationSerializer, () => new LocationSerializer());
    mod.singleton(LocationPolicy, () => new LocationPolicy());
    mod.singleton(LocationService, () => new LocationService(mod.make(LocationRepository)));

    mod.bind(LocationController, () => new LocationController(mod.make(LocationService), mod.make(LocationSerializer)));
    mod.bind(
      AdminLocationController,
      () => new AdminLocationController(mod.make(LocationService), mod.make(LocationSerializer))
    );
  }
}

export const locationProvider = new LocationProvider();
