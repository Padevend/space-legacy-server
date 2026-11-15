import type { AuditLogModel } from '../models/audit_log.js';

export class AuditLogSerializer {
  serialize(item: AuditLogModel) {
    return {
      auditLogId: item.auditLogId,
      actorId: item.actorId,
      action: item.action,
      entity: item.entity,
      entityId: item.entityId,
      requestId: item.requestId,
      diffSummary: item.diffSummary,
      createdAt: item.createdAt.toISOString(),
    };
  }

  serializeList(items: AuditLogModel[]) {
    return items.map((i) => this.serialize(i));
  }
}

export const auditLogSerializer = new AuditLogSerializer();
