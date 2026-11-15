import { prisma } from '#infrastructure/database/prisma_client';
import type { SourceModel } from '../models/source.js';
import type { SourceLinkModel } from '../models/source_link.js';
import type { SourceType } from '#shared/enums';

export interface SourceListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  sourceType?: SourceType | undefined;
  publisher?: string | undefined;
  orderByField: 'title' | 'publicationDate' | 'accessedAt';
  orderDirection: 'asc' | 'desc';
}

export class SourceRepository {
  private mapSource(row: any): SourceModel {
    return {
      sourceId: row.sourceId,
      title: row.title,
      url: row.url,
      publisher: row.publisher,
      author: row.author,
      publicationDate: row.publicationDate,
      sourceType: row.sourceType,
      accessedAt: row.accessedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async findMany(params: SourceListParams): Promise<SourceModel[]> {
    const where: any = {};
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { publisher: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.sourceType) {
      where.sourceType = params.sourceType;
    }
    if (params.publisher) {
      where.publisher = { contains: params.publisher, mode: 'insensitive' };
    }

    const rows = await prisma.source.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.orderByField]: params.orderDirection },
    });
    return rows.map((r) => this.mapSource(r));
  }

  async count(params: Partial<SourceListParams>): Promise<number> {
    const where: any = {};
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { publisher: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.sourceType) {
      where.sourceType = params.sourceType;
    }
    if (params.publisher) {
      where.publisher = { contains: params.publisher, mode: 'insensitive' };
    }
    return prisma.source.count({ where });
  }

  async findById(sourceId: string): Promise<SourceModel | null> {
    const row = await prisma.source.findUnique({
      where: { sourceId },
    });
    return row ? this.mapSource(row) : null;
  }

  async create(data: {
    title: string;
    url: string;
    publisher: string;
    author?: string | null | undefined;
    publicationDate?: Date | null | undefined;
    sourceType: SourceType;
  }): Promise<SourceModel> {
    const row = await prisma.source.create({
      data: {
        title: data.title,
        url: data.url,
        publisher: data.publisher,
        author: data.author ?? null,
        publicationDate: data.publicationDate ?? null,
        sourceType: data.sourceType,
      },
    });
    return this.mapSource(row);
  }

  async update(
    sourceId: string,
    data: {
      title?: string | undefined;
      url?: string | undefined;
      publisher?: string | undefined;
      author?: string | null | undefined;
      publicationDate?: Date | null | undefined;
      sourceType?: SourceType | undefined;
    }
  ): Promise<SourceModel> {
    const row = await prisma.source.update({
      where: { sourceId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.url && { url: data.url }),
        ...(data.publisher && { publisher: data.publisher }),
        ...(data.author !== undefined && { author: data.author }),
        ...(data.publicationDate !== undefined && { publicationDate: data.publicationDate }),
        ...(data.sourceType && { sourceType: data.sourceType }),
      },
    });
    return this.mapSource(row);
  }

  async delete(sourceId: string): Promise<SourceModel> {
    const row = await prisma.source.delete({
      where: { sourceId },
    });
    return this.mapSource(row);
  }

  // Equipment Sources
  async linkEquipment(
    equipmentId: string,
    sourceId: string,
    claimDescription?: string | null
  ): Promise<SourceLinkModel> {
    const row = await prisma.equipmentSource.upsert({
      where: { equipmentId_sourceId: { equipmentId, sourceId } },
      update: { claimDescription: claimDescription ?? null },
      create: { equipmentId, sourceId, claimDescription: claimDescription ?? null },
    });
    return { targetId: row.equipmentId, sourceId: row.sourceId, claimDescription: row.claimDescription };
  }

  async unlinkEquipment(equipmentId: string, sourceId: string): Promise<void> {
    await prisma.equipmentSource.delete({
      where: { equipmentId_sourceId: { equipmentId, sourceId } },
    });
  }

  // Mission Sources
  async linkMission(missionId: string, sourceId: string, claimDescription?: string | null): Promise<SourceLinkModel> {
    const row = await prisma.missionSource.upsert({
      where: { missionId_sourceId: { missionId, sourceId } },
      update: { claimDescription: claimDescription ?? null },
      create: { missionId, sourceId, claimDescription: claimDescription ?? null },
    });
    return { targetId: row.missionId, sourceId: row.sourceId, claimDescription: row.claimDescription };
  }

  async unlinkMission(missionId: string, sourceId: string): Promise<void> {
    await prisma.missionSource.delete({
      where: { missionId_sourceId: { missionId, sourceId } },
    });
  }

  // Event Sources
  async linkEvent(eventId: string, sourceId: string, claimDescription?: string | null): Promise<SourceLinkModel> {
    const row = await prisma.eventSource.upsert({
      where: { eventId_sourceId: { eventId, sourceId } },
      update: { claimDescription: claimDescription ?? null },
      create: { eventId, sourceId, claimDescription: claimDescription ?? null },
    });
    return { targetId: row.eventId, sourceId: row.sourceId, claimDescription: row.claimDescription };
  }

  async unlinkEvent(eventId: string, sourceId: string): Promise<void> {
    await prisma.eventSource.delete({
      where: { eventId_sourceId: { eventId, sourceId } },
    });
  }
}

export const sourceRepository = new SourceRepository();
