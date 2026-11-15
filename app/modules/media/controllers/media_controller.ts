import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { MediaService, mediaService } from '../services/media_service.js';
import { MediaSerializer, mediaSerializer } from '../serializers/media_serializer.js';
import { listMediaQuerySchema, getMediaQuerySchema } from '../validators/media.js';

export class MediaController {
  constructor(
    private readonly service: MediaService = mediaService,
    private readonly serializer: MediaSerializer = mediaSerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listMediaQuerySchema.parse(rawQuery);

    const { media, total } = await this.service.list(query);
    const data = media.map((m) => this.serializer.serializeMedia(m));

    return 'response' in ctxOrC
      ? ctxOrC.response.paginated(c, data, {
          page: query.page ?? 1,
          pageSize: query.pageSize ?? 20,
          total,
        })
      : c.json(
          {
            success: true,
            data,
            meta: { page: query.page ?? 1, pageSize: query.pageSize ?? 20, total },
          },
          200
        );
  };

  list = this.index;

  show = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = getMediaQuerySchema.parse(rawQuery);

    const item = await this.service.getById(id, query.include);
    const serialized = this.serializer.serializeMediaDetail(item);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  get = this.show;
}

export const mediaController = new MediaController();
