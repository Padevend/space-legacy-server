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

  // Admin Operations
  async listAdminEntries(params: {
    machineId?: string | undefined;
    isPublished?: boolean | undefined;
    q?: string | undefined;
    page: number;
    limit: number;
  }) {
    return this.repo.findAllAdmin(params);
  }

  async getAdminEntryById(id: string) {
    const entry = await this.repo.findById(id);
    if (!entry) {
      throw new NotFoundError(`Logbook entry with id '${id}' not found.`);
    }
    return entry;
  }

  async createEntry(data: any) {
    if (data.isPublished && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    return this.repo.create(data);
  }

  async patchEntry(id: string, data: any) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Logbook entry with id '${id}' not found.`);
    }

    if (data.isPublished && !existing.publishedAt && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    return this.repo.update(id, data);
  }

  async deleteEntry(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Logbook entry with id '${id}' not found.`);
    }
    await this.repo.delete(id);
  }
}

export const logbookService = new LogbookService();
