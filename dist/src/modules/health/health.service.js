import { healthRepository, HealthRepository } from './health.repository.js';
import { AppException } from '../../core/exceptions/AppException.js';
export class HealthService {
    repo;
    constructor(repo = healthRepository) {
        this.repo = repo;
    }
    getLiveness() {
        return {
            status: 'ok',
            uptimeSeconds: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
        };
    }
    async getReadiness() {
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
