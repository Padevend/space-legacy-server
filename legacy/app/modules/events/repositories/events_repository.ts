import { prismaClient, type ExtendedPrismaClient } from '#infrastructure/database/prisma_client';
import type { Prisma } from '@prisma/client';
import type { EventModel } from '../models/event.js';
import type { EventEquipmentModel } from '../models/event_equipment.js';
import type { EventLocationModel } from '../models/event_location.js';
import type { EventType, DatePrecision } from '#shared/enums';

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
  constructor(private readonly prisma: ExtendedPrismaClient = prismaClient) {}

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

  async findMany(params: EventListParams): Promise<EventModel[]> {
    const where = this.buildWhere(params);

    const rows = await this.prisma.event.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.orderByField]: params.orderDirection,
      },
    });

    return rows as EventModel[];
  }

  async count(params: Partial<EventListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return this.prisma.event.count({ where });
  }

  async findById(eventId: string): Promise<EventModel | null> {
    const row = await this.prisma.event.findUnique({
      where: { eventId },
    });
    return row as EventModel | null;
  }

  async findByIdWithIncludes(
    eventId: string,
    includes: {
      mission?: boolean;
      equipment?: boolean;
      locations?: boolean;
      sources?: boolean;
    }
  ): Promise<any | null> {
    return this.prisma.event.findUnique({
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
                  name: true,
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
    description?: string | null;
    eventType: EventType;
    eventDate?: Date | null;
    eventTime?: Date | null;
    timeStandard?: string | null;
    datePrecision: DatePrecision;
    isEstimated: boolean;
    sequenceOrder: number;
  }): Promise<EventModel> {
    const row = await this.prisma.event.create({
      data: {
        missionId: data.missionId,
        title: data.title,
        description: data.description ?? null,
        eventType: data.eventType,
        eventDate: data.eventDate ?? null,
        eventTime: data.eventTime ?? null,
        timeStandard: data.timeStandard ?? null,
        datePrecision: data.datePrecision,
        isEstimated: data.isEstimated,
        sequenceOrder: data.sequenceOrder,
      },
    });
    return row as EventModel;
  }

  async update(
    eventId: string,
    data: {
      missionId?: string;
      title?: string;
      description?: string | null;
      eventType?: EventType;
      eventDate?: Date | null;
      eventTime?: Date | null;
      timeStandard?: string | null;
      datePrecision?: DatePrecision;
      isEstimated?: boolean;
      sequenceOrder?: number;
    }
  ): Promise<EventModel> {
    const row = await this.prisma.event.update({
      where: { eventId },
      data,
    });
    return row as EventModel;
  }

  async delete(eventId: string): Promise<EventModel> {
    const row = await this.prisma.event.delete({
      where: { eventId },
    });
    return row as EventModel;
  }

  // EventEquipment
  async linkEquipment(
    eventId: string,
    equipmentId: string,
    roleInEvent?: string | null,
    description?: string | null
  ): Promise<EventEquipmentModel> {
    const cleanRoleInEvent = roleInEvent ?? null;
    const cleanDescription = description ?? null;
    return this.prisma.eventEquipment.upsert({
      where: { eventId_equipmentId: { eventId, equipmentId } },
      create: { eventId, equipmentId, roleInEvent: cleanRoleInEvent, description: cleanDescription },
      update: { roleInEvent: cleanRoleInEvent, description: cleanDescription },
    });
  }

  async unlinkEquipment(eventId: string, equipmentId: string): Promise<void> {
    await this.prisma.eventEquipment.delete({
      where: { eventId_equipmentId: { eventId, equipmentId } },
    });
  }

  // EventLocation
  async linkLocation(eventId: string, locationId: string, locationRole?: string | null): Promise<EventLocationModel> {
    const cleanLocationRole = locationRole ?? null;
    return this.prisma.eventLocation.upsert({
      where: { eventId_locationId: { eventId, locationId } },
      create: { eventId, locationId, locationRole: cleanLocationRole },
      update: { locationRole: cleanLocationRole },
    });
  }

  async unlinkLocation(eventId: string, locationId: string): Promise<void> {
    await this.prisma.eventLocation.delete({
      where: { eventId_locationId: { eventId, locationId } },
    });
  }
}

export const eventsRepository = new EventsRepository();
