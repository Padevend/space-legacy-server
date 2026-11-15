import { prismaClient, type ExtendedPrismaClient } from '#infrastructure/database/prisma_client';
import type { Prisma } from '@prisma/client';
import type { ArchiveModel } from '../models/archive.js';
import type { ArchiveMissionModel } from '../models/archive_mission.js';
import type { ArchiveEquipmentModel } from '../models/archive_equipment.js';
import type { ArchiveEventModel } from '../models/archive_event.js';
import type { ArchiveSourceModel } from '../models/archive_source.js';

export interface ArchiveListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  archiveProvider?: string | undefined;
  orderByField: 'archiveTitle' | 'archiveProvider' | 'retrievedAt';
  orderDirection: 'asc' | 'desc';
}

export class ArchiveRepository {
  constructor(private readonly prisma: ExtendedPrismaClient = prismaClient) {}

  private buildWhere(params: Partial<ArchiveListParams>): Prisma.ArchiveWhereInput {
    const where: Prisma.ArchiveWhereInput = {};

    if (params.search) {
      where.OR = [
        { archiveTitle: { contains: params.search, mode: 'insensitive' } },
        { externalId: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.archiveProvider) {
      where.archiveProvider = params.archiveProvider;
    }

    return where;
  }

  async findMany(params: ArchiveListParams): Promise<ArchiveModel[]> {
    const where = this.buildWhere(params);

    const rows = await this.prisma.archive.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.orderByField]: params.orderDirection,
      },
    });

    return rows as unknown as ArchiveModel[];
  }

  async count(params: Partial<ArchiveListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return this.prisma.archive.count({ where });
  }

  async findById(archiveId: string): Promise<ArchiveModel | null> {
    const row = await this.prisma.archive.findUnique({
      where: { archiveId },
    });
    return row as unknown as ArchiveModel | null;
  }

  async findByProviderAndExternalId(archiveProvider: string, externalId: string): Promise<ArchiveModel | null> {
    const row = await this.prisma.archive.findUnique({
      where: {
        archiveProvider_externalId: {
          archiveProvider,
          externalId,
        },
      },
    });
    return row as unknown as ArchiveModel | null;
  }

  async create(data: {
    externalId: string;
    archiveTitle: string;
    archiveProvider: string;
    originalUrl: string;
    rawContent: Record<string, unknown>;
    archiveVersion?: string | null;
    contentHash?: string | null;
  }): Promise<ArchiveModel> {
    const row = await this.prisma.archive.create({
      data: {
        externalId: data.externalId,
        archiveTitle: data.archiveTitle,
        archiveProvider: data.archiveProvider,
        originalUrl: data.originalUrl,
        rawContent: data.rawContent as Prisma.InputJsonValue,
        archiveVersion: data.archiveVersion ?? null,
        contentHash: data.contentHash ?? null,
      },
    });
    return row as unknown as ArchiveModel;
  }

  async delete(archiveId: string): Promise<ArchiveModel> {
    const row = await this.prisma.archive.delete({
      where: { archiveId },
    });
    return row as unknown as ArchiveModel;
  }

  // Relations
  async linkMission(archiveId: string, missionId: string, sectionName?: string | null): Promise<ArchiveMissionModel> {
    const cleanSectionName = sectionName ?? null;
    return this.prisma.archiveMission.upsert({
      where: { archiveId_missionId: { archiveId, missionId } },
      create: { archiveId, missionId, sectionName: cleanSectionName },
      update: { sectionName: cleanSectionName },
    });
  }

  async unlinkMission(archiveId: string, missionId: string): Promise<void> {
    await this.prisma.archiveMission.delete({
      where: { archiveId_missionId: { archiveId, missionId } },
    });
  }

  async linkEquipment(
    archiveId: string,
    equipmentId: string,
    sectionName?: string | null,
    extractedReference?: string | null
  ): Promise<ArchiveEquipmentModel> {
    const cleanSectionName = sectionName ?? null;
    const cleanExtractedReference = extractedReference ?? null;
    return this.prisma.archiveEquipment.upsert({
      where: { archiveId_equipmentId: { archiveId, equipmentId } },
      create: { archiveId, equipmentId, sectionName: cleanSectionName, extractedReference: cleanExtractedReference },
      update: { sectionName: cleanSectionName, extractedReference: cleanExtractedReference },
    });
  }

  async unlinkEquipment(archiveId: string, equipmentId: string): Promise<void> {
    await this.prisma.archiveEquipment.delete({
      where: { archiveId_equipmentId: { archiveId, equipmentId } },
    });
  }

  async linkEvent(
    archiveId: string,
    eventId: string,
    sectionName?: string | null,
    extractedReference?: string | null
  ): Promise<ArchiveEventModel> {
    const cleanSectionName = sectionName ?? null;
    const cleanExtractedReference = extractedReference ?? null;
    return this.prisma.archiveEvent.upsert({
      where: { archiveId_eventId: { archiveId, eventId } },
      create: { archiveId, eventId, sectionName: cleanSectionName, extractedReference: cleanExtractedReference },
      update: { sectionName: cleanSectionName, extractedReference: cleanExtractedReference },
    });
  }

  async unlinkEvent(archiveId: string, eventId: string): Promise<void> {
    await this.prisma.archiveEvent.delete({
      where: { archiveId_eventId: { archiveId, eventId } },
    });
  }

  async linkSource(archiveId: string, sourceId: string, referenceContext?: string | null): Promise<ArchiveSourceModel> {
    const cleanReferenceContext = referenceContext ?? null;
    return this.prisma.archiveSource.upsert({
      where: { archiveId_sourceId: { archiveId, sourceId } },
      create: { archiveId, sourceId, referenceContext: cleanReferenceContext },
      update: { referenceContext: cleanReferenceContext },
    });
  }

  async unlinkSource(archiveId: string, sourceId: string): Promise<void> {
    await this.prisma.archiveSource.delete({
      where: { archiveId_sourceId: { archiveId, sourceId } },
    });
  }
}

export const archiveRepository = new ArchiveRepository();
