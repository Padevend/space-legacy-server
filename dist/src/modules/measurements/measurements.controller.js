import { measurementsService } from './measurements.service.js';
import { measurementsSerializer } from './measurements.serializer.js';
import { ok, created, paginated } from '../../core/http/response.js';
import { AppException } from '../../core/exceptions/AppException.js';
import { listMeasurementsQuerySchema, getMeasurementQuerySchema, } from './measurements.schemas.js';
export class MeasurementsController {
    service;
    serializer;
    constructor(service = measurementsService, serializer = measurementsSerializer) {
        this.service = service;
        this.serializer = serializer;
    }
    list = async (c) => {
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
    get = async (c) => {
        const id = c.req.param('id');
        const rawQuery = c.req.query();
        const query = getMeasurementQuerySchema.parse(rawQuery);
        const measurement = await this.service.getByIdWithIncludes(id, query.include);
        const serialized = this.serializer.serializeMeasurementDetail(measurement);
        return ok(c, serialized);
    };
    create = async (c) => {
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const measurement = await this.service.create(body, { actorId, requestId });
        const serialized = this.serializer.serializeMeasurement(measurement);
        return created(c, serialized, `/api/v1/measurements/${measurement.measurementId}`);
    };
    update = async (c) => {
        const id = c.req.param('id');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        const updated = await this.service.update(id, body, { actorId, requestId });
        const serialized = this.serializer.serializeMeasurement(updated);
        return ok(c, serialized);
    };
    delete = async (c) => {
        const user = c.get('user');
        if (!user || user.role !== 'ADMIN') {
            throw AppException.forbidden('Admin role required to delete a measurement.');
        }
        const id = c.req.param('id');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.delete(id, { actorId, requestId });
        return ok(c, { message: 'Measurement deleted successfully.' });
    };
    // Relations
    linkSource = async (c) => {
        const id = c.req.param('id');
        const sourceId = c.req.param('sourceId');
        const body = (await c.req.json());
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.linkSource(id, sourceId, body.claimDescription, { actorId, requestId });
        return ok(c, { message: 'Source linked to measurement successfully.' });
    };
    unlinkSource = async (c) => {
        const id = c.req.param('id');
        const sourceId = c.req.param('sourceId');
        const actorId = c.get('userId') || 'system';
        const requestId = c.get('requestId') || 'unknown';
        await this.service.unlinkSource(id, sourceId, { actorId, requestId });
        return ok(c, { message: 'Source unlinked from measurement successfully.' });
    };
}
export const measurementsController = new MeasurementsController();
