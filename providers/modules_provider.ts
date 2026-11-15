import { healthProvider } from '#modules/health/providers/health_provider';
import { identityProvider } from '#modules/identity/providers/identity_provider';
import { gamesProvider } from '#modules/games/providers/games_provider';

export class ModulesProvider {
  register(): void {
    healthProvider.register();
    identityProvider.register();
    gamesProvider.register();
  }
}

export const modulesProvider = new ModulesProvider();
