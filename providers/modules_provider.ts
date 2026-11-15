import { healthProvider } from '#modules/health/providers/health_provider';

export class ModulesProvider {
  register(): void {
    healthProvider.register();
  }
}

export const modulesProvider = new ModulesProvider();
