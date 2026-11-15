import { container } from '#infrastructure/container/container';
import { USER_RESOLVER_TOKEN, type UserResolver } from '#contracts/auth_contract';
import { AuthRepository } from '../repositories/auth_repository.js';
import { AuthService } from '../services/auth_service.js';
import { UserService } from '../services/user_service.js';
import { AuthSerializer } from '../serializers/auth_serializer.js';
import { UserSerializer } from '../serializers/user_serializer.js';
import { UserPolicy } from '../policies/user_policy.js';
import { AuthController } from '../controllers/auth_controller.js';
import { UsersController } from '../controllers/users_controller.js';

export class AuthProvider {
  register(): void {
    const mod = container.forModule('auth');

    mod.singleton(AuthRepository, () => new AuthRepository());
    mod.singleton(AuthSerializer, () => new AuthSerializer());
    mod.singleton(UserSerializer, () => new UserSerializer());
    mod.singleton(UserPolicy, () => new UserPolicy());

    mod.singleton(AuthService, () => new AuthService(mod.make(AuthRepository)));
    mod.singleton(UserService, () => new UserService(mod.make(AuthRepository)));

    mod.bind(AuthController, () => new AuthController(mod.make(AuthService), mod.make(AuthSerializer)));
    mod.bind(UsersController, () => new UsersController(mod.make(UserService), mod.make(UserSerializer)));

    // Bind UserResolver contract implementation in root container
    container.singleton<UserResolver>(USER_RESOLVER_TOKEN, () => ({
      resolveUser: async (userId: string) => {
        const repo = mod.make(AuthRepository);
        const user = await repo.findUserById(userId);
        if (!user) return null;
        return {
          userId: user.userId,
          email: user.email,
          role: user.role,
          status: user.isActive ? 'ACTIVE' : 'SUSPENDED',
        };
      },
    }));
  }
}

export const authProvider = new AuthProvider();
