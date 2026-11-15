import { AuditRepository, auditRepository } from '../repositories/audit_repository.js';
import type { AuditLogModel } from '../models/audit_log.js';
import type { ListAuditLogsQueryDto } from '../validators/audit_log.js';

export class AuditService {
  constructor(private readonly repo: AuditRepository = auditRepository) {}

  async list(
    query: ListAuditLogsQueryDto
  ): Promise<{ items: AuditLogModel[]; total: number; page: number; pageSize: number }> {
    const page = query.page;
    const pageSize = query.pageSize;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this.repo.findMany({
        skip,
        take: pageSize,
        actorId: query.actorId,
        entity: query.entity,
        action: query.action,
      }),
      this.repo.count({
        actorId: query.actorId,
        entity: query.entity,
        action: query.action,
      }),
    ]);

    return { items, total, page, pageSize };
  }

  async record(data: {
    actorId?: string | null | undefined;
    action: string;
    entity: string;
    entityId?: string | null | undefined;
    requestId?: string | null | undefined;
    diffSummary?: any | undefined;
  }): Promise<AuditLogModel> {
    return this.repo.create(data);
  }
}

export const auditService = new AuditService();
