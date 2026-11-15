import type { HttpContext } from '#infrastructure/http/http_context';
import type { Context } from 'hono';
import { MeasurementService, measurementService } from '../services/measurement_service.js';
import { MeasurementSerializer, measurementSerializer } from '../serializers/measurement_serializer.js';
import { listMeasurementsQuerySchema, getMeasurementQuerySchema } from '../validators/measurement.js';

export class MeasurementController {
  constructor(
    private readonly service: MeasurementService = measurementService,
    private readonly serializer: MeasurementSerializer = measurementSerializer
  ) {}

  index = async (ctxOrC: HttpContext | Context): Promise<Response> => {
    const c = 'c' in ctxOrC ? ctxOrC.c : ctxOrC;
    const rawQuery = 'query' in ctxOrC && Object.keys(ctxOrC.query).length > 0 ? ctxOrC.query : c.req.query();
    const query = listMeasurementsQuerySchema.parse(rawQuery);

    const { measurements, total } = await this.service.list(query);
    const data = measurements.map((m) => this.serializer.serializeMeasurement(m));

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
    const query = getMeasurementQuerySchema.parse(rawQuery);

    const item = await this.service.getByIdWithIncludes(id, query.include);
    const serialized = this.serializer.serializeMeasurementDetail(item);

    return 'response' in ctxOrC ? ctxOrC.response.ok(c, serialized) : c.json({ success: true, data: serialized }, 200);
  };

  get = this.show;
}

export const measurementController = new MeasurementController();
