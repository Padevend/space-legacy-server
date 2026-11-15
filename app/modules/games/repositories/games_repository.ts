import type { PrismaClient, Prisma } from '@prisma/client';
import { prisma as defaultPrisma } from '#infrastructure/database/prisma_client';
import type { ListQuizzesQuery } from '../validators/quiz.js';

export class GamesRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient ?? defaultPrisma;
  }

  private client(tx?: Prisma.TransactionClient) {
    return tx ?? this.prisma;
  }

  async executeTransaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }

  // --- QUIZZES ---

  async findPublishedQuizzes(filter: ListQuizzesQuery) {
    const where: Prisma.QuizWhereInput = {
      isPublished: true,
    };

    if (filter.level) {
      where.level = filter.level;
    }
    if (filter.body) {
      where.body = { slug: filter.body };
    }
    if (filter.machine) {
      where.machine = { slug: filter.machine };
    }

    return this.prisma.quiz.findMany({
      where,
      include: {
        body: { select: { id: true, slug: true, name: true } },
        machine: { select: { id: true, slug: true, name: true } },
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublishedQuizBySlug(slug: string) {
    return this.prisma.quiz.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        body: { select: { id: true, slug: true, name: true } },
        machine: { select: { id: true, slug: true, name: true } },
        questions: {
          orderBy: { sortOrder: 'asc' },
          include: {
            options: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  }

  // --- ATTEMPTS ---

  async createAttemptWithAnswers(
    data: {
      visitorId: string;
      quizId: string;
      score: number;
      maxScore: number;
      answers: Array<{
        questionId: string;
        optionId: string;
        isCorrect: boolean;
      }>;
    },
    tx?: Prisma.TransactionClient
  ) {
    const db = this.client(tx);

    const attempt = await db.quizAttempt.create({
      data: {
        visitorId: data.visitorId,
        quizId: data.quizId,
        score: data.score,
        maxScore: data.maxScore,
        answers: {
          create: data.answers.map((a) => ({
            questionId: a.questionId,
            optionId: a.optionId,
            isCorrect: a.isCorrect,
          })),
        },
      },
      include: {
        answers: true,
        quiz: true,
      },
    });

    return attempt;
  }

  async getVisitorAttempts(visitorId: string, tx?: Prisma.TransactionClient) {
    return this.client(tx).quizAttempt.findMany({
      where: { visitorId },
      include: {
        quiz: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVisitorStats(visitorId: string, tx?: Prisma.TransactionClient) {
    const db = this.client(tx);
    const attempts = await db.quizAttempt.findMany({
      where: { visitorId },
      select: {
        quizId: true,
        score: true,
        maxScore: true,
      },
    });

    const totalAttempts = attempts.length;
    const completedQuizIds = new Set(attempts.map((a) => a.quizId));
    const perfectScoresCount = attempts.filter((a) => a.score === a.maxScore && a.maxScore > 0).length;

    return {
      totalAttempts,
      completedQuizzesCount: completedQuizIds.size,
      perfectScoresCount,
      completedQuizIds,
    };
  }

  // --- BADGES ---

  async findAllBadges(tx?: Prisma.TransactionClient) {
    return this.client(tx).badge.findMany({
      include: {
        body: { select: { id: true, slug: true, name: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findVisitorBadges(visitorId: string, tx?: Prisma.TransactionClient) {
    return this.client(tx).visitorBadge.findMany({
      where: { visitorId },
      include: {
        badge: {
          include: {
            body: { select: { id: true, slug: true, name: true } },
          },
        },
      },
      orderBy: { earnedAt: 'asc' },
    });
  }

  async awardBadge(visitorId: string, badgeId: string, earnedAt: Date = new Date(), tx?: Prisma.TransactionClient) {
    const db = this.client(tx);

    return db.visitorBadge.upsert({
      where: {
        visitorId_badgeId: {
          visitorId,
          badgeId,
        },
      },
      update: {},
      create: {
        visitorId,
        badgeId,
        earnedAt,
      },
      include: {
        badge: true,
      },
    });
  }

  // --- MERGE LISTENER ---

  async mergeVisitorGamesData(fromId: string, toId: string, tx: Prisma.TransactionClient): Promise<void> {
    // 1. Reassign quiz attempts
    await tx.quizAttempt.updateMany({
      where: { visitorId: fromId },
      data: { visitorId: toId },
    });

    // 2. Merge badges (union, keeping earliest earnedAt)
    const fromBadges = await tx.visitorBadge.findMany({
      where: { visitorId: fromId },
    });

    const toBadges = await tx.visitorBadge.findMany({
      where: { visitorId: toId },
    });

    const toBadgeMap = new Map(toBadges.map((b) => [b.badgeId, b.earnedAt]));

    for (const fb of fromBadges) {
      const existingDate = toBadgeMap.get(fb.badgeId);
      if (!existingDate) {
        // Transfer badge to toId
        await tx.visitorBadge.create({
          data: {
            visitorId: toId,
            badgeId: fb.badgeId,
            earnedAt: fb.earnedAt,
          },
        });
      } else if (fb.earnedAt < existingDate) {
        // Keep earliest earnedAt
        await tx.visitorBadge.update({
          where: {
            visitorId_badgeId: {
              visitorId: toId,
              badgeId: fb.badgeId,
            },
          },
          data: { earnedAt: fb.earnedAt },
        });
      }
    }

    // 3. Delete fromId visitor badges
    await tx.visitorBadge.deleteMany({
      where: { visitorId: fromId },
    });
  }
}

export const gamesRepository = new GamesRepository();
