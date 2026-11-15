import { appConfig } from '../../../config/app.js';
export class HealthSerializer {
    serializeLive(data) {
        return {
            status: data.status,
            uptimeSeconds: data.uptimeSeconds,
            timestamp: data.timestamp,
        };
    }
    serializeReady(data) {
        return {
            status: data.status,
            database: data.database,
            timestamp: data.timestamp,
            ...(appConfig.isProduction ? {} : { latencyMs: data.latencyMs }),
        };
    }
}
export const healthSerializer = new HealthSerializer();
