import { container } from '#infrastructure/container/container';
import { GamesRepository, gamesRepository } from '../repositories/games_repository.js';
import { GamesService } from '../services/games_service.js';
import { GamesController } from '../controllers/games_controller.js';
import { eventBus } from '#shared/events/index';

export class GamesProvider {
  register(): void {
    const mod = container.forModule('games');
    mod.singleton(GamesRepository, () => gamesRepository);
    mod.singleton(GamesService, () => new GamesService(mod.make(GamesRepository)));
    mod.bind(GamesController, () => new GamesController(mod.make(GamesService)));

    // Subscribe to domain event for atomic visitor progress merge (Section 7)
    eventBus.subscribe('VisitorMerged', async ({ fromId, toId }, tx) => {
      const repo = mod.make(GamesRepository);
      await repo.mergeVisitorGamesData(fromId, toId, tx);
    });
  }
}

export const gamesProvider = new GamesProvider();
