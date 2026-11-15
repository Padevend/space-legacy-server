import { prisma } from '#infrastructure/database/prisma_client';
import type { UserModel } from '../models/user.js';
import type { RefreshTokenModel } from '../models/refresh_token.js';

export interface UserListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  role?: 'ADMIN' | 'EDITOR' | undefined;
  isActive?: boolean | undefined;
  orderByField: 'email' | 'role' | 'createdAt' | 'lastLoginAt';
  orderDirection: 'asc' | 'desc';
}

export class AuthRepository {
  private mapUser(row: any): UserModel {
    return {
      userId: row.userId,
      email: row.email,
      passwordHash: row.passwordHash,
      role: row.role,
      isActive: row.isActive,
      failedLoginCount: row.failedLoginCount,
      lockedUntil: row.lockedUntil,
      lastLoginAt: row.lastLoginAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private mapRefreshToken(row: any): RefreshTokenModel {
    return {
      refreshTokenId: row.refreshTokenId,
      tokenHash: row.tokenHash,
      userId: row.userId,
      familyId: row.familyId,
      expiresAt: row.expiresAt,
      revokedAt: row.revokedAt,
      replacedById: row.replacedById,
      userAgentHash: row.userAgentHash,
      createdAt: row.createdAt,
    };
  }

  async findUserByEmail(email: string): Promise<UserModel | null> {
    const row = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return row ? this.mapUser(row) : null;
  }

  async findUserById(userId: string): Promise<UserModel | null> {
    const row = await prisma.user.findUnique({
      where: { userId },
    });
    return row ? this.mapUser(row) : null;
  }

  async recordFailedLogin(userId: string, lockoutMinutes = 15): Promise<UserModel> {
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const newCount = user.failedLoginCount + 1;
    const shouldLock = newCount >= 5;
    const lockedUntil = shouldLock ? new Date(Date.now() + lockoutMinutes * 60 * 1000) : user.lockedUntil;

    const updated = await prisma.user.update({
      where: { userId },
      data: {
        failedLoginCount: newCount,
        lockedUntil,
      },
    });
    return this.mapUser(updated);
  }

  async resetFailedLogin(userId: string): Promise<UserModel> {
    const updated = await prisma.user.update({
      where: { userId },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });
    return this.mapUser(updated);
  }

  async createRefreshToken(data: {
    tokenHash: string;
    userId: string;
    familyId: string;
    expiresAt: Date;
    userAgentHash?: string | undefined;
  }): Promise<RefreshTokenModel> {
    const created = await prisma.refreshToken.create({
      data: {
        tokenHash: data.tokenHash,
        userId: data.userId,
        familyId: data.familyId,
        expiresAt: data.expiresAt,
        userAgentHash: data.userAgentHash ?? null,
      },
    });
    return this.mapRefreshToken(created);
  }

  async findRefreshTokenByHash(tokenHash: string): Promise<(RefreshTokenModel & { user: UserModel }) | null> {
    const row = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
    if (!row) return null;
    return {
      ...this.mapRefreshToken(row),
      user: this.mapUser(row.user),
    };
  }

  async rotateRefreshToken(
    oldTokenId: string,
    newTokenData: {
      tokenHash: string;
      userId: string;
      familyId: string;
      expiresAt: Date;
      userAgentHash?: string | undefined;
    }
  ): Promise<RefreshTokenModel> {
    return prisma.$transaction(async (tx) => {
      const newToken = await tx.refreshToken.create({
        data: {
          tokenHash: newTokenData.tokenHash,
          userId: newTokenData.userId,
          familyId: newTokenData.familyId,
          expiresAt: newTokenData.expiresAt,
          userAgentHash: newTokenData.userAgentHash ?? null,
        },
      });

      await tx.refreshToken.update({
        where: { refreshTokenId: oldTokenId },
        data: {
          revokedAt: new Date(),
          replacedById: newToken.refreshTokenId,
        },
      });

      return this.mapRefreshToken(newToken);
    });
  }

  async revokeFamily(familyId: string): Promise<number> {
    const res = await prisma.refreshToken.updateMany({
      where: {
        familyId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
    return res.count;
  }

  async revokeAllUserTokens(userId: string): Promise<number> {
    const res = await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
    return res.count;
  }

  async updatePassword(userId: string, newPasswordHash: string): Promise<UserModel> {
    const updated = await prisma.user.update({
      where: { userId },
      data: {
        passwordHash: newPasswordHash,
      },
    });
    return this.mapUser(updated);
  }

  async findManyUsers(params: UserListParams): Promise<UserModel[]> {
    const where: any = {};
    if (params.search) {
      where.email = { contains: params.search, mode: 'insensitive' };
    }
    if (params.role) {
      where.role = params.role;
    }
    if (params.isActive !== undefined) {
      where.isActive = params.isActive;
    }

    const rows = await prisma.user.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.orderByField]: params.orderDirection },
    });
    return rows.map((r) => this.mapUser(r));
  }

  async countUsers(params: Partial<UserListParams>): Promise<number> {
    const where: any = {};
    if (params.search) {
      where.email = { contains: params.search, mode: 'insensitive' };
    }
    if (params.role) {
      where.role = params.role;
    }
    if (params.isActive !== undefined) {
      where.isActive = params.isActive;
    }
    return prisma.user.count({ where });
  }

  async countActiveAdmins(): Promise<number> {
    return prisma.user.count({
      where: {
        role: 'ADMIN',
        isActive: true,
      },
    });
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
    role: 'ADMIN' | 'EDITOR';
    isActive?: boolean | undefined;
  }): Promise<UserModel> {
    const created = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        role: data.role,
        isActive: data.isActive ?? true,
      },
    });
    return this.mapUser(created);
  }

  async updateUser(
    userId: string,
    data: {
      email?: string | undefined;
      passwordHash?: string | undefined;
      role?: 'ADMIN' | 'EDITOR' | undefined;
      isActive?: boolean | undefined;
    }
  ): Promise<UserModel> {
    const updated = await prisma.user.update({
      where: { userId },
      data: {
        ...(data.email && { email: data.email.toLowerCase() }),
        ...(data.passwordHash && { passwordHash: data.passwordHash }),
        ...(data.role && { role: data.role }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
    return this.mapUser(updated);
  }

  async deleteUser(userId: string): Promise<UserModel> {
    const deleted = await prisma.user.delete({
      where: { userId },
    });
    return this.mapUser(deleted);
  }
}

export const authRepository = new AuthRepository();
