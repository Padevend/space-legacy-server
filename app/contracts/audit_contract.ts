export interface AuditPayload {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  diff?: Record<string, any> | null;
  ipAddress?: string | null;
}

export interface AuditRecorder {
  record(payload: AuditPayload): Promise<void>;
}

export const AUDIT_RECORDER_TOKEN = Symbol('AuditRecorder');
