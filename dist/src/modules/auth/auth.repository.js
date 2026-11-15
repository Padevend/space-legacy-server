import { prisma } from '../../core/database/prisma.js';
export class AuthRepository {
    async findUserByEmail(email) {
        return prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
    }
    async findUserById(userId) {
        return prisma.user.findUnique({
            where: { userId },
        });
    }
    async recordFailedLogin(userId, lockoutMinutes = 15) {
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
    async resetFailedLogin(userId) {
        return prisma.user.update({
            where: { userId },
            data: {
                failedLoginCount: 0,
                lockedUntil: null,
                lastLoginAt: new Date(),
            },
        });
    }
    async createRefreshToken(data) {
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
    async findRefreshTokenByHash(tokenHash) {
        return prisma.refreshToken.findUnique({
            where: { tokenHash },
            include: { user: true },
        });
    }
    async rotateRefreshToken(oldTokenId, newTokenData) {
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
    async revokeFamily(familyId) {
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
    async revokeAllUserTokens(userId) {
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
    async updatePassword(userId, newPasswordHash) {
        return prisma.user.update({
            where: { userId },
            data: {
                passwordHash: newPasswordHash,
            },
        });
    }
    async createAuditLog(data) {
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
