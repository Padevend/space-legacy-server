import { prisma } from '#infrastructure/database/prisma_client';
import type { IngestionStatus } from '#shared/enums';
import type { ValidatedBundle, IngestionBatchDto } from '../models/ingestion_batch.js';

export class IngestionRepository {
  async createBatch(data: {
    requestedById?: string | null;
    filename: string;
    sizeBytes: number;
    sha256: string;
    status?: IngestionStatus;
  }): Promise<IngestionBatchDto> {
    const row = await prisma.ingestionBatch.create({
      data: {
        requestedById: data.requestedById ?? null,
        filename: data.filename,
        sizeBytes: data.sizeBytes,
        sha256: data.sha256,
        status: data.status ?? 'RECEIVED',
      },
    });

    return {
      id: row.id,
      requestedById: row.requestedById,
      filename: row.filename,
      sizeBytes: row.sizeBytes,
      sha256: row.sha256,
      status: row.status,
      rejectCode: row.rejectCode,
      rejectReason: row.rejectReason,
      report: row.report as any,
      createdAt: row.createdAt,
      finishedAt: row.finishedAt,
    };
  }

  async updateBatch(
    id: string,
    data: {
      status?: IngestionStatus;
      rejectCode?: string | null;
      rejectReason?: string | null;
      report?: any;
      finishedAt?: Date | null;
    }
  ): Promise<IngestionBatchDto> {
    const updatePayload: Record<string, any> = {};
    if (data.status !== undefined) updatePayload['status'] = data.status;
    if (data.rejectCode !== undefined) updatePayload['rejectCode'] = data.rejectCode;
    if (data.rejectReason !== undefined) updatePayload['rejectReason'] = data.rejectReason;
    if (data.report !== undefined) updatePayload['report'] = data.report;
    if (data.finishedAt !== undefined) updatePayload['finishedAt'] = data.finishedAt;

    const row = await prisma.ingestionBatch.update({
      where: { id },
      data: updatePayload as any,
    });

    return {
      id: row.id,
      requestedById: row.requestedById,
      filename: row.filename,
      sizeBytes: row.sizeBytes,
      sha256: row.sha256,
      status: row.status,
      rejectCode: row.rejectCode,
      rejectReason: row.rejectReason,
      report: row.report as any,
      createdAt: row.createdAt,
      finishedAt: row.finishedAt,
    };
  }

  async findBatchById(id: string): Promise<IngestionBatchDto | null> {
    const row = await prisma.ingestionBatch.findUnique({
      where: { id },
    });

    if (!row) return null;

    return {
      id: row.id,
      requestedById: row.requestedById,
      filename: row.filename,
      sizeBytes: row.sizeBytes,
      sha256: row.sha256,
      status: row.status,
      rejectCode: row.rejectCode,
      rejectReason: row.rejectReason,
      report: row.report as any,
      createdAt: row.createdAt,
      finishedAt: row.finishedAt,
    };
  }

  async findCelestialBodyBySlug(slug: string): Promise<{ id: string; slug: string; name: string } | null> {
    return prisma.celestialBody.findUnique({
      where: { slug },
      select: { id: true, slug: true, name: true },
    });
  }

  async findMachineBySlug(slug: string): Promise<{ id: string; slug: string; name: string } | null> {
    return prisma.machine.findUnique({
      where: { slug },
      select: { id: true, slug: true, name: true },
    });
  }

