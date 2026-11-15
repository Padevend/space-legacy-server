import { container } from '#infrastructure/container/container';
import { ArchiveRepository } from '../repositories/archive_repository.js';
import { ArchiveService } from '../services/archive_service.js';
import { ArchiveSerializer } from '../serializers/archive_serializer.js';
import { ArchivePolicy } from '../policies/archive_policy.js';
import { AdminArchiveController } from '../controllers/admin_archive_controller.js';

export class ArchiveProvider {
  register(): void {
    const mod = container.forModule('archives');

    mod.singleton(ArchiveRepository, () => new ArchiveRepository());
    mod.singleton(ArchiveSerializer, () => new ArchiveSerializer());
    mod.singleton(ArchivePolicy, () => new ArchivePolicy());
    mod.singleton(ArchiveService, () => new ArchiveService(mod.make(ArchiveRepository)));

    mod.bind(
      AdminArchiveController,
      () => new AdminArchiveController(mod.make(ArchiveService), mod.make(ArchiveSerializer))
    );
  }
}

export const archiveProvider = new ArchiveProvider();
