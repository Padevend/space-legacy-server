import { prisma } from '../../core/database/prisma.js';
import type { User, Prisma, UserRole } from '@prisma/client';

export interface UserListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  role?: UserRole | undefined;
  isActive?: boolean | undefined;
  orderByField: 'email' | 'role' | 'createdAt' | 'lastLoginAt';
  orderDirection: 'asc' | 'desc';
}

export class UsersRepository {
  private buildWhere(params: Partial<UserListParams>): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};

    if (params.search) {
      where.email = {
        contains: params.search,
        mode: 'insensitive',
      };
    }

    if (params.role) {
      where.role = params.role;
    }

    if (params.isActive !== undefined) {
      where.isActive = params.isActive;
    }

    return where;
  }

  async findMany(params: UserListParams): Promise<User[]> {
    const where = this.buildWhere(params);

    return prisma.user.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.orderByField]: params.orderDirection,
      },
    });
  }

  async count(params: Partial<UserListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return prisma.user.count({ where });
  }

  async findById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { userId },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async countActiveAdmins(): Promise<number> {
    return prisma.user.count({
      where: {
        role: 'ADMIN',
        isActive: true,
      },
    });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    role: UserRole;
    isActive?: boolean | undefined;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        role: data.role,
        isActive: data.isActive ?? true,
      },
    });
  }

  async update(
    userId: string,
    data: {
      email?: string | undefined;
      passwordHash?: string | undefined;
      role?: UserRole | undefined;
      isActive?: boolean | undefined;
    }
  ): Promise<User> {
    return prisma.user.update({
      where: { userId },
      data: {
        ...(data.email && { email: data.email.toLowerCase() }),
        ...(data.passwordHash && { passwordHash: data.passwordHash }),
        ...(data.role && { role: data.role }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }

  async delete(userId: string): Promise<User> {
    return prisma.user.delete({
      where: { userId },
    });
  }

  async createAuditLog(data: {
    actorId?: string | undefined;
    action: string;
    entity: string;
    entityId: string;
    requestId?: string | undefined;
    diffSummary?: Prisma.InputJsonValue | undefined;
  }): Promise<void> {
    await prisma.auditLog.create({
      data: {
        actorId: data.actorId ?? null,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        requestId: data.requestId ?? null,
        ...(data.diffSummary !== undefined && { diffSummary: data.diffSummary }),
      },
    });
  }
}

export const usersRepository = new UsersRepository();
