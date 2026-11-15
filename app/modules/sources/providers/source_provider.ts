import { container } from '#infrastructure/container/container';
import { SourceRepository } from '../repositories/source_repository.js';
import { SourceService } from '../services/source_service.js';
import { SourceSerializer } from '../serializers/source_serializer.js';
import { SourcePolicy } from '../policies/source_policy.js';
import { SourceController } from '../controllers/source_controller.js';
import { AdminSourceController } from '../controllers/admin_source_controller.js';

export class SourceProvider {
  register(): void {
    const mod = container.forModule('sources');

    mod.singleton(SourceRepository, () => new SourceRepository());
    mod.singleton(SourceSerializer, () => new SourceSerializer());
    mod.singleton(SourcePolicy, () => new SourcePolicy());
    mod.singleton(SourceService, () => new SourceService(mod.make(SourceRepository)));

    mod.bind(SourceController, () => new SourceController(mod.make(SourceService), mod.make(SourceSerializer)));
    mod.bind(
      AdminSourceController,
      () => new AdminSourceController(mod.make(SourceService), mod.make(SourceSerializer))
    );
  }
}

export const sourceProvider = new SourceProvider();
