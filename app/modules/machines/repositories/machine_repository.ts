import { prisma } from '#infrastructure/database/prisma_client';
import type { Prisma } from '@prisma/client';
import type { MachineKind, MachineState } from '#shared/enums';
import type { MachineDetailModel, MachineSummaryModel } from '../models/machine.js';

export interface MachineFindFilters {
  bodySlug?: string | undefined;
  bodyId?: string | undefined;
  kind?: MachineKind | undefined;
  state?: MachineState | undefined;
  decade?: number | undefined;
  q?: string | undefined;
}

export interface MachineFindPaginatedParams {
  filters: MachineFindFilters;
  limit: number;
  cursor?: { id: string; arrivalYear: number | null; createdAt: Date } | undefined;
}

export interface MachineFacets {
  kinds: Record<string, number>;
  states: Record<string, number>;
  decades: Record<string, number>;
}

export class MachineRepository {
  async findPublishedPaginated(params: MachineFindPaginatedParams): Promise<{
    items: MachineSummaryModel[];
    nextCursor: { id: string; arrivalYear: number | null; createdAt: Date } | null;
    total: number;
  }> {
    const where: Prisma.MachineWhereInput = {
      isPublished: true,
    };

    if (params.filters.bodySlug) {
      where.body = { slug: params.filters.bodySlug, isPublished: true };
    } else if (params.filters.bodyId) {
      where.bodyId = params.filters.bodyId;
    }

    if (params.filters.kind) {
      where.kind = params.filters.kind;
    }

    if (params.filters.state) {
      where.state = params.filters.state;
    }

    if (params.filters.decade !== undefined) {
      const startYear = params.filters.decade;
      const endYear = startYear + 9;
      where.arrivalYear = {
        gte: startYear,
        lte: endYear,
      };
    }

    if (params.filters.q) {
      where.OR = [
        { name: { contains: params.filters.q, mode: 'insensitive' } },
        { summary: { contains: params.filters.q, mode: 'insensitive' } },
        { description: { contains: params.filters.q, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.machine.count({ where });
    const limitNumber = typeof params.limit === 'number' ? params.limit : parseInt(String(params.limit), 10);

    const rows = await prisma.machine.findMany({
      where,
      orderBy: [{ arrivalYear: { sort: 'asc', nulls: 'last' } }, { createdAt: 'asc' }, { id: 'asc' }],
      take: limitNumber + 1,
      ...(params.cursor
        ? {
            cursor: { id: params.cursor.id },
            skip: 1,
          }
        : {}),
      include: {
        body: true,
        images: {
          where: { isCover: true },
          take: 1,
        },
      },
    });

    let nextCursor: { id: string; arrivalYear: number | null; createdAt: Date } | null = null;
    let sliced = rows;

    if (rows.length > limitNumber) {
      sliced = rows.slice(0, limitNumber);
      const last = sliced[sliced.length - 1];
      if (last) {
        nextCursor = {
          id: last.id,
          arrivalYear: last.arrivalYear,
          createdAt: last.createdAt,
        };
      }
    }

    const items: MachineSummaryModel[] = sliced.map((row) => ({
      id: row.id,
      slug: row.slug,
      bodyId: row.bodyId,
      bodySlug: row.body.slug,
      bodyName: row.body.name,
      name: row.name,
      kind: row.kind,
      state: row.state,
      stateSince: row.stateSince,
      launchYear: row.launchYear,
      arrivalYear: row.arrivalYear,
      summary: row.summary,
      coverImage: row.images[0]
        ? {
            id: row.images[0].id,
            machineId: row.images[0].machineId,
            path: row.images[0].path,
            alt: row.images[0].alt,
            label: row.images[0].label,
            credit: row.images[0].credit,
            sourceUrl: row.images[0].sourceUrl,
            width: row.images[0].width,
            height: row.images[0].height,
            isCover: row.images[0].isCover,
            sortOrder: row.images[0].sortOrder,
          }
        : null,
    }));

    return { items, nextCursor, total };
  }

  async calculateFacets(baseFilters: {
    bodySlug?: string | undefined;
    bodyId?: string | undefined;
  }): Promise<MachineFacets> {
    const where: Prisma.MachineWhereInput = {
      isPublished: true,
    };

    if (baseFilters.bodySlug) {
      where.body = { slug: baseFilters.bodySlug, isPublished: true };
    } else if (baseFilters.bodyId) {
      where.bodyId = baseFilters.bodyId;
    }

    const machines = await prisma.machine.findMany({
      where,
      select: {
        kind: true,
        state: true,
        arrivalYear: true,
      },
    });

    const kinds: Record<string, number> = {};
    const states: Record<string, number> = {};
    const decades: Record<string, number> = {};

    for (const m of machines) {
      kinds[m.kind] = (kinds[m.kind] || 0) + 1;
      states[m.state] = (states[m.state] || 0) + 1;

      if (m.arrivalYear !== null) {
        const dec = Math.floor(m.arrivalYear / 10) * 10;
        decades[dec.toString()] = (decades[dec.toString()] || 0) + 1;
      }
    }

    return { kinds, states, decades };
  }

  async findPublishedBySlug(slug: string): Promise<MachineDetailModel | null> {
    const row = await prisma.machine.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        body: true,
        sources: true,
        facts: {
          orderBy: { sortOrder: 'asc' },
          include: { source: true },
        },
        events: {
          orderBy: { sortOrder: 'asc' },
          include: { source: true },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!row) return null;

    return {
      id: row.id,
      slug: row.slug,
      bodyId: row.bodyId,
      body: {
        id: row.body.id,
        slug: row.body.slug,
        name: row.body.name,
      },
      name: row.name,
      kind: row.kind,
      state: row.state,
      stateSince: row.stateSince,
      launchYear: row.launchYear,
      arrivalYear: row.arrivalYear,
      summary: row.summary,
      description: row.description,
      missionPurpose: row.missionPurpose,
      howItWorked: row.howItWorked,
      discoveries: row.discoveries,
      currentStatusNote: row.currentStatusNote,
      latitude: row.latitude,
      longitude: row.longitude,
      sources: row.sources.map((s) => ({
        id: s.id,
        machineId: s.machineId,
        title: s.title,
        publisher: s.publisher,
        url: s.url,
      })),
      facts: row.facts.map((f) => ({
        id: f.id,
        machineId: f.machineId,
        label: f.label,
        value: f.value,
        unit: f.unit,
        sourceId: f.sourceId,
        sortOrder: f.sortOrder,
        source: f.source
          ? {
              id: f.source.id,
              machineId: f.source.machineId,
              title: f.source.title,
              publisher: f.source.publisher,
              url: f.source.url,
            }
          : undefined,
      })),
      events: row.events.map((e) => ({
        id: e.id,
        machineId: e.machineId,
        dateLabel: e.dateLabel,
        dateIso: e.dateIso,
        title: e.title,
        description: e.description,
        sourceId: e.sourceId,
        sortOrder: e.sortOrder,
        source: e.source
          ? {
              id: e.source.id,
              machineId: e.source.machineId,
              title: e.source.title,
              publisher: e.source.publisher,
              url: e.source.url,
            }
          : undefined,
      })),
      images: row.images.map((img) => ({
        id: img.id,
        machineId: img.machineId,
        path: img.path,
        alt: img.alt,
        label: img.label,
        credit: img.credit,
        sourceUrl: img.sourceUrl,
        width: img.width,
        height: img.height,
        isCover: img.isCover,
        sortOrder: img.sortOrder,
      })),
    };
  }
}

export const machineRepository = new MachineRepository();
