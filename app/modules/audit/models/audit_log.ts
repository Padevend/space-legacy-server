export interface AuditLogModel {
  auditLogId: string;
  actorId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  requestId: string | null;
  diffSummary: any | null;
  createdAt: Date;
}
