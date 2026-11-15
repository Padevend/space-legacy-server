import { healthProvider } from '#modules/health/providers/health_provider';
import { identityProvider } from '#modules/identity/providers/identity_provider';

export class ModulesProvider {
  register(): void {
    healthProvider.register();
    identityProvider.register();
  }
}

export const modulesProvider = new ModulesProvider();
