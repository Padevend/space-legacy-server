import { checkDatabaseHealth } from '../../core/database/health.js';
export class HealthRepository {
    async pingDatabase() {
        return checkDatabaseHealth();
    }
}
export const healthRepository = new HealthRepository();
