import { dashboardRepository, DashboardRepository } from '../repositories/dashboard_repository.js';
import type { DashboardOverviewModel } from '../models/dashboard.js';

export class DashboardService {
  constructor(private repo: DashboardRepository = dashboardRepository) {}

  async getOverview(): Promise<DashboardOverviewModel> {
    return this.repo.getOverview();
  }
}

export const dashboardService = new DashboardService();
