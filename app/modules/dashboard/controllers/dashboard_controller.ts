import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { dashboardService, DashboardService } from '../services/dashboard_service.js';
import { jsonSuccess } from '#shared/http';

export class DashboardController {
  private service: DashboardService;

  constructor(service?: DashboardService) {
    this.service = service instanceof DashboardService ? service : dashboardService;
  }

  overview = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const overview = await this.service.getOverview();
    return jsonSuccess(c, { overview });
  };
}

export const dashboardController = new DashboardController();
