import { prismaClient, type ExtendedPrismaClient } from '#infrastructure/database/prisma_client';
import type { Prisma } from '@prisma/client';
import type { StoryModel } from '../models/story.js';
import type { StoryMissionModel } from '../models/story_mission.js';
import type { StoryEquipmentModel } from '../models/story_equipment.js';
import type { StoryEventModel } from '../models/story_event.js';
import type { StorySourceModel } from '../models/story_source.js';
import type { StoryType, PublicationStatus } from '#shared/enums';

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

export class StoryRepository {
  constructor(private readonly prisma: ExtendedPrismaClient = prismaClient) {}

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
        some: { equipmentId: params.equipmentId },
      };
    }

    return where;
  }

  async findMany(params: StoryListParams): Promise<StoryModel[]> {
    const where = this.buildWhere(params);

    const rows = await this.prisma.story.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.orderByField]: params.orderDirection,
      },
    });

    return rows as StoryModel[];
  }

  async count(params: Partial<StoryListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return this.prisma.story.count({ where });
  }

  async findById(storyId: string): Promise<StoryModel | null> {
    const row = await this.prisma.story.findUnique({
      where: { storyId },
    });
    return row as StoryModel | null;
  }

  async findBySlug(slug: string): Promise<StoryModel | null> {
    const row = await this.prisma.story.findUnique({
      where: { slug },
    });
    return row as StoryModel | null;
  }

  async findByIdOrSlugWithIncludes(
    idOrSlug: string,
    isUuid: boolean,
    includes: {
      missions?: boolean;
      equipments?: boolean;
      events?: boolean;
      sources?: boolean;
    },
    publishedOnly: boolean = false
  ): Promise<any | null> {
    const whereClause: Prisma.StoryWhereUniqueInput = isUuid ? { storyId: idOrSlug } : { slug: idOrSlug };

    const story = await this.prisma.story.findUnique({
      where: whereClause,
      include: {
        ...(includes.missions && {
          missions: {
            take: 50,
            orderBy: { displayOrder: 'asc' },
            include: {
              mission: {
                select: {
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
                  title: true,
                  eventType: true,
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
                  title: true,
                  url: true,
                },
              },
            },
          },
        }),
      },
    });

    if (publishedOnly && story && story.publicationStatus !== 'PUBLISHED') {
      return null;
    }

    return story;
  }

  async create(data: {
    title: string;
    slug: string;
    hook?: string | null;
    content: string;
    storyType: StoryType;
    durationSeconds?: number | null;
    language: string;
    publicationStatus: PublicationStatus;
    publishedAt?: Date | null;
  }): Promise<StoryModel> {
    const row = await this.prisma.story.create({
      data: {
        title: data.title,
        slug: data.slug,
        hook: data.hook ?? null,
        content: data.content,
        storyType: data.storyType,
        durationSeconds: data.durationSeconds ?? null,
        language: data.language,
        publicationStatus: data.publicationStatus,
        publishedAt: data.publishedAt ?? null,
      },
    });
    return row as StoryModel;
  }

  async update(
    storyId: string,
    data: {
      title?: string;
      slug?: string;
      hook?: string | null;
      content?: string;
      storyType?: StoryType;
      durationSeconds?: number | null;
      language?: string;
      publicationStatus?: PublicationStatus;
      publishedAt?: Date | null;
    }
  ): Promise<StoryModel> {
    const row = await this.prisma.story.update({
      where: { storyId },
      data,
    });
    return row as StoryModel;
  }

  async delete(storyId: string): Promise<StoryModel> {
    const row = await this.prisma.story.delete({
      where: { storyId },
    });
    return row as StoryModel;
  }

  // Relations
  async linkMission(storyId: string, missionId: string, displayOrder: number): Promise<StoryMissionModel> {
    return this.prisma.storyMission.upsert({
      where: { storyId_missionId: { storyId, missionId } },
      create: { storyId, missionId, displayOrder },
      update: { displayOrder },
    });
  }

  async unlinkMission(storyId: string, missionId: string): Promise<void> {
    await this.prisma.storyMission.delete({
      where: { storyId_missionId: { storyId, missionId } },
    });
  }

  async linkEquipment(
    storyId: string,
    equipmentId: string,
    displayOrder: number,
    narrativeRole?: string | null
  ): Promise<StoryEquipmentModel> {
    const cleanNarrativeRole = narrativeRole ?? null;
    return this.prisma.storyEquipment.upsert({
      where: { storyId_equipmentId: { storyId, equipmentId } },
      create: { storyId, equipmentId, displayOrder, narrativeRole: cleanNarrativeRole },
      update: { displayOrder, narrativeRole: cleanNarrativeRole },
    });
  }

  async unlinkEquipment(storyId: string, equipmentId: string): Promise<void> {
    await this.prisma.storyEquipment.delete({
      where: { storyId_equipmentId: { storyId, equipmentId } },
    });
  }

  async linkEvent(storyId: string, eventId: string, displayOrder: number): Promise<StoryEventModel> {
    return this.prisma.storyEvent.upsert({
      where: { storyId_eventId: { storyId, eventId } },
      create: { storyId, eventId, displayOrder },
      update: { displayOrder },
    });
  }

  async unlinkEvent(storyId: string, eventId: string): Promise<void> {
    await this.prisma.storyEvent.delete({
      where: { storyId_eventId: { storyId, eventId } },
    });
  }

  async linkSource(
    storyId: string,
    sourceId: string,
    displayOrder: number,
    claimDescription?: string | null
  ): Promise<StorySourceModel> {
    const cleanClaimDescription = claimDescription ?? null;
    return this.prisma.storySource.upsert({
      where: { storyId_sourceId: { storyId, sourceId } },
      create: { storyId, sourceId, displayOrder, claimDescription: cleanClaimDescription },
      update: { displayOrder, claimDescription: cleanClaimDescription },
    });
  }

  async unlinkSource(storyId: string, sourceId: string): Promise<void> {
    await this.prisma.storySource.delete({
      where: { storyId_sourceId: { storyId, sourceId } },
    });
  }
}

export const storyRepository = new StoryRepository();
