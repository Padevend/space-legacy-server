import { container } from '#infrastructure/container/container';
import { MediaRepository } from '../repositories/media_repository.js';
import { MediaService } from '../services/media_service.js';
import { MediaSerializer } from '../serializers/media_serializer.js';
import { MediaPolicy } from '../policies/media_policy.js';
import { MediaController } from '../controllers/media_controller.js';
import { AdminMediaController } from '../controllers/admin_media_controller.js';

export class MediaProvider {
  register(): void {
    const mod = container.forModule('media');

    mod.singleton(MediaRepository, () => new MediaRepository());
    mod.singleton(MediaSerializer, () => new MediaSerializer());
    mod.singleton(MediaPolicy, () => new MediaPolicy());
    mod.singleton(MediaService, () => new MediaService(mod.make(MediaRepository)));

    mod.bind(MediaController, () => new MediaController(mod.make(MediaService), mod.make(MediaSerializer)));
    mod.bind(AdminMediaController, () => new AdminMediaController(mod.make(MediaService), mod.make(MediaSerializer)));
  }
}

export const mediaProvider = new MediaProvider();
