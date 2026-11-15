import { MeasurementRepository, measurementRepository } from '../repositories/measurement_repository.js';
import type { MeasurementModel } from '../models/measurement.js';
import { AppException } from '#exceptions/app_exception';
import type {
  ListMeasurementsQueryDto,
  CreateMeasurementRequestDto,
  UpdateMeasurementRequestDto,
} from '../validators/measurement.js';

const ALLOWED_INCLUDES = ['equipment', 'event', 'sources'];

export class MeasurementService {
  constructor(private readonly repo: MeasurementRepository = measurementRepository) {}

  async list(query: ListMeasurementsQueryDto): Promise<{ measurements: MeasurementModel[]; total: number }> {
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
      orderByField: (query.orderBy ?? 'name') as 'name' | 'measurementType' | 'measurementDate',
      orderDirection: (query.order ?? 'asc') as 'asc' | 'desc',
    };

    const [measurements, total] = await Promise.all([this.repo.findMany(listParams), this.repo.count(listParams)]);

    return { measurements, total };
  }

  async getByIdWithIncludes(measurementId: string, includeParam?: string): Promise<any> {
    const includes = {
      equipment: false,
      event: false,
      sources: false,
    };

    if (includeParam) {
      const parts = includeParam.split(',').map((p) => p.trim());
      if (parts.length > 3) {
        throw AppException.badRequest('Maximum of 3 include relations allowed.');
      }

      for (const part of parts) {
        if (part.includes('.')) {
          throw AppException.badRequest('Nested includes deeper than one level are not supported.');
        }
        if (!ALLOWED_INCLUDES.includes(part)) {
          throw AppException.badRequest(`Invalid include relation: '${part}'. Allowed: ${ALLOWED_INCLUDES.join(', ')}`);
        }
        if (part === 'equipment') includes.equipment = true;
        if (part === 'event') includes.event = true;
        if (part === 'sources') includes.sources = true;
      }
    }

    const measurement = await this.repo.findByIdWithIncludes(measurementId, includes);
    if (!measurement) {
      throw AppException.notFound('Measurement', `Measurement with ID '${measurementId}' not found.`);
    }

    return measurement;
  }

  async getById(measurementId: string): Promise<MeasurementModel> {
    const measurement = await this.repo.findById(measurementId);
    if (!measurement) {
      throw AppException.notFound('Measurement', `Measurement with ID '${measurementId}' not found.`);
    }
    return measurement;
  }

  async create(dto: CreateMeasurementRequestDto): Promise<MeasurementModel> {
    const measurementDate = dto.measurementDate ? new Date(dto.measurementDate) : null;

    return this.repo.create({
      equipmentId: dto.equipmentId ?? null,
      eventId: dto.eventId ?? null,
      name: dto.name,
      value: dto.value,
      unit: dto.unit,
      measurementType: dto.measurementType,
      context: dto.context,
      measurementDate,
      isApproximate: dto.isApproximate ?? false,
      uncertainty: dto.uncertainty ?? null,
    });
  }

  async update(measurementId: string, dto: UpdateMeasurementRequestDto): Promise<MeasurementModel> {
    await this.getById(measurementId);

    const updateData: Parameters<MeasurementRepository['update']>[1] = {};

    if (dto.equipmentId !== undefined) updateData.equipmentId = dto.equipmentId;
    if (dto.eventId !== undefined) updateData.eventId = dto.eventId;
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.unit !== undefined) updateData.unit = dto.unit;
    if (dto.measurementType !== undefined) updateData.measurementType = dto.measurementType;
    if (dto.context !== undefined) updateData.context = dto.context;
    if (dto.isApproximate !== undefined) updateData.isApproximate = dto.isApproximate;
    if (dto.value !== undefined) updateData.value = dto.value;
    if (dto.uncertainty !== undefined) updateData.uncertainty = dto.uncertainty;
    if (dto.measurementDate !== undefined) {
      updateData.measurementDate = dto.measurementDate ? new Date(dto.measurementDate) : null;
    }

    return this.repo.update(measurementId, updateData);
  }

  async delete(measurementId: string): Promise<MeasurementModel> {
    await this.getById(measurementId);
    return this.repo.delete(measurementId);
  }
}

export const measurementService = new MeasurementService();
