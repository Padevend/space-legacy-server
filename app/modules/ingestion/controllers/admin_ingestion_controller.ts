import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { ingestionService, IngestionService } from '../services/ingestion_service.js';
import { jsonSuccess } from '#shared/http';
import { AppException } from '#exceptions/app_exception';

export class AdminIngestionController {
  private service: IngestionService;

  constructor(service?: IngestionService) {
    this.service = service instanceof IngestionService ? service : ingestionService;
  }

  spec = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const spec = this.service.getSpecification();
    return jsonSuccess(c, { spec });
  };

  template = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const buffer = this.service.generateTemplateZip();

    c.header('Content-Type', 'application/zip');
    c.header('Content-Disposition', 'attachment; filename="bundle-template.zip"');
    c.header('Content-Length', buffer.length.toString());

    return c.body(buffer as any);
  };

  validate = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const user = c.get('user') as any;
    const { buffer, filename } = await this.extractUpload(c);

    const result = await this.service.validateBundle(buffer, filename, user?.userId);
    return jsonSuccess(c, result);
  };

  importBundle = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const user = c.get('user') as any;
    const { buffer, filename } = await this.extractUpload(c);

    const result = await this.service.commitBundle(buffer, filename, user?.userId);
    return jsonSuccess(c, result, 201);
  };

  show = async (ctxOrC: HttpContext | Context) => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const params = 'params' in ctxOrC ? ctxOrC.params : c.req.param();
    const id = (params['id'] || c.req.param('id')) as string;

    const batch = await this.service.getBatchById(id);
    return jsonSuccess(c, { batch });
  };

  private async extractUpload(c: Context): Promise<{ buffer: Buffer; filename: string }> {
    const contentType = c.req.header('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const parsedBody = await c.req.parseBody();
      const fileEntry = parsedBody['file'];

      if (!fileEntry) {
        throw AppException.badRequest("Multipart form-data must contain a 'file' field.");
      }

      if (typeof fileEntry === 'string') {
        throw AppException.badRequest("Uploaded 'file' must be a binary file, not text.");
      }

      const file = fileEntry as File;
      const arrayBuffer = await file.arrayBuffer();
      return {
        buffer: Buffer.from(arrayBuffer),
        filename: file.name || 'bundle.zip',
      };
    }

    // Binary / raw payload fallback
    const arrayBuffer = await c.req.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw AppException.badRequest('Empty upload body received.');
    }

    return {
      buffer: Buffer.from(arrayBuffer),
      filename: c.req.header('x-filename') || 'bundle.zip',
    };
  }
}

export const adminIngestionController = new AdminIngestionController();
