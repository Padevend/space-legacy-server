import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { LocationService, locationService } from '../services/location_service.js';
import { LocationSerializer, locationSerializer } from '../serializers/location_serializer.js';
import {
  type CreateLocationRequestDto,
  type UpdateLocationRequestDto,
  type LinkEquipmentLocationDto,
} from '../validators/location.js';

export class AdminLocationController {
  constructor(
    private readonly service: LocationService = locationService,
    private readonly serializer: LocationSerializer = locationSerializer
  ) {}

  store = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as CreateLocationRequestDto;

    const createdItem = await this.service.create(body);
    const serialized = this.serializer.serializeLocation(createdItem);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized, `/api/v1/locations/${createdItem.locationId}`)
      : c.json({ success: true, data: serialized }, 201);
  };

  create = this.store;

  update = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as UpdateLocationRequestDto;

    const updated = await this.service.update(id, body);
    const serialized = this.serializer.serializeLocation(updated);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  destroy = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';

    await this.service.delete(id);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Location deleted successfully.' })
      : c.json({ success: true, data: { message: 'Location deleted successfully.' } }, 200);
  };

  delete = this.destroy;

  linkEquipment = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const equipmentId =
      (('params' in ctxOrC && ctxOrC.params['equipmentId']) || c.req.param('equipmentId') || c.req.param('id')) ?? '';
    const paramLocationId = (('params' in ctxOrC && ctxOrC.params['locationId']) || c.req.param('locationId')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as LinkEquipmentLocationDto;
    if (paramLocationId && !body.locationId) {
      body.locationId = paramLocationId;
    }

    const link = await this.service.linkEquipment(equipmentId, body);
    const serialized = this.serializer.serializeEquipmentLocation(link);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  unlinkEquipment = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const equipmentId =
      (('params' in ctxOrC && ctxOrC.params['equipmentId']) || c.req.param('equipmentId') || c.req.param('id')) ?? '';
    const locationId =
      (('params' in ctxOrC && ctxOrC.params['locationId']) ||
        c.req.param('locationId') ||
        c.req.param('equipmentLocationId')) ??
      '';

    await this.service.unlinkEquipment(equipmentId, locationId);

    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Equipment location link unlinked successfully.' })
      : c.json({ success: true, data: { message: 'Equipment location link unlinked successfully.' } }, 200);
  };
}

export const adminLocationController = new AdminLocationController();
