import type { PrismaClient, Prisma } from '@prisma/client';
import { prisma as defaultPrisma } from '#infrastructure/database/prisma_client';
import type { AccountRole } from '#shared/enums';

export class IdentityRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient ?? defaultPrisma;
  }

  private client(tx?: Prisma.TransactionClient) {
    return tx ?? this.prisma;
  }

  // --- VISITOR ---

  async createVisitor(tx?: Prisma.TransactionClient) {
    return this.client(tx).visitor.create({
      data: {},
    });
  }

  async findVisitorById(id: string, tx?: Prisma.TransactionClient) {
    return this.client(tx).visitor.findUnique({
      where: { id },
      include: {
        account: true,
      },
    });
  }

  async touchVisitor(id: string, tx?: Prisma.TransactionClient) {
    return this.client(tx).visitor.update({
      where: { id },
      data: { lastSeenAt: new Date() },
    });
  }

  async deleteVisitorCascade(id: string, tx?: Prisma.TransactionClient) {
    return this.client(tx).visitor.delete({
      where: { id },
    });
  }

  // --- SESSION ---

  async createSession(data: { visitorId: string; tokenHash: string; expiresAt: Date }, tx?: Prisma.TransactionClient) {
    return this.client(tx).session.create({
      data: {
        visitorId: data.visitorId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findSessionByTokenHash(tokenHash: string, tx?: Prisma.TransactionClient) {
    return this.client(tx).session.findUnique({
      where: { tokenHash },
      include: {
        visitor: {
          include: {
            account: true,
          },
        },
      },
    });
  }

  async touchSession(sessionId: string, expiresAt: Date, tx?: Prisma.TransactionClient) {
    return this.client(tx).session.update({
      where: { id: sessionId },
      data: {
        lastUsedAt: new Date(),
        expiresAt,
      },
    });
  }

  async deleteSession(sessionId: string, tx?: Prisma.TransactionClient) {
    return this.client(tx).session.delete({
      where: { id: sessionId },
    });
  }

  async deleteSessionsByVisitorId(visitorId: string, tx?: Prisma.TransactionClient) {
    return this.client(tx).session.deleteMany({
      where: { visitorId },
    });
  }

  // --- ACCOUNT ---

  async findAccountByEmail(email: string, tx?: Prisma.TransactionClient) {
    return this.client(tx).account.findUnique({
      where: { email },
      include: {
        visitor: true,
      },
    });
  }

  async findAccountByVisitorId(visitorId: string, tx?: Prisma.TransactionClient) {
    return this.client(tx).account.findUnique({
      where: { visitorId },
    });
  }

  async createAccount(
    data: {
      visitorId: string;
      email: string;
      passwordHash: string;
      displayName: string;
      role?: AccountRole;
    },
    tx?: Prisma.TransactionClient
  ) {
    return this.client(tx).account.create({
      data: {
        visitorId: data.visitorId,
        email: data.email,
        passwordHash: data.passwordHash,
        displayName: data.displayName,
        ...(data.role ? { role: data.role } : {}),
      },
    });
  }

  async updateAccount(
    accountId: string,
    data: {
      email?: string;
      displayName?: string;
      passwordHash?: string;
    },
    tx?: Prisma.TransactionClient
  ) {
    const updatePayload: Prisma.AccountUpdateInput = {};
    if (data.email !== undefined) updatePayload.email = data.email;
    if (data.displayName !== undefined) updatePayload.displayName = data.displayName;
    if (data.passwordHash !== undefined) updatePayload.passwordHash = data.passwordHash;

    return this.client(tx).account.update({
      where: { id: accountId },
      data: updatePayload,
    });
  }

  async mergeAndCleanAnonymousVisitor(
    fromVisitorId: string,
    toVisitorId: string,
    onMergeTx: (tx: Prisma.TransactionClient) => Promise<void>
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await onMergeTx(tx);
      await tx.visitor.delete({ where: { id: fromVisitorId } }).catch(() => {});
    });
  }
}

export const identityRepository = new IdentityRepository();
