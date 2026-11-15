import { prisma } from '../../core/database/prisma.js';
import type { User, RefreshToken, Prisma } from '@prisma/client';

export class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findUserById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { userId },
    });
  }

  async recordFailedLogin(userId: string, lockoutMinutes = 15): Promise<User> {
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const newCount = user.failedLoginCount + 1;
    const shouldLock = newCount >= 5;
    const lockedUntil = shouldLock ? new Date(Date.now() + lockoutMinutes * 60 * 1000) : user.lockedUntil;

    return prisma.user.update({
      where: { userId },
      data: {
        failedLoginCount: newCount,
        lockedUntil,
      },
    });
  }

  async resetFailedLogin(userId: string): Promise<User> {
    return prisma.user.update({
      where: { userId },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });
  }

  async createRefreshToken(data: {
    tokenHash: string;
    userId: string;
    familyId: string;
    expiresAt: Date;
    userAgentHash?: string | undefined;
  }): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        tokenHash: data.tokenHash,
        userId: data.userId,
        familyId: data.familyId,
        expiresAt: data.expiresAt,
        userAgentHash: data.userAgentHash ?? null,
      },
    });
  }

  async findRefreshTokenByHash(tokenHash: string): Promise<(RefreshToken & { user: User }) | null> {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
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
  ): Promise<RefreshToken> {
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

      return newToken;
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

  async updatePassword(userId: string, newPasswordHash: string): Promise<User> {
    return prisma.user.update({
      where: { userId },
      data: {
        passwordHash: newPasswordHash,
      },
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

export const authRepository = new AuthRepository();
