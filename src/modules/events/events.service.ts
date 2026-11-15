import { eventsRepository, type EventsRepository } from './events.repository.js';
import { missionsRepository, type MissionsRepository } from '../missions/missions.repository.js';
import { AppException } from '../../core/exceptions/AppException.js';
import type { ListEventsQueryDto, CreateEventRequestDto, UpdateEventRequestDto } from './events.schemas.js';
import type { Event } from '@prisma/client';

const ALLOWED_INCLUDES = ['mission', 'equipment', 'locations', 'people', 'sources'];

export interface AuditContext {
  actorId?: string | undefined;
  requestId?: string | undefined;
}

export class EventsService {
  constructor(
    private readonly repository: EventsRepository = eventsRepository,
    private readonly missionsRepo: MissionsRepository = missionsRepository
  ) {}

  async list(query: ListEventsQueryDto): Promise<{ events: Event[]; total: number }> {
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

    const [events, total] = await Promise.all([
      this.repository.findMany(listParams),
      this.repository.count(listParams),
    ]);

    return { events, total };
  }

  async getByIdWithIncludes(eventId: string, includeParam?: string) {
    const includes = {
      mission: false,
      equipment: false,
      locations: false,
      people: false,
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
          throw AppException.unprocessable(
            `Invalid include relation: '${part}'. Allowed: ${ALLOWED_INCLUDES.join(', ')}`
          );
        }
        if (part === 'mission') includes.mission = true;
        if (part === 'equipment') includes.equipment = true;
        if (part === 'locations') includes.locations = true;
        if (part === 'people') includes.people = true;
        if (part === 'sources') includes.sources = true;
      }
    }

    const event = await this.repository.findByIdWithIncludes(eventId, includes);
    if (!event) {
      throw AppException.notFound(`Event with ID '${eventId}' not found.`);
    }

    return event;
  }

  async getById(eventId: string): Promise<Event> {
    const event = await this.repository.findById(eventId);
    if (!event) {
      throw AppException.notFound(`Event with ID '${eventId}' not found.`);
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

  async create(data: CreateEventRequestDto, ctx: AuditContext): Promise<Event> {
    const mission = await this.missionsRepo.findById(data.missionId);
    if (!mission) {
      throw AppException.notFound(`Mission '${data.missionId}' not found.`);
    }

    const { date, time } = this.parseEventDateTime(data.eventDate, data.eventTime);

    const created = await this.repository.create({
      missionId: data.missionId,
      title: data.title,
      description: data.description ?? null,
      eventType: data.eventType,
      eventDate: date,
      eventTime: time,
      timeStandard: data.timeStandard ?? null,
      datePrecision: data.datePrecision,
      isEstimated: data.isEstimated,
      sequenceOrder: data.sequenceOrder,
    });

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'CREATE',
      entity: 'Event',
      entityId: created.eventId,
      requestId: ctx.requestId,
      diffSummary: { title: created.title, eventType: created.eventType },
    });

    return created;
  }

  async update(eventId: string, data: UpdateEventRequestDto, ctx: AuditContext): Promise<Event> {
    await this.getById(eventId);

    if (data.missionId) {
      const mission = await this.missionsRepo.findById(data.missionId);
      if (!mission) {
        throw AppException.notFound(`Mission '${data.missionId}' not found.`);
      }
    }

    const updatePayload: Parameters<typeof this.repository.update>[1] = {
      ...(data.missionId !== undefined && { missionId: data.missionId }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.eventType !== undefined && { eventType: data.eventType }),
      ...(data.timeStandard !== undefined && { timeStandard: data.timeStandard }),
      ...(data.datePrecision !== undefined && { datePrecision: data.datePrecision }),
      ...(data.isEstimated !== undefined && { isEstimated: data.isEstimated }),
      ...(data.sequenceOrder !== undefined && { sequenceOrder: data.sequenceOrder }),
    };

    if (data.eventDate !== undefined) {
      updatePayload.eventDate = data.eventDate ? new Date(`${data.eventDate}T00:00:00.000Z`) : null;
    }
    if (data.eventTime !== undefined) {
      updatePayload.eventTime = data.eventTime ? new Date(`1970-01-01T${data.eventTime}.000Z`) : null;
    }

    const updated = await this.repository.update(eventId, updatePayload);

    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'UPDATE',
      entity: 'Event',
      entityId: updated.eventId,
      requestId: ctx.requestId,
      diffSummary: { updatedFields: Object.keys(data) },
    });

    return updated;
  }

  async delete(eventId: string, ctx: AuditContext): Promise<Event> {
    const existing = await this.getById(eventId);

    try {
      const deleted = await this.repository.delete(eventId);

      await this.repository.createAuditLog({
        actorId: ctx.actorId,
        action: 'DELETE',
        entity: 'Event',
        entityId: existing.eventId,
        requestId: ctx.requestId,
        diffSummary: { title: existing.title },
      });

      return deleted;
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P2003') {
        throw AppException.conflict('Cannot delete event with associated measurements or stories.');
      }
      throw err;
    }
  }

  // Relations
  async linkEquipment(
    eventId: string,
    equipmentId: string,
    roleInEvent?: string | null,
    description?: string | null,
    ctx: AuditContext = {}
  ) {
    await this.getById(eventId);
    const link = await this.repository.linkEquipment(eventId, equipmentId, roleInEvent, description);
    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'LINK_EQUIPMENT',
      entity: 'EventEquipment',
      entityId: `${eventId}:${equipmentId}`,
      requestId: ctx.requestId,
      diffSummary: { roleInEvent, description },
    });
    return link;
  }

  async unlinkEquipment(eventId: string, equipmentId: string, ctx: AuditContext = {}) {
    await this.getById(eventId);
    try {
      await this.repository.unlinkEquipment(eventId, equipmentId);
      await this.repository.createAuditLog({
        actorId: ctx.actorId,
        action: 'UNLINK_EQUIPMENT',
        entity: 'EventEquipment',
        entityId: `${eventId}:${equipmentId}`,
        requestId: ctx.requestId,
      });
    } catch {
      throw AppException.notFound(`Link between event '${eventId}' and equipment '${equipmentId}' not found.`);
    }
  }

  async linkLocation(eventId: string, locationId: string, locationRole?: string | null, ctx: AuditContext = {}) {
    await this.getById(eventId);
    const link = await this.repository.linkLocation(eventId, locationId, locationRole);
    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'LINK_LOCATION',
      entity: 'EventLocation',
      entityId: `${eventId}:${locationId}`,
      requestId: ctx.requestId,
      diffSummary: { locationRole },
    });
    return link;
  }

  async unlinkLocation(eventId: string, locationId: string, ctx: AuditContext = {}) {
    await this.getById(eventId);
    try {
      await this.repository.unlinkLocation(eventId, locationId);
      await this.repository.createAuditLog({
        actorId: ctx.actorId,
        action: 'UNLINK_LOCATION',
        entity: 'EventLocation',
        entityId: `${eventId}:${locationId}`,
        requestId: ctx.requestId,
      });
    } catch {
      throw AppException.notFound(`Link between event '${eventId}' and location '${locationId}' not found.`);
    }
  }

  async linkPerson(eventId: string, personId: string, roleInEvent = 'Participant', ctx: AuditContext = {}) {
    await this.getById(eventId);
    const link = await this.repository.linkPerson(eventId, personId, roleInEvent);
    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'LINK_PERSON',
      entity: 'EventPerson',
      entityId: `${eventId}:${personId}`,
      requestId: ctx.requestId,
      diffSummary: { roleInEvent },
    });
    return link;
  }

  async unlinkPerson(eventId: string, personId: string, ctx: AuditContext = {}) {
    await this.getById(eventId);
    try {
      await this.repository.unlinkPerson(eventId, personId);
      await this.repository.createAuditLog({
        actorId: ctx.actorId,
        action: 'UNLINK_PERSON',
        entity: 'EventPerson',
        entityId: `${eventId}:${personId}`,
        requestId: ctx.requestId,
      });
    } catch {
      throw AppException.notFound(`Link between event '${eventId}' and person '${personId}' not found.`);
    }
  }

  async linkSource(eventId: string, sourceId: string, claimDescription?: string | null, ctx: AuditContext = {}) {
    await this.getById(eventId);
    const link = await this.repository.linkSource(eventId, sourceId, claimDescription);
    await this.repository.createAuditLog({
      actorId: ctx.actorId,
      action: 'LINK_SOURCE',
      entity: 'EventSource',
      entityId: `${eventId}:${sourceId}`,
      requestId: ctx.requestId,
      diffSummary: { claimDescription: claimDescription ?? null },
    });
    return link;
  }

  async unlinkSource(eventId: string, sourceId: string, ctx: AuditContext = {}) {
    await this.getById(eventId);
    try {
      await this.repository.unlinkSource(eventId, sourceId);
      await this.repository.createAuditLog({
        actorId: ctx.actorId,
        action: 'UNLINK_SOURCE',
        entity: 'EventSource',
        entityId: `${eventId}:${sourceId}`,
        requestId: ctx.requestId,
      });
    } catch {
      throw AppException.notFound(`Link between event '${eventId}' and source '${sourceId}' not found.`);
    }
  }
}

export const eventsService = new EventsService();
