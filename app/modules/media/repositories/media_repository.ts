import { prismaClient, type ExtendedPrismaClient } from '#infrastructure/database/prisma_client';
import type { Prisma } from '@prisma/client';
import type { MediaModel } from '../models/media.js';
import type { EquipmentMediaModel } from '../models/equipment_media.js';
import type { MediaType, MediaProvenance, DownloadStatus } from '#shared/enums';

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
  constructor(private readonly prisma: ExtendedPrismaClient = prismaClient) {}

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

  async findMany(params: MediaListParams): Promise<MediaModel[]> {
    const where = this.buildWhere(params);

    const rows = await this.prisma.media.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.orderByField]: params.orderDirection,
      },
    });

    return rows as MediaModel[];
  }

  async count(params: Partial<MediaListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return this.prisma.media.count({ where });
  }

  async findById(mediaId: string): Promise<MediaModel | null> {
    const row = await this.prisma.media.findUnique({
      where: { mediaId },
    });
    return row as MediaModel | null;
  }

  async findByIdWithIncludes(
    mediaId: string,
    includes: {
      equipments?: boolean;
      stories?: boolean;
    }
  ): Promise<any | null> {
    return this.prisma.media.findUnique({
      where: { mediaId },
      include: {
        ...(includes.equipments && {
          equipments: {
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
        ...(includes.stories && {
          stories: {
            take: 50,
            include: {
              story: {
                select: {
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

  async create(data: {
    title: string;
    mediaType: MediaType;
    url: string;
    thumbnailUrl?: string | null;
    caption?: string | null;
    credit?: string | null;
    creditUrl?: string | null;
    provenanceType: MediaProvenance;
    altText?: string | null;
    downloadStatus?: DownloadStatus;
  }): Promise<MediaModel> {
    const row = await this.prisma.media.create({
      data: {
        title: data.title,
        mediaType: data.mediaType,
        url: data.url,
        thumbnailUrl: data.thumbnailUrl ?? null,
        caption: data.caption ?? null,
        credit: data.credit ?? null,
        creditUrl: data.creditUrl ?? null,
        provenanceType: data.provenanceType,
        altText: data.altText ?? null,
        downloadStatus: data.downloadStatus ?? 'EXTERNAL_ONLY',
      },
    });
    return row as MediaModel;
  }

  async update(
    mediaId: string,
    data: {
      title?: string;
      mediaType?: MediaType;
      url?: string;
      thumbnailUrl?: string | null;
      caption?: string | null;
      credit?: string | null;
      creditUrl?: string | null;
      provenanceType?: MediaProvenance;
      altText?: string | null;
      downloadStatus?: DownloadStatus;
    }
  ): Promise<MediaModel> {
    const row = await this.prisma.media.update({
      where: { mediaId },
      data,
    });
    return row as MediaModel;
  }

  async delete(mediaId: string): Promise<MediaModel> {
    const row = await this.prisma.media.delete({
      where: { mediaId },
    });
    return row as MediaModel;
  }

  async linkEquipment(
    mediaId: string,
    equipmentId: string,
    representationType?: string | null
  ): Promise<EquipmentMediaModel> {
    return this.prisma.equipmentMedia.upsert({
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

  async unlinkEquipment(mediaId: string, equipmentId: string): Promise<void> {
    await this.prisma.equipmentMedia.delete({
      where: {
        equipmentId_mediaId: {
          equipmentId,
          mediaId,
        },
      },
    });
  }
}

export const mediaRepository = new MediaRepository();
