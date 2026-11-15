import { machineRepository, MachineRepository } from '../repositories/machine_repository.js';
import type { MachineFilterQuery, MachineSummaryDto, MachineDetailDto } from '../validators/machine.js';
import { encodeCursor, decodeCursor } from '#shared/http';
import { NotFoundError } from '#shared/errors';

export interface PaginatedMachinesResult {
  data: MachineSummaryDto[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
    total: number;
  };
  facets: {
    kinds: Record<string, number>;
    states: Record<string, number>;
    decades: Record<string, number>;
  };
}

export class MachineService {
  constructor(private repo: MachineRepository = machineRepository) {}

  async listMachines(query: MachineFilterQuery): Promise<PaginatedMachinesResult> {
    let decodedCursor: { id: string; arrivalYear: number | null; createdAt: Date } | undefined;
    if (query.cursor) {
      const raw = decodeCursor<{ id: string; arrivalYear: number | null; createdAt: string }>(query.cursor);
      if (raw && raw.id) {
        decodedCursor = {
          id: raw.id,
          arrivalYear: raw.arrivalYear,
          createdAt: new Date(raw.createdAt),
        };
      }
    }

    const { items, nextCursor, total } = await this.repo.findPublishedPaginated({
      filters: {
        bodySlug: query.body,
        kind: query.kind,
        state: query.state,
        decade: query.decade,
        q: query.q,
      },
      limit: query.limit,
      cursor: decodedCursor,
    });

    const facets = await this.repo.calculateFacets({
      bodySlug: query.body,
    });

    const encodedNextCursor = nextCursor
      ? encodeCursor({
          id: nextCursor.id,
          arrivalYear: nextCursor.arrivalYear,
          createdAt: nextCursor.createdAt.toISOString(),
        })
      : null;

    const data: MachineSummaryDto[] = items.map((m) => ({
      id: m.id,
      slug: m.slug,
      body: {
        id: m.bodyId,
        slug: m.bodySlug,
        name: m.bodyName,
      },
      name: m.name,
      kind: m.kind,
      state: m.state,
      stateSince: m.stateSince,
      launchYear: m.launchYear,
      arrivalYear: m.arrivalYear,
      summary: m.summary,
      coverImage: m.coverImage,
    }));

    return {
      data,
      pagination: {
        nextCursor: encodedNextCursor,
        hasMore: encodedNextCursor !== null,
        total,
      },
      facets,
    };
  }

  async getMachineBySlug(slug: string): Promise<MachineDetailDto> {
    const machine = await this.repo.findPublishedBySlug(slug);
    if (!machine) {
      throw new NotFoundError(`Machine with slug '${slug}' not found.`);
    }

    return {
      id: machine.id,
      slug: machine.slug,
      body: machine.body,
      name: machine.name,
      kind: machine.kind,
      state: machine.state,
      stateSince: machine.stateSince,
      launchYear: machine.launchYear,
      arrivalYear: machine.arrivalYear,
      summary: machine.summary,
      description: machine.description,
      missionPurpose: machine.missionPurpose,
      howItWorked: machine.howItWorked,
      discoveries: machine.discoveries,
      currentStatusNote: machine.currentStatusNote,
      latitude: machine.latitude,
      longitude: machine.longitude,
      sources: machine.sources,
      facts: machine.facts,
      events: machine.events.map((e) => ({
        ...e,
        dateIso: e.dateIso ? e.dateIso.toISOString() : null,
      })),
      images: machine.images,
    };
  }
}

export const machineService = new MachineService();
