import { container } from '#infrastructure/container/container';
import { GenerationRepository, generationRepository } from '../repositories/generation_repository.js';
import { PythonGenerationService, pythonGenerationService } from '../services/python_generation_service.js';
import { GenerationService } from '../services/generation_service.js';
import { AdminGenerationController } from '../controllers/admin_generation_controller.js';

export class GenerationProvider {
  register(): void {
    const mod = container.forModule('generation');
    mod.singleton(GenerationRepository, () => generationRepository);
    mod.singleton(PythonGenerationService, () => pythonGenerationService);
    mod.singleton(
      GenerationService,
      () => new GenerationService(mod.make(GenerationRepository), mod.make(PythonGenerationService))
    );
    mod.bind(AdminGenerationController, () => new AdminGenerationController(mod.make(GenerationService)));
  }
}

export const generationProvider = new GenerationProvider();
