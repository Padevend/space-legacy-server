import { prisma } from '#infrastructure/database/prisma_client';
import type { DashboardOverviewModel } from '../models/dashboard.js';

export class DashboardRepository {
  async getOverview(): Promise<DashboardOverviewModel> {
    const [
      totalMachines,
      publishedMachines,
      totalBodies,
      publishedBodies,
      totalLogbook,
      publishedLogbook,
      totalQuizzes,
      publishedQuizzes,
      latestIngestionBatch,
      failedJobs,
      unpublishedMachines,
      unpublishedLogbook,
    ] = await Promise.all([
      prisma.machine.count(),
      prisma.machine.count({ where: { isPublished: true } }),
      prisma.celestialBody.count(),
      prisma.celestialBody.count({ where: { isPublished: true } }),
      prisma.logbookEntry.count(),
      prisma.logbookEntry.count({ where: { isPublished: true } }),
      prisma.quiz.count(),
      prisma.quiz.count({ where: { isPublished: true } }),
      prisma.ingestionBatch.findFirst({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          filename: true,
          status: true,
          createdAt: true,
          finishedAt: true,
        },
      }),
      prisma.generationJob.count({ where: { status: 'FAILED' } }),
      prisma.machine.findMany({
        where: { isPublished: false },
        select: { id: true, slug: true, name: true },
        take: 10,
      }),
      prisma.logbookEntry.findMany({
        where: { isPublished: false },
        select: { id: true, slug: true, title: true },
        take: 10,
      }),
    ]);

    return {
      counters: {
        machines: {
          total: totalMachines,
          published: publishedMachines,
          unpublished: totalMachines - publishedMachines,
        },
        celestialBodies: {
          total: totalBodies,
          published: publishedBodies,
          unpublished: totalBodies - publishedBodies,
        },
        logbook: {
          total: totalLogbook,
          published: publishedLogbook,
          unpublished: totalLogbook - publishedLogbook,
        },
        quizzes: {
          total: totalQuizzes,
          published: publishedQuizzes,
          unpublished: totalQuizzes - publishedQuizzes,
        },
      },
      latestIngestion: latestIngestionBatch,
      failedJobsCount: failedJobs,
      unpublishedContent: {
        machines: unpublishedMachines,
        logbook: unpublishedLogbook,
      },
    };
  }
}

export const dashboardRepository = new DashboardRepository();
