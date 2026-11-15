import type { DashboardStatsModel } from '../models/dashboard.js';
import type { DashboardStatsDto } from '../validators/dashboard.js';

export class DashboardSerializer {
  serializeStats(stats: DashboardStatsModel): DashboardStatsDto {
    return {
      counts: stats.counts,
      storiesByStatus: stats.storiesByStatus,
      mediaAiCount: stats.mediaAiCount,
    };
  }
}

export const dashboardSerializer = new DashboardSerializer();
