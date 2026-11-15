import { prismaClient, type ExtendedPrismaClient } from '#infrastructure/database/prisma_client';
import type { Prisma } from '@prisma/client';
import type { IngestionRunModel } from '../models/ingestion_run.js';
import type { IngestionStatus } from '#shared/enums';

export interface IngestionRunListParams {
  skip: number;
  take: number;
  status?: IngestionStatus | undefined;
  orderByField: 'startedAt' | 'createdAt';
  orderDirection: 'asc' | 'desc';
}

export class IngestionRepository {
  constructor(private readonly prisma: ExtendedPrismaClient = prismaClient) {}

  async findMany(params: IngestionRunListParams): Promise<IngestionRunModel[]> {
    const where: Prisma.IngestionRunWhereInput = {};
    if (params.status) where.status = params.status;

    const rows = await this.prisma.ingestionRun.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.orderByField]: params.orderDirection },
    });

    return rows as unknown as IngestionRunModel[];
  }

  async count(status?: IngestionStatus): Promise<number> {
    const where: Prisma.IngestionRunWhereInput = status ? { status } : {};
    return this.prisma.ingestionRun.count({ where });
  }

  async findById(ingestionRunId: string): Promise<IngestionRunModel | null> {
    const row = await this.prisma.ingestionRun.findUnique({
      where: { ingestionRunId },
    });
    return row as unknown as IngestionRunModel | null;
  }

  async create(data: {
    status?: IngestionStatus;
    dryRun?: boolean;
    contentHash?: string | null;
  }): Promise<IngestionRunModel> {
    const row = await this.prisma.ingestionRun.create({
      data: {
        status: data.status ?? 'PENDING',
        dryRun: data.dryRun ?? false,
        contentHash: data.contentHash ?? null,
      },
    });
    return row as unknown as IngestionRunModel;
  }

  async update(
    ingestionRunId: string,
    data: {
      status?: IngestionStatus;
      countsSummary?: Record<string, number> | null;
      errorSummary?: string | null;
      completedAt?: Date | null;
      contentHash?: string | null;
    }
  ): Promise<IngestionRunModel> {
    const updateData: Prisma.IngestionRunUpdateInput = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.countsSummary !== undefined) updateData.countsSummary = data.countsSummary as Prisma.InputJsonValue;
    if (data.errorSummary !== undefined) updateData.errorSummary = data.errorSummary;
    if (data.completedAt !== undefined) updateData.completedAt = data.completedAt;
    if (data.contentHash !== undefined) updateData.contentHash = data.contentHash;

    const row = await this.prisma.ingestionRun.update({
      where: { ingestionRunId },
      data: updateData,
    });
    return row as unknown as IngestionRunModel;
  }
}

export const ingestionRepository = new IngestionRepository();
