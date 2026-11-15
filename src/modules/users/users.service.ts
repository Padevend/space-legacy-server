import type { User } from '@prisma/client';
import { usersRepository, type UsersRepository } from './users.repository.js';
import { hashPassword } from '../../core/security/password.js';
import { AppException } from '../../core/exceptions/AppException.js';
import type { ListUsersQueryDto, CreateUserRequestDto, UpdateUserRequestDto } from './users.schemas.js';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class UsersService {
  constructor(private readonly repo: UsersRepository = usersRepository) {}

  async listUsers(query: ListUsersQueryDto): Promise<PaginatedResult<User>> {
    const page = query.page;
    const pageSize = query.pageSize;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this.repo.findMany({
        skip,
        take: pageSize,
        search: query.search,
        role: query.role,
        isActive: query.isActive,
        orderByField: query.sort,
        orderDirection: query.order,
      }),
      this.repo.count({
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

  async getUserById(userId: string): Promise<User> {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw AppException.notFound('User');
    }
    return user;
  }

  async createUser(dto: CreateUserRequestDto, context: { actorId: string; requestId: string }): Promise<User> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) {
      throw AppException.conflict('A user with this email address already exists.');
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await this.repo.create({
      email: dto.email,
      passwordHash,
      role: dto.role,
    });

    await this.repo.createAuditLog({
      actorId: context.actorId,
      action: 'USER_CREATED',
      entity: 'User',
      entityId: user.userId,
      requestId: context.requestId,
      diffSummary: { email: user.email, role: user.role },
    });

    return user;
  }

  async updateUser(
    userId: string,
    dto: UpdateUserRequestDto,
    context: { actorId: string; requestId: string }
  ): Promise<User> {
    const user = await this.getUserById(userId);

    // Guard against demoting or deactivating the last active administrator
    if (user.role === 'ADMIN' && (dto.role === 'EDITOR' || dto.isActive === false)) {
      const activeAdmins = await this.repo.countActiveAdmins();
      if (activeAdmins <= 1) {
        throw AppException.conflict('Cannot demote or deactivate the last remaining active administrator.');
      }
    }

    let passwordHash: string | undefined;
    if (dto.password) {
      passwordHash = await hashPassword(dto.password);
    }

    const updated = await this.repo.update(userId, {
      role: dto.role,
      isActive: dto.isActive,
      passwordHash,
    });

    await this.repo.createAuditLog({
      actorId: context.actorId,
      action: 'USER_UPDATED',
      entity: 'User',
      entityId: updated.userId,
      requestId: context.requestId,
      diffSummary: {
        roleChanged: dto.role !== undefined,
        statusChanged: dto.isActive !== undefined,
        passwordChanged: dto.password !== undefined,
      },
    });

    return updated;
  }

  async deleteUser(userId: string, context: { actorId: string; requestId: string }): Promise<void> {
    const user = await this.getUserById(userId);

    if (user.role === 'ADMIN') {
      const activeAdmins = await this.repo.countActiveAdmins();
      if (activeAdmins <= 1) {
        throw AppException.conflict('Cannot delete the last remaining active administrator.');
      }
    }

    await this.repo.delete(userId);

    await this.repo.createAuditLog({
      actorId: context.actorId,
      action: 'USER_DELETED',
      entity: 'User',
      entityId: userId,
      requestId: context.requestId,
      diffSummary: { deletedEmail: user.email },
    });
  }
}

export const usersService = new UsersService();
