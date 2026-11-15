import { healthRepository, HealthRepository } from '../repositories/health_repository.js';
import { AppException } from '#exceptions/app_exception';

export class HealthService {
  constructor(private readonly repo: HealthRepository = healthRepository) {}

  getLiveness(): { status: 'ok'; uptimeSeconds: number; timestamp: string } {
    return {
      status: 'ok',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness(): Promise<{ status: 'ready'; database: 'connected'; timestamp: string; latencyMs?: number }> {
    const db = await this.repo.pingDatabase();

    if (!db.isHealthy) {
      throw AppException.serviceUnavailable('Database connection check failed.');
    }

    return {
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
      latencyMs: db.latencyMs,
    };
  }
}

export const healthService = new HealthService();
