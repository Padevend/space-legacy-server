import { logbookRepository, LogbookRepository } from '../repositories/logbook_repository.js';
import type { LogbookEntrySummary, LogbookEntryDetail } from '../models/logbook_entry.js';
import { NotFoundError } from '#shared/errors';

export class LogbookService {
  private repo: LogbookRepository;

  constructor(repo?: LogbookRepository) {
    this.repo = repo ?? logbookRepository;
  }

  async listMachineEntries(machineSlug: string): Promise<{
    machine: { id: string; slug: string; name: string };
    entries: LogbookEntrySummary[];
    data: LogbookEntrySummary[];
  }> {
    const machine = await this.repo.findPublishedMachineBySlug(machineSlug);
    if (!machine) {
      throw new NotFoundError(`Machine with slug '${machineSlug}' not found.`);
    }

    const rows = await this.repo.findPublishedEntriesByMachineSlug(machineSlug);

    const entries: LogbookEntrySummary[] = rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      articleOrigin: row.articleOrigin,
      videoUrl: row.videoUrl,
      videoOrigin: row.videoOrigin,
      videoDurationSec: row.videoDurationSec,
      isPublished: row.isPublished,
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      machine: {
        id: row.machine.id,
        slug: row.machine.slug,
        name: row.machine.name,
      },
    }));

    return {
      machine,
      entries,
      data: entries,
    };
  }

  async getMachineEntry(machineSlug: string, entrySlug: string): Promise<LogbookEntryDetail> {
    const row = await this.repo.findPublishedEntryByMachineAndSlug(machineSlug, entrySlug);

    if (!row) {
      const machine = await this.repo.findPublishedMachineBySlug(machineSlug);
      if (!machine) {
        throw new NotFoundError(`Machine with slug '${machineSlug}' not found.`);
      }
      throw new NotFoundError(`Logbook entry '${entrySlug}' not found for machine '${machineSlug}'.`);
    }

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      articleMarkdown: row.articleMarkdown,
      articleOrigin: row.articleOrigin,
      videoUrl: row.videoUrl,
      videoOrigin: row.videoOrigin,
      videoDurationSec: row.videoDurationSec,
      isPublished: row.isPublished,
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      machine: {
        id: row.machine.id,
        slug: row.machine.slug,
        name: row.machine.name,
      },
    };
  }
}

export const logbookService = new LogbookService();
