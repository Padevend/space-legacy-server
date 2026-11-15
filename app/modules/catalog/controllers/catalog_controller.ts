import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { CatalogService, catalogService } from '../services/catalog_service.js';
import { CatalogSerializer, catalogSerializer } from '../serializers/catalog_serializer.js';

export class CatalogController {
  constructor(
    private readonly service: CatalogService = catalogService,
    private readonly serializer: CatalogSerializer = catalogSerializer
  ) {}

  feed = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const feed = await this.service.getFeed();
    const data = this.serializer.serializeFeed(feed);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, data) : c.json({ success: true, data }, 200);
  };

  destinations = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const destinations = await this.service.getDestinations();
    const data = destinations.map((d) => this.serializer.serializeDestination(d));

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, data) : c.json({ success: true, data }, 200);
  };

  equipmentDetail = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const idOrSlug =
      (('params' in ctxOrC && ctxOrC.params['idOrSlug']) || c.req.param('idOrSlug') || c.req.param('id')) ?? '';

    const detail = await this.service.getEquipmentDetail(idOrSlug);
    const data = this.serializer.serializeEquipmentDetail(detail);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, data) : c.json({ success: true, data }, 200);
  };
}

export const catalogController = new CatalogController();
