import { prisma } from '#infrastructure/database/prisma_client';
import type { AuditLogModel } from '../models/audit_log.js';

export interface AuditLogListParams {
  skip: number;
  take: number;
  actorId?: string | undefined;
  entity?: string | undefined;
  action?: string | undefined;
}

export class AuditRepository {
  private mapAuditLog(row: any): AuditLogModel {
    return {
      auditLogId: row.auditLogId,
      actorId: row.actorId,
      action: row.action,
      entity: row.entity,
      entityId: row.entityId,
      requestId: row.requestId,
      diffSummary: row.diffSummary,
      createdAt: row.createdAt,
    };
  }

  async findMany(params: AuditLogListParams): Promise<AuditLogModel[]> {
    const where: any = {};
    if (params.actorId) where.actorId = params.actorId;
    if (params.entity) where.entity = params.entity;
    if (params.action) where.action = params.action;

    const rows = await prisma.auditLog.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.mapAuditLog(r));
  }

  async count(params: Partial<AuditLogListParams>): Promise<number> {
    const where: any = {};
    if (params.actorId) where.actorId = params.actorId;
    if (params.entity) where.entity = params.entity;
    if (params.action) where.action = params.action;

    return prisma.auditLog.count({ where });
  }

  async create(data: {
    actorId?: string | null | undefined;
    action: string;
    entity: string;
    entityId?: string | null | undefined;
    requestId?: string | null | undefined;
    diffSummary?: any | undefined;
  }): Promise<AuditLogModel> {
    const created = await prisma.auditLog.create({
      data: {
        actorId: data.actorId ?? null,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId ?? 'SYSTEM',
        requestId: data.requestId ?? null,
        ...(data.diffSummary !== undefined && { diffSummary: data.diffSummary }),
      },
    });
    return this.mapAuditLog(created);
  }
}

export const auditRepository = new AuditRepository();
