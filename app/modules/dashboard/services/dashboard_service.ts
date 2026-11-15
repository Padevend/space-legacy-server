import { DashboardRepository, dashboardRepository } from '../repositories/dashboard_repository.js';
import type { DashboardStatsModel } from '../models/dashboard.js';

export class DashboardService {
  constructor(private readonly repo: DashboardRepository = dashboardRepository) {}

  async getStats(): Promise<DashboardStatsModel> {
    return this.repo.getStats();
  }
}

export const dashboardService = new DashboardService();
