import { container } from '#infrastructure/container/container';
import { DashboardRepository, dashboardRepository } from '../repositories/dashboard_repository.js';
import { DashboardService } from '../services/dashboard_service.js';
import { DashboardController } from '../controllers/dashboard_controller.js';

export class DashboardProvider {
  register(): void {
    const mod = container.forModule('dashboard');
    mod.singleton(DashboardRepository, () => dashboardRepository);
    mod.singleton(DashboardService, () => new DashboardService(mod.make(DashboardRepository)));
    mod.bind(DashboardController, () => new DashboardController(mod.make(DashboardService)));
  }
}

export const dashboardProvider = new DashboardProvider();
