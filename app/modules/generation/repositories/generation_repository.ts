import { prisma } from '#infrastructure/database/prisma_client';
import type { PrismaClient } from '@prisma/client';
import type { GenerationKind, GenerationStatus } from '#shared/enums';
import type { GenerationJobDto } from '../models/generation_job.js';

export class GenerationRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient ?? prisma;
  }

  async create(data: {
    logbookEntryId: string;
    kind: GenerationKind;
    requestedById?: string | null;
    requestPayload: Record<string, any>;
    status?: GenerationStatus;
    externalJobId?: string | null;
  }): Promise<GenerationJobDto> {
    const row = await this.prisma.generationJob.create({
      data: {
        logbookEntryId: data.logbookEntryId,
        kind: data.kind,
        requestedById: data.requestedById ?? null,
        requestPayload: data.requestPayload,
        status: data.status ?? 'QUEUED',
        externalJobId: data.externalJobId ?? null,
      },
    });

    return this.mapToDto(row);
  }

  async findById(id: string): Promise<GenerationJobDto | null> {
    const row = await this.prisma.generationJob.findUnique({
      where: { id },
    });

    return row ? this.mapToDto(row) : null;
  }

  async findByExternalJobId(externalJobId: string): Promise<GenerationJobDto | null> {
    const row = await this.prisma.generationJob.findFirst({
      where: { externalJobId },
    });

    return row ? this.mapToDto(row) : null;
  }

  async update(
    id: string,
    data: {
      status?: GenerationStatus;
      externalJobId?: string | null;
      resultText?: string | null;
      resultUrl?: string | null;
      errorCode?: string | null;
      errorMessage?: string | null;
      attempts?: number;
      startedAt?: Date | null;
      finishedAt?: Date | null;
    }
  ): Promise<GenerationJobDto> {
    const updatePayload: Record<string, any> = {};
    if (data.status !== undefined) updatePayload['status'] = data.status;
    if (data.externalJobId !== undefined) updatePayload['externalJobId'] = data.externalJobId;
    if (data.resultText !== undefined) updatePayload['resultText'] = data.resultText;
    if (data.resultUrl !== undefined) updatePayload['resultUrl'] = data.resultUrl;
    if (data.errorCode !== undefined) updatePayload['errorCode'] = data.errorCode;
    if (data.errorMessage !== undefined) updatePayload['errorMessage'] = data.errorMessage;
    if (data.attempts !== undefined) updatePayload['attempts'] = data.attempts;
    if (data.startedAt !== undefined) updatePayload['startedAt'] = data.startedAt;
    if (data.finishedAt !== undefined) updatePayload['finishedAt'] = data.finishedAt;

    const row = await this.prisma.generationJob.update({
      where: { id },
      data: updatePayload as any,
    });

    return this.mapToDto(row);
  }

  async findAll(options: {
    status?: GenerationStatus;
    kind?: GenerationKind;
    logbookEntryId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ jobs: GenerationJobDto[]; total: number }> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};
    if (options.status) where['status'] = options.status;
    if (options.kind) where['kind'] = options.kind;
    if (options.logbookEntryId) where['logbookEntryId'] = options.logbookEntryId;

    const [rows, total] = await Promise.all([
      this.prisma.generationJob.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.generationJob.count({ where }),
    ]);

    return {
      jobs: rows.map((r) => this.mapToDto(r)),
      total,
    };
  }

  async checkLogbookEntryExists(id: string): Promise<boolean> {
    const results = await this.prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM logbook_entries WHERE id = ${id}::uuid LIMIT 1
    `;
    return results.length > 0;
  }

  async updateLogbookEntryWithResult(
    logbookEntryId: string,
    result: { articleMarkdown?: string | null; videoUrl?: string | null }
  ): Promise<void> {
    if (result.articleMarkdown) {
      await this.prisma.$executeRaw`
        UPDATE logbook_entries
        SET "articleMarkdown" = ${result.articleMarkdown}, "updatedAt" = NOW()
        WHERE id = ${logbookEntryId}::uuid
      `;
    }
    if (result.videoUrl) {
      await this.prisma.$executeRaw`
        UPDATE logbook_entries
        SET "videoUrl" = ${result.videoUrl}, "updatedAt" = NOW()
        WHERE id = ${logbookEntryId}::uuid
      `;
    }
  }

  private mapToDto(row: any): GenerationJobDto {
    return {
      id: row.id,
      logbookEntryId: row.logbookEntryId,
      kind: row.kind,
      status: row.status,
      externalJobId: row.externalJobId,
      requestedById: row.requestedById,
      requestPayload: row.requestPayload as Record<string, any>,
      resultText: row.resultText,
      resultUrl: row.resultUrl,
      errorCode: row.errorCode,
      errorMessage: row.errorMessage,
      attempts: row.attempts,
      createdAt: row.createdAt,
      startedAt: row.startedAt,
      finishedAt: row.finishedAt,
      updatedAt: row.updatedAt,
    };
  }
}

export const generationRepository = new GenerationRepository();