  async upsertBundleData(bundle: ValidatedBundle): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // 1. Process Machines
      for (const item of bundle.machines) {
        const { slug, data, bodyId, imageBuffers } = item;

        // Upsert machine base record
        const machine = await tx.machine.upsert({
          where: { slug },
          update: {
            bodyId,
            name: data.name,
            kind: data.kind,
            state: data.state,
            stateSince: data.stateSince ?? null,
            launchYear: data.launchYear ?? null,
            arrivalYear: data.arrivalYear ?? null,
            summary: data.summary,
            description: data.description,
            missionPurpose: data.missionPurpose,
            howItWorked: data.howItWorked,
            discoveries: data.discoveries,
            currentStatusNote: data.currentStatusNote ?? null,
            latitude: data.latitude ?? null,
            longitude: data.longitude ?? null,
            isPublished: data.isPublished ?? false,
          },
          create: {
            slug,
            bodyId,
            name: data.name,
            kind: data.kind,
            state: data.state,
            stateSince: data.stateSince ?? null,
            launchYear: data.launchYear ?? null,
            arrivalYear: data.arrivalYear ?? null,
            summary: data.summary,
            description: data.description,
            missionPurpose: data.missionPurpose,
            howItWorked: data.howItWorked,
            discoveries: data.discoveries,
            currentStatusNote: data.currentStatusNote ?? null,
            latitude: data.latitude ?? null,
            longitude: data.longitude ?? null,
            isPublished: data.isPublished ?? false,
          },
        });

        // Upsert sources and build key -> sourceId map
        const sourceMap = new Map<string, string>();
        for (const src of data.sources) {
          const sourceRecord = await tx.machineSource.upsert({
            where: {
              machineId_url: {
                machineId: machine.id,
                url: src.url,
              },
            },
            update: {
              title: src.title,
              publisher: src.publisher,
            },
            create: {
              machineId: machine.id,
              title: src.title,
              publisher: src.publisher,
              url: src.url,
            },
          });
          sourceMap.set(src.key, sourceRecord.id);
        }

        // Replace facts
        await tx.machineFact.deleteMany({ where: { machineId: machine.id } });
        if (data.facts.length > 0) {
          await tx.machineFact.createMany({
            data: data.facts.map((f) => ({
              machineId: machine.id,
              label: f.label,
              value: f.value,
              unit: f.unit ?? null,
              sourceId: sourceMap.get(f.sourceKey)!,
              sortOrder: f.sortOrder ?? 0,
            })),
          });
        }

        // Replace timeline events
        await tx.machineEvent.deleteMany({ where: { machineId: machine.id } });
        if (data.timeline.length > 0) {
          await tx.machineEvent.createMany({
            data: data.timeline.map((ev) => ({
              machineId: machine.id,
              dateLabel: ev.dateLabel,
              dateIso: ev.dateIso ? new Date(ev.dateIso) : null,
              title: ev.title,
              description: ev.description,
              sourceId: sourceMap.get(ev.sourceKey)!,
              sortOrder: ev.sortOrder ?? 0,
            })),
          });
        }

        // Replace images
        await tx.machineImage.deleteMany({ where: { machineId: machine.id } });
        if (imageBuffers.length > 0) {
          await tx.machineImage.createMany({
            data: imageBuffers.map((img) => ({
              machineId: machine.id,
              path: `/images/machines/${slug}/${img.filename}`,
              alt: img.meta.alt,
              label: img.meta.label,
              credit: img.meta.credit,
              sourceUrl: img.meta.sourceUrl ?? null,
              width: img.meta.width,
              height: img.meta.height,
              isCover: img.meta.isCover ?? false,
              sortOrder: img.meta.sortOrder ?? 0,
            })),
          });
        }
      }

      // 2. Process Quizzes
      for (const item of bundle.quizzes) {
        const { slug, data, bodyId, machineId } = item;

        const quiz = await tx.quiz.upsert({
          where: { slug },
          update: {
            title: data.title,
            level: data.level,
            bodyId: bodyId ?? null,
            machineId: machineId ?? null,
            isPublished: data.isPublished ?? false,
          },
          create: {
            slug,
            title: data.title,
            level: data.level,
            bodyId: bodyId ?? null,
            machineId: machineId ?? null,
            isPublished: data.isPublished ?? false,
          },
        });

        // Delete existing questions and options for this quiz
        await tx.quizQuestion.deleteMany({ where: { quizId: quiz.id } });

        // Re-create questions and options
        for (const q of data.questions) {
          const question = await tx.quizQuestion.create({
            data: {
              quizId: quiz.id,
              prompt: q.prompt,
              explanation: q.explanation,
              sortOrder: q.sortOrder ?? 0,
            },
          });

          await tx.quizOption.createMany({
            data: q.options.map((opt) => ({
              questionId: question.id,
              label: opt.label,
              isCorrect: opt.isCorrect,
              sortOrder: opt.sortOrder ?? 0,
            })),
          });
        }
      }
    });
  }
}

export const ingestionRepository = new IngestionRepository();
