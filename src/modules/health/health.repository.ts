import { checkDatabaseHealth, type DatabaseHealthResult } from '../../core/database/health.js';

export class HealthRepository {
  async pingDatabase(): Promise<DatabaseHealthResult> {
    return checkDatabaseHealth();
  }
}

export const healthRepository = new HealthRepository();
