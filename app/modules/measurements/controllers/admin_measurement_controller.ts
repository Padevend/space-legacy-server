import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { MeasurementService, measurementService } from '../services/measurement_service.js';
import { MeasurementSerializer, measurementSerializer } from '../serializers/measurement_serializer.js';
import { type CreateMeasurementRequestDto, type UpdateMeasurementRequestDto } from '../validators/measurement.js';

export class AdminMeasurementController {
  constructor(
    private readonly service: MeasurementService = measurementService,
    private readonly serializer: MeasurementSerializer = measurementSerializer
  ) {}

  store = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as CreateMeasurementRequestDto;

    const measurement = await this.service.create(body);
    const serialized = this.serializer.serializeMeasurement(measurement);

    return 'response' in ctxOrC
      ? ctxOrC.response.created(c, serialized, `/api/v1/measurements/${measurement.measurementId}`)
      : c.json({ success: true, data: serialized }, 201);
  };

  create = this.store;

  update = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';
    const body = ('body' in ctxOrC && ctxOrC.body ? ctxOrC.body : await c.req.json()) as UpdateMeasurementRequestDto;

    const updated = await this.service.update(id, body);
    const serialized = this.serializer.serializeMeasurement(updated);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  destroy = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const id = (('params' in ctxOrC && ctxOrC.params['id']) || c.req.param('id')) ?? '';

    await this.service.delete(id);
    return 'response' in ctxOrC
      ? ctxOrC.response.ok(c, { message: 'Measurement deleted successfully.' })
      : c.json({ success: true, data: { message: 'Measurement deleted successfully.' } }, 200);
  };

  delete = this.destroy;
}

export const adminMeasurementController = new AdminMeasurementController();
