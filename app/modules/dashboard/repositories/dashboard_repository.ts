import { prismaClient, type ExtendedPrismaClient } from '#infrastructure/database/prisma_client';
import type { DashboardStatsModel } from '../models/dashboard.js';

export class DashboardRepository {
  constructor(private readonly prisma: ExtendedPrismaClient = prismaClient) {}

  async getStats(): Promise<DashboardStatsModel> {
    const [
      equipmentCount,
      missionCount,
      eventCount,
      storyCount,
      sourceCount,
      userCount,
      draftStories,
      reviewStories,
      publishedStories,
      archivedStories,
    ] = await Promise.all([
      this.prisma.equipment.count(),
      this.prisma.mission.count(),
      this.prisma.event.count(),
      this.prisma.story.count(),
      this.prisma.source.count(),
      this.prisma.user.count(),
      this.prisma.story.count({ where: { publicationStatus: 'DRAFT' } }),
      this.prisma.story.count({ where: { publicationStatus: 'REVIEW' } }),
      this.prisma.story.count({ where: { publicationStatus: 'PUBLISHED' } }),
      this.prisma.story.count({ where: { publicationStatus: 'ARCHIVED' } }),
    ]);

    return {
      counts: {
        equipment: equipmentCount,
        missions: missionCount,
        events: eventCount,
        stories: storyCount,
        media: 0,
        sources: sourceCount,
        users: userCount,
      },
      storiesByStatus: {
        draft: draftStories,
        review: reviewStories,
        published: publishedStories,
        archived: archivedStories,
      },
      mediaAiCount: 0,
    };
  }
}

export const dashboardRepository = new DashboardRepository();
