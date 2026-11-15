import { healthProvider } from '#modules/health/providers/health_provider';
import { identityProvider } from '#modules/identity/providers/identity_provider';
import { gamesProvider } from '#modules/games/providers/games_provider';
import { dashboardProvider } from '#modules/dashboard/providers/dashboard_provider';
import { ingestionProvider } from '#modules/ingestion/providers/ingestion_provider';
import { generationProvider } from '#modules/generation/providers/generation_provider';

export class ModulesProvider {
  register(): void {
    healthProvider.register();
    identityProvider.register();
    gamesProvider.register();
    dashboardProvider.register();
    ingestionProvider.register();
    generationProvider.register();
  }
}

export const modulesProvider = new ModulesProvider();
