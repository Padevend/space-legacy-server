import { measurementsRepository } from './measurements.repository.js';
import { equipmentRepository } from '../equipment/equipment.repository.js';
import { eventsRepository } from '../events/events.repository.js';
import { AppException } from '../../core/exceptions/AppException.js';
const ALLOWED_INCLUDES = ['equipment', 'event', 'sources'];
export class MeasurementsService {
    repository;
    equipRepo;
    eventsRepo;
    constructor(repository = measurementsRepository, equipRepo = equipmentRepository, eventsRepo = eventsRepository) {
        this.repository = repository;
        this.equipRepo = equipRepo;
        this.eventsRepo = eventsRepo;
    }
    async list(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;
        const skip = (page - 1) * pageSize;
        const listParams = {
            skip,
            take: pageSize,
            search: query.search,
            equipmentId: query.equipmentId,
            eventId: query.eventId,
            measurementType: query.measurementType,
            orderByField: (query.orderBy ?? 'name'),
            orderDirection: (query.order ?? 'asc'),
        };
        const [measurements, total] = await Promise.all([
            this.repository.findMany(listParams),
            this.repository.count(listParams),
        ]);
        return { measurements, total };
    }
    async getByIdWithIncludes(measurementId, includeParam) {
        const includes = {
            equipment: false,
            event: false,
            sources: false,
        };
        if (includeParam) {
            const parts = includeParam.split(',').map((p) => p.trim());
            if (parts.length > 3) {
                throw AppException.unprocessable('Maximum of 3 include relations allowed.');
            }
            for (const part of parts) {
                if (part.includes('.')) {
                    throw AppException.unprocessable('Nested includes deeper than one level are not supported.');
                }
                if (!ALLOWED_INCLUDES.includes(part)) {
                    throw AppException.unprocessable(`Invalid include relation: '${part}'. Allowed: ${ALLOWED_INCLUDES.join(', ')}`);
                }
                if (part === 'equipment')
                    includes.equipment = true;
                if (part === 'event')
                    includes.event = true;
                if (part === 'sources')
                    includes.sources = true;
            }
        }
        const measurement = await this.repository.findByIdWithIncludes(measurementId, includes);
        if (!measurement) {
            throw AppException.notFound(`Measurement with ID '${measurementId}' not found.`);
        }
        return measurement;
    }
    async getById(measurementId) {
        const measurement = await this.repository.findById(measurementId);
        if (!measurement) {
            throw AppException.notFound(`Measurement with ID '${measurementId}' not found.`);
        }
        return measurement;
    }
    async create(data, ctx) {
        if (data.equipmentId) {
            const equipment = await this.equipRepo.findById(data.equipmentId);
            if (!equipment) {
                throw AppException.notFound(`Equipment '${data.equipmentId}' not found.`);
            }
        }
        if (data.eventId) {
            const event = await this.eventsRepo.findById(data.eventId);
            if (!event) {
                throw AppException.notFound(`Event '${data.eventId}' not found.`);
            }
        }
        const mDate = data.measurementDate ? new Date(data.measurementDate) : null;
        const created = await this.repository.create({
            ...data,
            measurementDate: mDate,
        });
        await this.repository.createAuditLog({
            actorId: ctx.actorId,
            action: 'CREATE',
            entity: 'Measurement',
            entityId: created.measurementId,
            requestId: ctx.requestId,
            diffSummary: { name: created.name, value: created.value.toString() },
        });
        return created;
    }
    async update(measurementId, data, ctx) {
        await this.getById(measurementId);
        if (data.equipmentId) {
            const equipment = await this.equipRepo.findById(data.equipmentId);
            if (!equipment) {
                throw AppException.notFound(`Equipment '${data.equipmentId}' not found.`);
            }
        }
        if (data.eventId) {
            const event = await this.eventsRepo.findById(data.eventId);
            if (!event) {
                throw AppException.notFound(`Event '${data.eventId}' not found.`);
            }
        }
        const updatePayload = {
            ...(data.equipmentId !== undefined && { equipmentId: data.equipmentId }),
            ...(data.eventId !== undefined && { eventId: data.eventId }),
            ...(data.name !== undefined && { name: data.name }),
            ...(data.value !== undefined && { value: data.value }),
            ...(data.unit !== undefined && { unit: data.unit }),
            ...(data.measurementType !== undefined && { measurementType: data.measurementType }),
            ...(data.context !== undefined && { context: data.context }),
            ...(data.isApproximate !== undefined && { isApproximate: data.isApproximate }),
            ...(data.uncertainty !== undefined && { uncertainty: data.uncertainty }),
        };
        if (data.measurementDate !== undefined) {
            updatePayload.measurementDate = data.measurementDate ? new Date(data.measurementDate) : null;
        }
        const updated = await this.repository.update(measurementId, updatePayload);
        await this.repository.createAuditLog({
            actorId: ctx.actorId,
            action: 'UPDATE',
            entity: 'Measurement',
            entityId: updated.measurementId,
            requestId: ctx.requestId,
            diffSummary: { updatedFields: Object.keys(data) },
        });
        return updated;
    }
    async delete(measurementId, ctx) {
        const existing = await this.getById(measurementId);
        const deleted = await this.repository.delete(measurementId);
        await this.repository.createAuditLog({
            actorId: ctx.actorId,
            action: 'DELETE',
            entity: 'Measurement',
            entityId: existing.measurementId,
            requestId: ctx.requestId,
            diffSummary: { name: existing.name },
        });
        return deleted;
    }
    // Relations
    async linkSource(measurementId, sourceId, claimDescription, ctx = {}) {
        await this.getById(measurementId);
        const link = await this.repository.linkSource(measurementId, sourceId, claimDescription);
        await this.repository.createAuditLog({
            actorId: ctx.actorId,
            action: 'LINK_SOURCE',
            entity: 'MeasurementSource',
            entityId: `${measurementId}:${sourceId}`,
            requestId: ctx.requestId,
            diffSummary: { claimDescription: claimDescription ?? null },
        });
        return link;
    }
    async unlinkSource(measurementId, sourceId, ctx = {}) {
        await this.getById(measurementId);
        try {
            await this.repository.unlinkSource(measurementId, sourceId);
            await this.repository.createAuditLog({
                actorId: ctx.actorId,
                action: 'UNLINK_SOURCE',
                entity: 'MeasurementSource',
                entityId: `${measurementId}:${sourceId}`,
                requestId: ctx.requestId,
            });
        }
        catch {
            throw AppException.notFound(`Link between measurement '${measurementId}' and source '${sourceId}' not found.`);
        }
    }
}
export const measurementsService = new MeasurementsService();
