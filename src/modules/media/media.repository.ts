import { prisma } from '../../core/database/prisma.js';
import type { Media, MediaType, MediaProvenance, Prisma } from '@prisma/client';

export interface MediaListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  mediaType?: MediaType | undefined;
  provenanceType?: MediaProvenance | undefined;
  orderByField: 'title' | 'mediaType' | 'provenanceType';
  orderDirection: 'asc' | 'desc';
}

export class MediaRepository {
  private buildWhere(params: Partial<MediaListParams>): Prisma.MediaWhereInput {
    const where: Prisma.MediaWhereInput = {};

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { caption: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.mediaType) {
      where.mediaType = params.mediaType;
    }

    if (params.provenanceType) {
      where.provenanceType = params.provenanceType;
    }

    return where;
  }

  async findMany(params: MediaListParams): Promise<Media[]> {
    const where = this.buildWhere(params);

    return prisma.media.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.orderByField]: params.orderDirection,
      },
    });
  }

  async count(params: Partial<MediaListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return prisma.media.count({ where });
  }

  async findById(mediaId: string): Promise<Media | null> {
    return prisma.media.findUnique({
      where: { mediaId },
    });
  }

  async findByIdWithIncludes(mediaId: string, includes: { equipments?: boolean; stories?: boolean }) {
    return prisma.media.findUnique({
      where: { mediaId },
      include: {
        ...(includes.equipments && {
          equipments: {
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
        ...(includes.stories && {
          stories: {
            take: 50,
            include: {
              story: {
                select: {
                  storyId: true,
                  title: true,
                  slug: true,
                },
              },
            },
          },
        }),
      },
    });
  }

  async create(data: Prisma.MediaCreateInput): Promise<Media> {
    return prisma.media.create({
      data,
    });
  }

  async update(mediaId: string, data: Prisma.MediaUpdateInput): Promise<Media> {
    return prisma.media.update({
      where: { mediaId },
      data,
    });
  }

  async delete(mediaId: string): Promise<Media> {
    return prisma.media.delete({
      where: { mediaId },
    });
  }

  async linkEquipment(mediaId: string, equipmentId: string, representationType?: string | null) {
    return prisma.equipmentMedia.upsert({
      where: {
        equipmentId_mediaId: {
          equipmentId,
          mediaId,
        },
      },
      create: {
        mediaId,
        equipmentId,
        representationType: representationType ?? null,
      },
      update: {
        representationType: representationType ?? null,
      },
    });
  }

  async unlinkEquipment(mediaId: string, equipmentId: string) {
    return prisma.equipmentMedia.delete({
      where: {
        equipmentId_mediaId: {
          equipmentId,
          mediaId,
        },
      },
    });
  }

  async findEquipmentLink(mediaId: string, equipmentId: string) {
    return prisma.equipmentMedia.findUnique({
      where: {
        equipmentId_mediaId: {
          equipmentId,
          mediaId,
        },
      },
    });
  }

  async findEquipmentById(equipmentId: string) {
    return prisma.equipment.findUnique({
      where: { equipmentId },
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

export const mediaRepository = new MediaRepository();
