import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { AuditService, auditService } from '../services/audit_service.js';
import { AuditLogSerializer, auditLogSerializer } from '../serializers/audit_log_serializer.js';
import { listAuditLogsQuerySchema } from '../validators/audit_log.js';

export class AdminAuditController {
  constructor(
    private readonly service: AuditService = auditService,
    private readonly serializer: AuditLogSerializer = auditLogSerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listAuditLogsQuerySchema.parse(rawQuery);

    const result = await this.service.list(query);
    const serialized = this.serializer.serializeList(result.items);

    return 'response' in ctxOrC
      ? ctxOrC.response.paginated(c, serialized, {
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
        })
      : c.json(
          {
            success: true,
            data: serialized,
            meta: { page: result.page, pageSize: result.pageSize, total: result.total },
          },
          200
        );
  };

  list = this.index;
}

export const adminAuditController = new AdminAuditController();
