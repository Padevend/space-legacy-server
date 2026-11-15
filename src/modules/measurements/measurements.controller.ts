import type { Context } from 'hono';
import { measurementsService, type MeasurementsService } from './measurements.service.js';
import { measurementsSerializer, type MeasurementsSerializer } from './measurements.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import {
  listMeasurementsQuerySchema,
  getMeasurementQuerySchema,
  type CreateMeasurementRequestDto,
  type UpdateMeasurementRequestDto,
  type LinkMeasurementSourceRequestDto,
} from './measurements.schemas.js';

export class MeasurementsController {
  constructor(
    private readonly service: MeasurementsService = measurementsService,
    private readonly serializer: MeasurementsSerializer = measurementsSerializer
  ) {}

  list = async (c: Context): Promise<Response> => {
    const rawQuery = c.req.query();
    const query = listMeasurementsQuerySchema.parse(rawQuery);

    const { measurements, total } = await this.service.list(query);
    const data = measurements.map((m) => this.serializer.serializeMeasurement(m));

    return paginated(c, data, {
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 20,
      total,
    });
  };

  get = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const rawQuery = c.req.query();
    const query = getMeasurementQuerySchema.parse(rawQuery);

    const measurement = await this.service.getByIdWithIncludes(id, query.include);
    const serialized = this.serializer.serializeMeasurementDetail(measurement);

    return ok(c, serialized);
  };

  create = async (c: Context): Promise<Response> => {
    const body = (await c.req.json()) as CreateMeasurementRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const measurement = await this.service.create(body, { actorId, requestId });
    const serialized = this.serializer.serializeMeasurement(measurement);

    return created(c, serialized, `/api/v1/measurements/${measurement.measurementId}`);
  };

  update = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const body = (await c.req.json()) as UpdateMeasurementRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    const updated = await this.service.update(id, body, { actorId, requestId });
    const serialized = this.serializer.serializeMeasurement(updated);

    return ok(c, serialized);
  };

  delete = async (c: Context): Promise<Response> => {
    const user = c.get('user');
    if (!user || user.role !== 'ADMIN') {
      throw AppException.forbidden('Admin role required to delete a measurement.');
    }

    const id = c.req.param('id') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.delete(id, { actorId, requestId });
    return ok(c, { message: 'Measurement deleted successfully.' });
  };

  // Relations
  linkSource = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const sourceId = c.req.param('sourceId') as string;
    const body = (await c.req.json()) as LinkMeasurementSourceRequestDto;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.linkSource(id, sourceId, body.claimDescription, { actorId, requestId });
    return ok(c, { message: 'Source linked to measurement successfully.' });
  };

  unlinkSource = async (c: Context): Promise<Response> => {
    const id = c.req.param('id') as string;
    const sourceId = c.req.param('sourceId') as string;
    const actorId = c.get('userId') || 'system';
    const requestId = c.get('requestId') || 'unknown';

    await this.service.unlinkSource(id, sourceId, { actorId, requestId });
    return ok(c, { message: 'Source unlinked from measurement successfully.' });
  };
}

export const measurementsController = new MeasurementsController();
