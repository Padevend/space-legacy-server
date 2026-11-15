import { appConfig } from '#config/app';

export class HealthSerializer {
  serializeLive(data: { status: 'ok'; uptimeSeconds: number; timestamp: string }) {
    return {
      status: data.status,
      uptimeSeconds: data.uptimeSeconds,
      timestamp: data.timestamp,
    };
  }

  serializeReady(data: { status: 'ready'; database: 'connected'; timestamp: string; latencyMs?: number }) {
    return {
      status: data.status,
      database: data.database,
      timestamp: data.timestamp,
      ...(appConfig.isProduction ? {} : { latencyMs: data.latencyMs }),
    };
  }
}

export const healthSerializer = new HealthSerializer();
