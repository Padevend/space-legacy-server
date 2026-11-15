import { container } from '#infrastructure/container/container';
import { HealthRepository } from '../repositories/health_repository.js';
import { HealthService } from '../services/health_service.js';
import { HealthController } from '../controllers/health_controller.js';
import { HealthSerializer } from '../serializers/health_serializer.js';

export class HealthProvider {
  register(): void {
    const mod = container.forModule('health');
    mod.singleton(HealthRepository, () => new HealthRepository());
    mod.singleton(HealthSerializer, () => new HealthSerializer());
    mod.singleton(HealthService, () => new HealthService(mod.make(HealthRepository)));
    mod.bind(HealthController, () => new HealthController(mod.make(HealthService), mod.make(HealthSerializer)));
  }
}

export const healthProvider = new HealthProvider();
