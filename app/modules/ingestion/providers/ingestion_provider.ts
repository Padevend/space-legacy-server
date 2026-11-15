import { container } from '#infrastructure/container/container';
import { IngestionRepository, ingestionRepository } from '../repositories/ingestion_repository.js';
import { IngestionService } from '../services/ingestion_service.js';
import { AdminIngestionController } from '../controllers/admin_ingestion_controller.js';

export class IngestionProvider {
  register(): void {
    const mod = container.forModule('ingestion');
    mod.singleton(IngestionRepository, () => ingestionRepository);
    mod.singleton(IngestionService, () => new IngestionService(mod.make(IngestionRepository)));
    mod.bind(AdminIngestionController, () => new AdminIngestionController(mod.make(IngestionService)));
  }
}

export const ingestionProvider = new IngestionProvider();
