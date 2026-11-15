import { EventsRepository, eventsRepository } from '../repositories/events_repository.js';
import type { EventModel } from '../models/event.js';
import type { EventEquipmentModel } from '../models/event_equipment.js';
import type { EventLocationModel } from '../models/event_location.js';
import { AppException } from '#exceptions/app_exception';
import type {
  ListEventsQueryDto,
  CreateEventRequestDto,
  UpdateEventRequestDto,
  LinkEventEquipmentRequestDto,
  LinkEventLocationRequestDto,
} from '../validators/event.js';

const ALLOWED_INCLUDES = ['mission', 'equipment', 'locations', 'sources'];

export class EventService {
  constructor(private readonly repo: EventsRepository = eventsRepository) {}

  async list(query: ListEventsQueryDto): Promise<{ events: EventModel[]; total: number }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const fromDate = query.from ? new Date(`${query.from}T00:00:00.000Z`) : undefined;
    const toDate = query.to ? new Date(`${query.to}T23:59:59.999Z`) : undefined;

    const listParams = {
      skip,
      take: pageSize,
      search: query.search,
      missionId: query.missionId,
      equipmentId: query.equipmentId,
      eventType: query.eventType,
      from: fromDate,
      to: toDate,
      orderByField: (query.orderBy ?? 'eventDate') as 'eventDate' | 'sequenceOrder' | 'title' | 'createdAt',
      orderDirection: (query.order ?? 'asc') as 'asc' | 'desc',
    };

    const [events, total] = await Promise.all([this.repo.findMany(listParams), this.repo.count(listParams)]);

    return { events, total };
  }

  async getByIdWithIncludes(eventId: string, includeParam?: string): Promise<any> {
    const includes = {
      mission: false,
      equipment: false,
      locations: false,
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
        if (part === 'mission') includes.mission = true;
        if (part === 'equipment') includes.equipment = true;
        if (part === 'locations') includes.locations = true;
        if (part === 'sources') includes.sources = true;
      }
    }

    const event = await this.repo.findByIdWithIncludes(eventId, includes);
    if (!event) {
      throw AppException.notFound('Event', `Event with ID '${eventId}' not found.`);
    }

    return event;
  }

  async getById(eventId: string): Promise<EventModel> {
    const event = await this.repo.findById(eventId);
    if (!event) {
      throw AppException.notFound('Event', `Event with ID '${eventId}' not found.`);
    }
    return event;
  }

  private parseEventDateTime(
    dateStr?: string | null,
    timeStr?: string | null
  ): { date: Date | null; time: Date | null } {
    const date = dateStr ? new Date(`${dateStr}T00:00:00.000Z`) : null;
    const time = timeStr ? new Date(`1970-01-01T${timeStr}.000Z`) : null;
    return { date, time };
  }

  async create(dto: CreateEventRequestDto): Promise<EventModel> {
    const { date, time } = this.parseEventDateTime(dto.eventDate, dto.eventTime);

    return this.repo.create({
      missionId: dto.missionId,
      title: dto.title,
      description: dto.description ?? null,
      eventType: dto.eventType,
      eventDate: date,
      eventTime: time,
      timeStandard: dto.timeStandard ?? null,
      datePrecision: dto.datePrecision ?? 'UNKNOWN',
      isEstimated: dto.isEstimated ?? false,
      sequenceOrder: dto.sequenceOrder ?? 0,
    });
  }

  async update(eventId: string, dto: UpdateEventRequestDto): Promise<EventModel> {
    await this.getById(eventId);

    const updateData: Parameters<EventsRepository['update']>[1] = {};

    if (dto.missionId !== undefined) updateData.missionId = dto.missionId;
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.eventType !== undefined) updateData.eventType = dto.eventType;
    if (dto.timeStandard !== undefined) updateData.timeStandard = dto.timeStandard;
    if (dto.datePrecision !== undefined) updateData.datePrecision = dto.datePrecision;
    if (dto.isEstimated !== undefined) updateData.isEstimated = dto.isEstimated;
    if (dto.sequenceOrder !== undefined) updateData.sequenceOrder = dto.sequenceOrder;

    if (dto.eventDate !== undefined) {
      updateData.eventDate = dto.eventDate ? new Date(`${dto.eventDate}T00:00:00.000Z`) : null;
    }
    if (dto.eventTime !== undefined) {
      updateData.eventTime = dto.eventTime ? new Date(`1970-01-01T${dto.eventTime}.000Z`) : null;
    }

    return this.repo.update(eventId, updateData);
  }

  async delete(eventId: string): Promise<EventModel> {
    await this.getById(eventId);
    return this.repo.delete(eventId);
  }

  // Relations
  async linkEquipment(
    eventId: string,
    equipmentId: string,
    dto: LinkEventEquipmentRequestDto
  ): Promise<EventEquipmentModel> {
    await this.getById(eventId);
    return this.repo.linkEquipment(eventId, equipmentId, dto.roleInEvent, dto.description);
  }

  async unlinkEquipment(eventId: string, equipmentId: string): Promise<void> {
    try {
      await this.repo.unlinkEquipment(eventId, equipmentId);
    } catch {
      throw AppException.notFound('EventEquipment', 'Equipment link not found for this event.');
    }
  }

  async linkLocation(
    eventId: string,
    locationId: string,
    dto: LinkEventLocationRequestDto
  ): Promise<EventLocationModel> {
    await this.getById(eventId);
    return this.repo.linkLocation(eventId, locationId, dto.locationRole);
  }

  async unlinkLocation(eventId: string, locationId: string): Promise<void> {
    try {
      await this.repo.unlinkLocation(eventId, locationId);
    } catch {
      throw AppException.notFound('EventLocation', 'Location link not found for this event.');
    }
  }
}

export const eventService = new EventService();
