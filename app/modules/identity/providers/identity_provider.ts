import { container } from '#infrastructure/container/container';
import { SESSION_RESOLVER_TOKEN } from '#contracts/auth_contract';
import { IdentityRepository } from '../repositories/identity_repository.js';
import { IdentityService, identityService } from '../services/identity_service.js';
import { IdentityController } from '../controllers/identity_controller.js';

export class IdentityProvider {
  register(): void {
    const mod = container.forModule('identity');
    mod.singleton(IdentityRepository, () => new IdentityRepository());
    mod.singleton(IdentityService, () => new IdentityService(mod.make(IdentityRepository)));
    mod.bind(IdentityController, () => new IdentityController(mod.make(IdentityService)));

    // Register SessionResolver in root container for auth_middleware
    container.singleton(SESSION_RESOLVER_TOKEN, () => identityService);
  }
}

export const identityProvider = new IdentityProvider();
