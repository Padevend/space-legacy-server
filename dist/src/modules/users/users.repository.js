import { prisma } from '../../core/database/prisma.js';
export class UsersRepository {
    buildWhere(params) {
        const where = {};
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
    async findMany(params) {
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
    async count(params) {
        const where = this.buildWhere(params);
        return prisma.user.count({ where });
    }
    async findById(userId) {
        return prisma.user.findUnique({
            where: { userId },
        });
    }
    async findByEmail(email) {
        return prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
    }
    async countActiveAdmins() {
        return prisma.user.count({
            where: {
                role: 'ADMIN',
                isActive: true,
            },
        });
    }
    async create(data) {
        return prisma.user.create({
            data: {
                email: data.email.toLowerCase(),
                passwordHash: data.passwordHash,
                role: data.role,
                isActive: data.isActive ?? true,
            },
        });
    }
    async update(userId, data) {
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
    async delete(userId) {
        return prisma.user.delete({
            where: { userId },
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
export const usersRepository = new UsersRepository();
