import { container } from '#infrastructure/container/container';
import { DashboardRepository } from '../repositories/dashboard_repository.js';
import { DashboardService } from '../services/dashboard_service.js';
import { DashboardSerializer } from '../serializers/dashboard_serializer.js';
import { DashboardPolicy } from '../policies/dashboard_policy.js';
import { DashboardController } from '../controllers/dashboard_controller.js';

export class DashboardProvider {
  register(): void {
    const mod = container.forModule('dashboard');

    mod.singleton(DashboardRepository, () => new DashboardRepository());
    mod.singleton(DashboardSerializer, () => new DashboardSerializer());
    mod.singleton(DashboardPolicy, () => new DashboardPolicy());
    mod.singleton(DashboardService, () => new DashboardService(mod.make(DashboardRepository)));

    mod.bind(
      DashboardController,
      () => new DashboardController(mod.make(DashboardService), mod.make(DashboardSerializer))
    );
  }
}

export const dashboardProvider = new DashboardProvider();
