import type { MiddlewareHandler } from 'hono';
import { container } from '#infrastructure/container/container';
import { AUDIT_RECORDER_TOKEN, type AuditRecorder } from '#contracts/audit_contract';
import { logger } from '#infrastructure/logger/logger';

export const auditMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    await next();

    const method = c.req.method;
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    const isSuccess = c.res.status >= 200 && c.res.status < 300;

    if (isMutation && isSuccess && container.has(AUDIT_RECORDER_TOKEN)) {
      try {
        const recorder = container.make<AuditRecorder>(AUDIT_RECORDER_TOKEN);
        const path = c.req.path;
        const actorId = (c.get('userId') as string) || null;
        const clientIp = (c.get('clientIp') as string) || null;

        const pathParts = path.replace(/^\/api\/v1\/(?:admin\/)?/, '').split('/');
        const entity = pathParts[0] || 'unknown';
        const entityId = pathParts[1] || null;

        await recorder.record({
          actorId,
          action: `${method}_${entity.toUpperCase()}`,
          entity,
          entityId,
          ipAddress: clientIp,
        });
      } catch (err) {
        logger.warn({ err }, 'Audit middleware recording encountered an error.');
      }
    }
  };
};
