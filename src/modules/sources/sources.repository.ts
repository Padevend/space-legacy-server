import { prisma } from '../../core/database/prisma.js';
import type { Source, Prisma, SourceType } from '@prisma/client';

export interface SourceListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  sourceType?: SourceType | undefined;
  publisher?: string | undefined;
  orderByField: 'title' | 'publicationDate' | 'accessedAt';
  orderDirection: 'asc' | 'desc';
}

export class SourcesRepository {
  private buildWhere(params: Partial<SourceListParams>): Prisma.SourceWhereInput {
    const where: Prisma.SourceWhereInput = {};

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
      where.publisher = {
        contains: params.publisher,
        mode: 'insensitive',
      };
    }

    return where;
  }

  async findMany(params: SourceListParams): Promise<Source[]> {
    const where = this.buildWhere(params);

    return prisma.source.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.orderByField]: params.orderDirection,
      },
    });
  }

  async count(params: Partial<SourceListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return prisma.source.count({ where });
  }

  async findById(sourceId: string): Promise<Source | null> {
    return prisma.source.findUnique({
      where: { sourceId },
    });
  }

  async findByUrl(url: string): Promise<Source | null> {
    return prisma.source.findUnique({
      where: { url },
    });
  }

  async create(data: {
    title: string;
    url: string;
    publisher: string;
    sourceType: SourceType;
    author?: string | null | undefined;
    publicationDate?: Date | null | undefined;
  }): Promise<Source> {
    return prisma.source.create({
      data: {
        title: data.title,
        url: data.url,
        publisher: data.publisher,
        sourceType: data.sourceType,
        author: data.author ?? null,
        publicationDate: data.publicationDate ?? null,
      },
    });
  }

  async update(
    sourceId: string,
    data: {
      title?: string | undefined;
      url?: string | undefined;
      publisher?: string | undefined;
      sourceType?: SourceType | undefined;
      author?: string | null | undefined;
      publicationDate?: Date | null | undefined;
    }
  ): Promise<Source> {
    return prisma.source.update({
      where: { sourceId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.url !== undefined && { url: data.url }),
        ...(data.publisher !== undefined && { publisher: data.publisher }),
        ...(data.sourceType !== undefined && { sourceType: data.sourceType }),
        ...(data.author !== undefined && { author: data.author }),
        ...(data.publicationDate !== undefined && { publicationDate: data.publicationDate }),
      },
    });
  }

  async delete(sourceId: string): Promise<Source> {
    return prisma.source.delete({
      where: { sourceId },
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

export const sourcesRepository = new SourcesRepository();
