import { machineRepository, MachineRepository } from '../repositories/machine_repository.js';
import type { MachineFilterQuery, MachineSummaryDto, MachineDetailDto } from '../validators/machine.js';
import { encodeCursor, decodeCursor } from '#shared/http';
import { NotFoundError } from '#shared/errors';
import { assertAllowedSourceUrl } from '#shared/security/sources';
import { AppException } from '#exceptions/app_exception';

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

  // Admin Operations
  async listAdminMachines(params: {
    bodyId?: string | undefined;
    kind?: any;
    state?: any;
    isPublished?: boolean | undefined;
    q?: string | undefined;
    page: number;
    limit: number;
  }) {
    return this.repo.findAllAdmin(params);
  }

  async getAdminMachineById(id: string) {
    const machine = await this.repo.findById(id);
    if (!machine) {
      throw AppException.notFound('Machine', `Machine with id '${id}' not found.`);
    }
    return machine;
  }

  async createMachine(data: any) {
    return this.repo.create(data);
  }

  async patchMachine(id: string, data: any) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw AppException.notFound('Machine', `Machine with id '${id}' not found.`);
    }
    return this.repo.update(id, data);
  }

  async deleteMachine(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw AppException.notFound('Machine', `Machine with id '${id}' not found.`);
    }
    await this.repo.delete(id);
  }

  // Sources
  async createSource(machineId: string, data: { title: string; publisher: string; url: string }) {
    await this.getAdminMachineById(machineId);
    assertAllowedSourceUrl(data.url);
    return this.repo.createSource(machineId, data);
  }

  async patchSource(
    machineId: string,
    sourceId: string,
    data: Partial<{ title: string; publisher: string; url: string }>
  ) {
    await this.getAdminMachineById(machineId);
    const existing = await this.repo.findSourceById(machineId, sourceId);
    if (!existing) {
      throw AppException.notFound('MachineSource', `Source with id '${sourceId}' not found on machine.`);
    }
    if (data.url) {
      assertAllowedSourceUrl(data.url);
    }
    return this.repo.updateSource(machineId, sourceId, data);
  }

  async deleteSource(machineId: string, sourceId: string) {
    await this.getAdminMachineById(machineId);
    const existing = await this.repo.findSourceById(machineId, sourceId);
    if (!existing) {
      throw AppException.notFound('MachineSource', `Source with id '${sourceId}' not found on machine.`);
    }
    await this.repo.deleteSource(machineId, sourceId);
  }

  // Facts
  async createFact(
    machineId: string,
    data: { label: string; value: string; unit?: string | null; sourceId: string; sortOrder?: number }
  ) {
    await this.getAdminMachineById(machineId);
    const source = await this.repo.findSourceById(machineId, data.sourceId);
    if (!source) {
      throw AppException.badRequest('Referenced sourceId does not exist on this machine.');
    }
    return this.repo.createFact(machineId, data);
  }

  async patchFact(
    machineId: string,
    factId: string,
    data: Partial<{ label: string; value: string; unit: string | null; sourceId: string; sortOrder: number }>
  ) {
    await this.getAdminMachineById(machineId);
    const existing = await this.repo.findFactById(machineId, factId);
    if (!existing) {
      throw AppException.notFound('MachineFact', `Fact with id '${factId}' not found on machine.`);
    }
    if (data.sourceId) {
      const source = await this.repo.findSourceById(machineId, data.sourceId);
      if (!source) {
        throw AppException.badRequest('Referenced sourceId does not exist on this machine.');
      }
    }
    return this.repo.updateFact(machineId, factId, data);
  }

  async deleteFact(machineId: string, factId: string) {
    await this.getAdminMachineById(machineId);
    const existing = await this.repo.findFactById(machineId, factId);
    if (!existing) {
      throw AppException.notFound('MachineFact', `Fact with id '${factId}' not found on machine.`);
    }
    await this.repo.deleteFact(machineId, factId);
  }

  // Events
  async createEvent(
    machineId: string,
    data: {
      dateLabel: string;
      dateIso?: Date | null;
      title: string;
      description: string;
      sourceId: string;
      sortOrder?: number;
    }
  ) {
    await this.getAdminMachineById(machineId);
    const source = await this.repo.findSourceById(machineId, data.sourceId);
    if (!source) {
      throw AppException.badRequest('Referenced sourceId does not exist on this machine.');
    }
    return this.repo.createEvent(machineId, data);
  }

  async patchEvent(
    machineId: string,
    eventId: string,
    data: Partial<{
      dateLabel: string;
      dateIso: Date | null;
      title: string;
      description: string;
      sourceId: string;
      sortOrder: number;
    }>
  ) {
    await this.getAdminMachineById(machineId);
    const existing = await this.repo.findEventById(machineId, eventId);
    if (!existing) {
      throw AppException.notFound('MachineEvent', `Event with id '${eventId}' not found on machine.`);
    }
    if (data.sourceId) {
      const source = await this.repo.findSourceById(machineId, data.sourceId);
      if (!source) {
        throw AppException.badRequest('Referenced sourceId does not exist on this machine.');
      }
    }
    return this.repo.updateEvent(machineId, eventId, data);
  }

  async deleteEvent(machineId: string, eventId: string) {
    await this.getAdminMachineById(machineId);
    const existing = await this.repo.findEventById(machineId, eventId);
    if (!existing) {
      throw AppException.notFound('MachineEvent', `Event with id '${eventId}' not found on machine.`);
    }
    await this.repo.deleteEvent(machineId, eventId);
  }

  // Images
  async createImage(machineId: string, data: any) {
    await this.getAdminMachineById(machineId);
    return this.repo.createImage(machineId, data);
  }

  async patchImage(machineId: string, imageId: string, data: any) {
    await this.getAdminMachineById(machineId);
    const existing = await this.repo.findImageById(machineId, imageId);
    if (!existing) {
      throw AppException.notFound('MachineImage', `Image with id '${imageId}' not found on machine.`);
    }
    return this.repo.updateImage(machineId, imageId, data);
  }

  async deleteImage(machineId: string, imageId: string) {
    await this.getAdminMachineById(machineId);
    const existing = await this.repo.findImageById(machineId, imageId);
    if (!existing) {
      throw AppException.notFound('MachineImage', `Image with id '${imageId}' not found on machine.`);
    }
    await this.repo.deleteImage(machineId, imageId);
  }
}

export const machineService = new MachineService();
