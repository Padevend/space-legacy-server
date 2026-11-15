import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { dashboardService, DashboardService } from '../services/dashboard_service.js';
import { jsonSuccess } from '#shared/http';

export class DashboardController {
  private service: DashboardService;
  private cachedHtml: string | null = null;

  constructor(service?: DashboardService) {
    this.service = service instanceof DashboardService ? service : dashboardService;
  }

  overview = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const overview = await this.service.getOverview();
    return jsonSuccess(c, { overview });
  };

  serveUi = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    if (!this.cachedHtml || process.env.NODE_ENV !== 'production') {
      const htmlPath = resolve(process.cwd(), 'dashboard/index.html');
      if (existsSync(htmlPath)) {
        this.cachedHtml = readFileSync(htmlPath, 'utf-8');
      } else {
        this.cachedHtml = '<!DOCTYPE html><html><body><h1>Space Legacy Mission Control</h1></body></html>';
      }
    }
    return c.html(this.cachedHtml);
  };
}

export const dashboardController = new DashboardController();
