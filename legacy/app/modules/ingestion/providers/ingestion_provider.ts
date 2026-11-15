import { container } from '#infrastructure/container/container';
import { IngestionRepository } from '../repositories/ingestion_repository.js';
import { IngestionService } from '../services/ingestion_service.js';
import { IngestionSerializer } from '../serializers/ingestion_serializer.js';
import { IngestionPolicy } from '../policies/ingestion_policy.js';
import { AdminIngestionController } from '../controllers/admin_ingestion_controller.js';

export class IngestionProvider {
  register(): void {
    const mod = container.forModule('ingestion');

    mod.singleton(IngestionRepository, () => new IngestionRepository());
    mod.singleton(IngestionSerializer, () => new IngestionSerializer());
    mod.singleton(IngestionPolicy, () => new IngestionPolicy());
    mod.singleton(IngestionService, () => new IngestionService(mod.make(IngestionRepository)));

    mod.bind(
      AdminIngestionController,
      () => new AdminIngestionController(mod.make(IngestionService), mod.make(IngestionSerializer))
    );
  }
}

export const ingestionProvider = new IngestionProvider();
