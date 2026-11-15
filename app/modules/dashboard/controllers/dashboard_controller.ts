import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { DashboardService, dashboardService } from '../services/dashboard_service.js';
import { DashboardSerializer, dashboardSerializer } from '../serializers/dashboard_serializer.js';

export class DashboardController {
  constructor(
    private readonly service: DashboardService = dashboardService,
    private readonly serializer: DashboardSerializer = dashboardSerializer
  ) {}

  stats = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const stats = await this.service.getStats();
    const data = this.serializer.serializeStats(stats);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, data) : c.json({ success: true, data }, 200);
  };
}

export const dashboardController = new DashboardController();
