import { container } from '#infrastructure/container/container';
import { StoryRepository } from '../repositories/story_repository.js';
import { StoryService } from '../services/story_service.js';
import { StorySerializer } from '../serializers/story_serializer.js';
import { StoryPolicy } from '../policies/story_policy.js';
import { StoryController } from '../controllers/story_controller.js';
import { AdminStoryController } from '../controllers/admin_story_controller.js';

export class StoryProvider {
  register(): void {
    const mod = container.forModule('stories');

    mod.singleton(StoryRepository, () => new StoryRepository());
    mod.singleton(StorySerializer, () => new StorySerializer());
    mod.singleton(StoryPolicy, () => new StoryPolicy());
    mod.singleton(StoryService, () => new StoryService(mod.make(StoryRepository)));

    mod.bind(StoryController, () => new StoryController(mod.make(StoryService), mod.make(StorySerializer)));
    mod.bind(AdminStoryController, () => new AdminStoryController(mod.make(StoryService), mod.make(StorySerializer)));
  }
}

export const storyProvider = new StoryProvider();
