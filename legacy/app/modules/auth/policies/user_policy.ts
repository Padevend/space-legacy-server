import type { UserModel } from '../models/user.js';
import type { AuthenticatedUser } from '#contracts/auth_contract';

export class UserPolicy {
  canManageUsers(actor: AuthenticatedUser): boolean {
    return actor.role === 'ADMIN';
  }

  canModifyUser(actor: AuthenticatedUser, targetUser: UserModel): boolean {
    if (actor.role === 'ADMIN') return true;
    return actor.userId === targetUser.userId;
  }
}

export const userPolicy = new UserPolicy();
