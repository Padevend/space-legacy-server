import { container } from '#infrastructure/container/container';
import { AUDIT_RECORDER_TOKEN, type AuditRecorder, type AuditPayload } from '#contracts/audit_contract';
import { AuditRepository } from '../repositories/audit_repository.js';
import { AuditService } from '../services/audit_service.js';
import { AuditLogSerializer } from '../serializers/audit_log_serializer.js';
import { AuditPolicy } from '../policies/audit_policy.js';
import { AdminAuditController } from '../controllers/admin_audit_controller.js';

export class AuditProvider {
  register(): void {
    const mod = container.forModule('audit');

    mod.singleton(AuditRepository, () => new AuditRepository());
    mod.singleton(AuditLogSerializer, () => new AuditLogSerializer());
    mod.singleton(AuditPolicy, () => new AuditPolicy());
    mod.singleton(AuditService, () => new AuditService(mod.make(AuditRepository)));
    mod.bind(
      AdminAuditController,
      () => new AdminAuditController(mod.make(AuditService), mod.make(AuditLogSerializer))
    );

    // Bind AuditRecorder contract implementation in root container
    container.singleton<AuditRecorder>(AUDIT_RECORDER_TOKEN, () => ({
      record: async (payload: AuditPayload) => {
        const service = mod.make(AuditService);
        await service.record({
          actorId: payload.actorId,
          action: payload.action,
          entity: payload.entity,
          entityId: payload.entityId,
          diffSummary: payload.diff,
        });
      },
    }));
  }
}

export const auditProvider = new AuditProvider();
