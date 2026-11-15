import { prisma } from '../../core/database/prisma.js';
import type { Story, StoryType, PublicationStatus, Prisma } from '@prisma/client';

export interface StoryListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  publicationStatus?: PublicationStatus | undefined;
  storyType?: StoryType | undefined;
  language?: string | undefined;
  equipmentId?: string | undefined;
  orderByField: 'title' | 'publishedAt' | 'createdAt' | 'updatedAt';
  orderDirection: 'asc' | 'desc';
}

export class StoriesRepository {
  private buildWhere(params: Partial<StoryListParams>): Prisma.StoryWhereInput {
    const where: Prisma.StoryWhereInput = {};

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { hook: { contains: params.search, mode: 'insensitive' } },
        { content: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.publicationStatus) {
      where.publicationStatus = params.publicationStatus;
    }

    if (params.storyType) {
      where.storyType = params.storyType;
    }

    if (params.language) {
      where.language = params.language;
    }

    if (params.equipmentId) {
      where.equipments = {
        some: {
          equipmentId: params.equipmentId,
        },
      };
    }

    return where;
  }

  async findMany(params: StoryListParams): Promise<Story[]> {
    const where = this.buildWhere(params);

    return prisma.story.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.orderByField]: params.orderDirection,
      },
    });
  }

  async count(params: Partial<StoryListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return prisma.story.count({ where });
  }

  async findById(storyId: string): Promise<Story | null> {
    return prisma.story.findUnique({
      where: { storyId },
    });
  }

  async findBySlug(slug: string): Promise<Story | null> {
    return prisma.story.findUnique({
      where: { slug },
    });
  }

  async findByIdOrSlugWithIncludes(
    idOrSlug: string,
    isUuid: boolean,
    includes: {
      missions?: boolean;
      equipments?: boolean;
      events?: boolean;
      media?: boolean;
      sources?: boolean;
    },
    onlyPublished = false
  ) {
    const where: Prisma.StoryWhereInput = {
      ...(isUuid ? { storyId: idOrSlug } : { slug: idOrSlug }),
      ...(onlyPublished ? { publicationStatus: 'PUBLISHED' } : {}),
    };

    return prisma.story.findFirst({
      where,
      include: {
        ...(includes.missions && {
          missions: {
            take: 50,
            orderBy: { displayOrder: 'asc' },
            include: {
              mission: {
                select: {
                  missionId: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        }),
        ...(includes.equipments && {
          equipments: {
            take: 50,
            orderBy: { displayOrder: 'asc' },
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
        ...(includes.events && {
          events: {
            take: 50,
            orderBy: { displayOrder: 'asc' },
            include: {
              event: {
                select: {
                  eventId: true,
                  title: true,
                  eventType: true,
                },
              },
            },
          },
        }),
        ...(includes.media && {
          media: {
            take: 50,
            orderBy: { displayOrder: 'asc' },
            include: {
              media: {
                select: {
                  mediaId: true,
                  title: true,
                  url: true,
                  thumbnailUrl: true,
                  provenanceType: true,
                },
              },
            },
          },
        }),
        ...(includes.sources && {
          sources: {
            take: 50,
            orderBy: { displayOrder: 'asc' },
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

  async create(data: Prisma.StoryCreateInput): Promise<Story> {
    return prisma.story.create({
      data,
    });
  }

  async update(storyId: string, data: Prisma.StoryUpdateInput): Promise<Story> {
    return prisma.story.update({
      where: { storyId },
      data,
    });
  }

  async delete(storyId: string): Promise<Story> {
    return prisma.story.delete({
      where: { storyId },
    });
  }

  // Story-Mission
  async linkMission(storyId: string, missionId: string, displayOrder = 0) {
    return prisma.storyMission.upsert({
      where: { storyId_missionId: { storyId, missionId } },
      create: { storyId, missionId, displayOrder },
      update: { displayOrder },
    });
  }

  async unlinkMission(storyId: string, missionId: string) {
    return prisma.storyMission.delete({
      where: { storyId_missionId: { storyId, missionId } },
    });
  }

  async findMissionLink(storyId: string, missionId: string) {
    return prisma.storyMission.findUnique({
      where: { storyId_missionId: { storyId, missionId } },
    });
  }

  async findMissionById(missionId: string) {
    return prisma.mission.findUnique({ where: { missionId } });
  }

  // Story-Equipment
  async linkEquipment(storyId: string, equipmentId: string, displayOrder = 0, narrativeRole?: string | null) {
    return prisma.storyEquipment.upsert({
      where: { storyId_equipmentId: { storyId, equipmentId } },
      create: { storyId, equipmentId, displayOrder, narrativeRole: narrativeRole ?? null },
      update: { displayOrder, narrativeRole: narrativeRole ?? null },
    });
  }

  async unlinkEquipment(storyId: string, equipmentId: string) {
    return prisma.storyEquipment.delete({
      where: { storyId_equipmentId: { storyId, equipmentId } },
    });
  }

  async findEquipmentLink(storyId: string, equipmentId: string) {
    return prisma.storyEquipment.findUnique({
      where: { storyId_equipmentId: { storyId, equipmentId } },
    });
  }

  async findEquipmentById(equipmentId: string) {
    return prisma.equipment.findUnique({ where: { equipmentId } });
  }

  // Story-Event
  async linkEvent(storyId: string, eventId: string, displayOrder = 0) {
    return prisma.storyEvent.upsert({
      where: { storyId_eventId: { storyId, eventId } },
      create: { storyId, eventId, displayOrder },
      update: { displayOrder },
    });
  }

  async unlinkEvent(storyId: string, eventId: string) {
    return prisma.storyEvent.delete({
      where: { storyId_eventId: { storyId, eventId } },
    });
  }

  async findEventLink(storyId: string, eventId: string) {
    return prisma.storyEvent.findUnique({
      where: { storyId_eventId: { storyId, eventId } },
    });
  }

  async findEventById(eventId: string) {
    return prisma.event.findUnique({ where: { eventId } });
  }

  // Story-Media
  async linkMedia(storyId: string, mediaId: string, displayOrder = 0, captionOverride?: string | null) {
    return prisma.storyMedia.upsert({
      where: { storyId_mediaId: { storyId, mediaId } },
      create: { storyId, mediaId, displayOrder, captionOverride: captionOverride ?? null },
      update: { displayOrder, captionOverride: captionOverride ?? null },
    });
  }

  async unlinkMedia(storyId: string, mediaId: string) {
    return prisma.storyMedia.delete({
      where: { storyId_mediaId: { storyId, mediaId } },
    });
  }

  async findMediaLink(storyId: string, mediaId: string) {
    return prisma.storyMedia.findUnique({
      where: { storyId_mediaId: { storyId, mediaId } },
    });
  }

  async findMediaById(mediaId: string) {
    return prisma.media.findUnique({ where: { mediaId } });
  }

  // Story-Source
  async linkSource(storyId: string, sourceId: string, displayOrder = 0, claimDescription?: string | null) {
    return prisma.storySource.upsert({
      where: { storyId_sourceId: { storyId, sourceId } },
      create: { storyId, sourceId, displayOrder, claimDescription: claimDescription ?? null },
      update: { displayOrder, claimDescription: claimDescription ?? null },
    });
  }

  async unlinkSource(storyId: string, sourceId: string) {
    return prisma.storySource.delete({
      where: { storyId_sourceId: { storyId, sourceId } },
    });
  }

  async findSourceLink(storyId: string, sourceId: string) {
    return prisma.storySource.findUnique({
      where: { storyId_sourceId: { storyId, sourceId } },
    });
  }

  async findSourceById(sourceId: string) {
    return prisma.source.findUnique({ where: { sourceId } });
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

export const storiesRepository = new StoriesRepository();
