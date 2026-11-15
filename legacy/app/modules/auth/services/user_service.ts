import type { UserModel } from '../models/user.js';
import { AuthRepository, authRepository } from '../repositories/auth_repository.js';
import { hashPassword } from '#infrastructure/security/password_hasher';
import { AppException } from '#exceptions/app_exception';
import type { ListUsersQueryDto, CreateUserRequestDto, UpdateUserRequestDto } from '../validators/user.js';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class UserService {
  constructor(private readonly repo: AuthRepository = authRepository) {}

  async listUsers(query: ListUsersQueryDto): Promise<PaginatedResult<UserModel>> {
    const page = query.page;
    const pageSize = query.pageSize;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this.repo.findManyUsers({
        skip,
        take: pageSize,
        search: query.search,
        role: query.role,
        isActive: query.isActive,
        orderByField: query.sort,
        orderDirection: query.order,
      }),
      this.repo.countUsers({
        search: query.search,
        role: query.role,
        isActive: query.isActive,
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getUserById(userId: string): Promise<UserModel> {
    const user = await this.repo.findUserById(userId);
    if (!user) {
      throw AppException.notFound('User', `User with ID '${userId}' not found.`);
    }
    return user;
  }

  async createUser(dto: CreateUserRequestDto): Promise<UserModel> {
    const existing = await this.repo.findUserByEmail(dto.email);
    if (existing) {
      throw AppException.conflict(`A user with email '${dto.email}' already exists.`);
    }

    const passwordHash = await hashPassword(dto.password);
    return this.repo.createUser({
      email: dto.email,
      passwordHash,
      role: dto.role,
      isActive: true,
    });
  }

  async updateUser(userId: string, dto: UpdateUserRequestDto): Promise<UserModel> {
    const user = await this.getUserById(userId);

    if (dto.email && dto.email.toLowerCase() !== user.email.toLowerCase()) {
      const emailConflict = await this.repo.findUserByEmail(dto.email);
      if (emailConflict) {
        throw AppException.conflict(`A user with email '${dto.email}' already exists.`);
      }
    }

    if (user.role === 'ADMIN' && (dto.role === 'EDITOR' || dto.isActive === false)) {
      const activeAdminCount = await this.repo.countActiveAdmins();
      if (activeAdminCount <= 1) {
        throw AppException.badRequest('Cannot deactivate or demote the last active Administrator.');
      }
    }

    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await hashPassword(dto.password);
    }

    const updated = await this.repo.updateUser(userId, {
      email: dto.email,
      role: dto.role,
      isActive: dto.isActive,
      passwordHash,
    });

    if (dto.password) {
      await this.repo.revokeAllUserTokens(userId);
    }

    return updated;
  }

  async deleteUser(userId: string): Promise<UserModel> {
    const user = await this.getUserById(userId);

    if (user.role === 'ADMIN') {
      const activeAdminCount = await this.repo.countActiveAdmins();
      if (activeAdminCount <= 1) {
        throw AppException.badRequest('Cannot delete the last active Administrator account.');
      }
    }

    await this.repo.revokeAllUserTokens(userId);
    return this.repo.deleteUser(userId);
  }
}

export const userService = new UserService();
