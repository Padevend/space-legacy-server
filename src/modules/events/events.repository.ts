import { prisma } from '../../core/database/prisma.js';
import type { Event, EventType, DatePrecision, Prisma } from '@prisma/client';

export interface EventListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  missionId?: string | undefined;
  equipmentId?: string | undefined;
  eventType?: EventType | undefined;
  from?: Date | undefined;
  to?: Date | undefined;
  orderByField: 'eventDate' | 'sequenceOrder' | 'title' | 'createdAt';
  orderDirection: 'asc' | 'desc';
}

export class EventsRepository {
  private buildWhere(params: Partial<EventListParams>): Prisma.EventWhereInput {
    const where: Prisma.EventWhereInput = {};

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.missionId) {
      where.missionId = params.missionId;
    }

    if (params.eventType) {
      where.eventType = params.eventType;
    }

    if (params.equipmentId) {
      where.equipment = {
        some: { equipmentId: params.equipmentId },
      };
    }

    if (params.from || params.to) {
      where.eventDate = {
        ...(params.from && { gte: params.from }),
        ...(params.to && { lte: params.to }),
      };
    }

    return where;
  }

  async findMany(params: EventListParams): Promise<Event[]> {
    const where = this.buildWhere(params);

    return prisma.event.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.orderByField]: params.orderDirection,
      },
    });
  }

  async count(params: Partial<EventListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return prisma.event.count({ where });
  }

  async findById(eventId: string): Promise<Event | null> {
    return prisma.event.findUnique({
      where: { eventId },
    });
  }

  async findByIdWithIncludes(
    eventId: string,
    includes: {
      mission?: boolean;
      equipment?: boolean;
      locations?: boolean;
      people?: boolean;
      sources?: boolean;
    }
  ) {
    return prisma.event.findUnique({
      where: { eventId },
      include: {
        ...(includes.mission && {
          mission: {
            select: {
              missionId: true,
              name: true,
              slug: true,
            },
          },
        }),
        ...(includes.equipment && {
          equipment: {
            take: 50,
            include: {
              equipment: {
                select: {
                  equipmentId: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        }),
        ...(includes.locations && {
          locations: {
            take: 50,
            include: {
              location: {
                select: {
                  locationId: true,
                  name: true,
                },
              },
            },
          },
        }),
        ...(includes.people && {
          people: {
            take: 50,
            include: {
              person: {
                select: {
                  personId: true,
                  fullName: true,
                },
              },
            },
          },
        }),
        ...(includes.sources && {
          sources: {
            take: 50,
            include: {
              source: {
                select: {
                  sourceId: true,
                  title: true,
                  url: true,
                },
              },
            },
          },
        }),
      },
    });
  }

  async create(data: {
    missionId: string;
    title: string;
    description?: string | null | undefined;
    eventType: EventType;
    eventDate?: Date | null | undefined;
    eventTime?: Date | null | undefined;
    timeStandard?: string | null | undefined;
    datePrecision?: DatePrecision | undefined;
    isEstimated?: boolean | undefined;
    sequenceOrder?: number | undefined;
  }): Promise<Event> {
    return prisma.event.create({
      data: {
        missionId: data.missionId,
        title: data.title,
        description: data.description ?? null,
        eventType: data.eventType,
        eventDate: data.eventDate ?? null,
        eventTime: data.eventTime ?? null,
        timeStandard: data.timeStandard ?? null,
        datePrecision: data.datePrecision ?? 'UNKNOWN',
        isEstimated: data.isEstimated ?? false,
        sequenceOrder: data.sequenceOrder ?? 0,
      },
    });
  }

  async update(
    eventId: string,
    data: {
      missionId?: string | undefined;
      title?: string | undefined;
      description?: string | null | undefined;
      eventType?: EventType | undefined;
      eventDate?: Date | null | undefined;
      eventTime?: Date | null | undefined;
      timeStandard?: string | null | undefined;
      datePrecision?: DatePrecision | undefined;
      isEstimated?: boolean | undefined;
      sequenceOrder?: number | undefined;
    }
  ): Promise<Event> {
    return prisma.event.update({
      where: { eventId },
      data: {
        ...(data.missionId !== undefined && { missionId: data.missionId }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.eventType !== undefined && { eventType: data.eventType }),
        ...(data.eventDate !== undefined && { eventDate: data.eventDate }),
        ...(data.eventTime !== undefined && { eventTime: data.eventTime }),
        ...(data.timeStandard !== undefined && { timeStandard: data.timeStandard }),
        ...(data.datePrecision !== undefined && { datePrecision: data.datePrecision }),
        ...(data.isEstimated !== undefined && { isEstimated: data.isEstimated }),
        ...(data.sequenceOrder !== undefined && { sequenceOrder: data.sequenceOrder }),
      },
    });
  }

  async delete(eventId: string): Promise<Event> {
    return prisma.event.delete({
      where: { eventId },
    });
  }

  // Relations
  async linkEquipment(eventId: string, equipmentId: string, roleInEvent?: string | null, description?: string | null) {
    return prisma.eventEquipment.upsert({
      where: {
        eventId_equipmentId: { eventId, equipmentId },
      },
      update: {
        roleInEvent: roleInEvent ?? null,
        description: description ?? null,
      },
      create: {
        eventId,
        equipmentId,
        roleInEvent: roleInEvent ?? null,
        description: description ?? null,
      },
    });
  }

  async unlinkEquipment(eventId: string, equipmentId: string) {
    return prisma.eventEquipment.delete({
      where: {
        eventId_equipmentId: { eventId, equipmentId },
      },
    });
  }

  async linkLocation(eventId: string, locationId: string, locationRole?: string | null) {
    return prisma.eventLocation.upsert({
      where: {
        eventId_locationId: { eventId, locationId },
      },
      update: { locationRole: locationRole ?? null },
      create: { eventId, locationId, locationRole: locationRole ?? null },
    });
  }

  async unlinkLocation(eventId: string, locationId: string) {
    return prisma.eventLocation.delete({
      where: {
        eventId_locationId: { eventId, locationId },
      },
    });
  }

  async linkPerson(eventId: string, personId: string, roleInEvent = 'Participant') {
    return prisma.eventPerson.upsert({
      where: {
        eventId_personId: { eventId, personId },
      },
      update: { roleInEvent },
      create: { eventId, personId, roleInEvent },
    });
  }

  async unlinkPerson(eventId: string, personId: string) {
    return prisma.eventPerson.delete({
      where: {
        eventId_personId: { eventId, personId },
      },
    });
  }

  async linkSource(eventId: string, sourceId: string, claimDescription?: string | null) {
    return prisma.eventSource.upsert({
      where: {
        eventId_sourceId: { eventId, sourceId },
      },
      update: { claimDescription: claimDescription ?? null },
      create: { eventId, sourceId, claimDescription: claimDescription ?? null },
    });
  }

  async unlinkSource(eventId: string, sourceId: string) {
    return prisma.eventSource.delete({
      where: {
        eventId_sourceId: { eventId, sourceId },
      },
    });
  }

  async createAuditLog(data: {
    actorId?: string | undefined;
    action: string;
    entity: string;
    entityId: string;
    requestId?: string | undefined;
    diffSummary?: Prisma.InputJsonValue | undefined;
  }): Promise<void> {
    await prisma.auditLog.create({
      data: {
        actorId: data.actorId ?? null,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        requestId: data.requestId ?? null,
        ...(data.diffSummary !== undefined && { diffSummary: data.diffSummary }),
      },
    });
  }
}

export const eventsRepository = new EventsRepository();
