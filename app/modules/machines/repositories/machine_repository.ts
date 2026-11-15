import { prisma } from '#infrastructure/database/prisma_client';
import type { Prisma } from '@prisma/client';
import type { MachineKind, MachineState, MediaLabel } from '#shared/enums';
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

  // Admin Methods
  async findAllAdmin(params: {
    bodyId?: string | undefined;
    kind?: MachineKind | undefined;
    state?: MachineState | undefined;
    isPublished?: boolean | undefined;
    q?: string | undefined;
    page: number;
    limit: number;
  }): Promise<{ items: any[]; total: number; page: number; limit: number; totalPages: number }> {
    const where: Prisma.MachineWhereInput = {};
    if (params.bodyId) where.bodyId = params.bodyId;
    if (params.kind) where.kind = params.kind;
    if (params.state) where.state = params.state;
    if (params.isPublished !== undefined) where.isPublished = params.isPublished;
    if (params.q) {
      where.OR = [
        { name: { contains: params.q, mode: 'insensitive' } },
        { summary: { contains: params.q, mode: 'insensitive' } },
      ];
    }

    const [total, rows] = await Promise.all([
      prisma.machine.count({ where }),
      prisma.machine.findMany({
        where,
        include: {
          body: { select: { id: true, slug: true, name: true } },
          images: { where: { isCover: true }, take: 1 },
        },
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
    ]);

    const items = rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      body: r.body,
      kind: r.kind,
      state: r.state,
      isPublished: r.isPublished,
      launchYear: r.launchYear,
      arrivalYear: r.arrivalYear,
      summary: r.summary,
      coverImage: r.images[0] ?? null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    return {
      items,
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit) || 1,
    };
  }

  async findById(id: string): Promise<any | null> {
    return prisma.machine.findUnique({
      where: { id },
      include: {
        body: true,
        sources: { orderBy: { title: 'asc' } },
        facts: { orderBy: { sortOrder: 'asc' }, include: { source: true } },
        events: { orderBy: { sortOrder: 'asc' }, include: { source: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async create(data: Prisma.MachineCreateInput): Promise<any> {
    return prisma.machine.create({
      data,
      include: {
        body: true,
        sources: true,
        facts: true,
        events: true,
        images: true,
      },
    });
  }

  async update(id: string, data: Partial<any>): Promise<any> {
    const payload: Record<string, any> = {};
    const fields = [
      'slug',
      'bodyId',
      'name',
      'kind',
      'state',
      'stateSince',
      'launchYear',
      'arrivalYear',
      'summary',
      'description',
      'missionPurpose',
      'howItWorked',
      'discoveries',
      'currentStatusNote',
      'latitude',
      'longitude',
      'isPublished',
    ];

    for (const f of fields) {
      if (data[f] !== undefined) {
        payload[f] = data[f];
      }
    }

    return prisma.machine.update({
      where: { id },
      data: payload,
      include: {
        body: true,
        sources: true,
        facts: true,
        events: true,
        images: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.machine.delete({
      where: { id },
    });
  }

  // Sources
  async findSourceById(machineId: string, sourceId: string): Promise<any | null> {
    return prisma.machineSource.findFirst({
      where: { id: sourceId, machineId },
    });
  }

  async createSource(machineId: string, data: { title: string; publisher: string; url: string }): Promise<any> {
    return prisma.machineSource.create({
      data: {
        machineId,
        title: data.title,
        publisher: data.publisher,
        url: data.url,
      },
    });
  }

  async updateSource(
    machineId: string,
    sourceId: string,
    data: Partial<{ title: string; publisher: string; url: string }>
  ): Promise<any> {
    const payload: Record<string, any> = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.publisher !== undefined) payload.publisher = data.publisher;
    if (data.url !== undefined) payload.url = data.url;

    return prisma.machineSource.update({
      where: { id: sourceId },
      data: payload,
    });
  }

  async deleteSource(machineId: string, sourceId: string): Promise<void> {
    await prisma.machineSource.delete({
      where: { id: sourceId },
    });
  }

  // Facts
  async findFactById(machineId: string, factId: string): Promise<any | null> {
    return prisma.machineFact.findFirst({
      where: { id: factId, machineId },
    });
  }

  async createFact(
    machineId: string,
    data: { label: string; value: string; unit?: string | null; sourceId: string; sortOrder?: number }
  ): Promise<any> {
    return prisma.machineFact.create({
      data: {
        machineId,
        label: data.label,
        value: data.value,
        unit: data.unit ?? null,
        sourceId: data.sourceId,
        sortOrder: data.sortOrder ?? 0,
      },
      include: { source: true },
    });
  }

  async updateFact(
    machineId: string,
    factId: string,
    data: Partial<{ label: string; value: string; unit: string | null; sourceId: string; sortOrder: number }>
  ): Promise<any> {
    const payload: Record<string, any> = {};
    if (data.label !== undefined) payload.label = data.label;
    if (data.value !== undefined) payload.value = data.value;
    if (data.unit !== undefined) payload.unit = data.unit;
    if (data.sourceId !== undefined) payload.sourceId = data.sourceId;
    if (data.sortOrder !== undefined) payload.sortOrder = data.sortOrder;

    return prisma.machineFact.update({
      where: { id: factId },
      data: payload,
      include: { source: true },
    });
  }

  async deleteFact(machineId: string, factId: string): Promise<void> {
    await prisma.machineFact.delete({
      where: { id: factId },
    });
  }

  // Events
  async findEventById(machineId: string, eventId: string): Promise<any | null> {
    return prisma.machineEvent.findFirst({
      where: { id: eventId, machineId },
    });
  }

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
  ): Promise<any> {
    return prisma.machineEvent.create({
      data: {
        machineId,
        dateLabel: data.dateLabel,
        dateIso: data.dateIso ?? null,
        title: data.title,
        description: data.description,
        sourceId: data.sourceId,
        sortOrder: data.sortOrder ?? 0,
      },
      include: { source: true },
    });
  }

  async updateEvent(
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
  ): Promise<any> {
    const payload: Record<string, any> = {};
    if (data.dateLabel !== undefined) payload.dateLabel = data.dateLabel;
    if (data.dateIso !== undefined) payload.dateIso = data.dateIso;
    if (data.title !== undefined) payload.title = data.title;
    if (data.description !== undefined) payload.description = data.description;
    if (data.sourceId !== undefined) payload.sourceId = data.sourceId;
    if (data.sortOrder !== undefined) payload.sortOrder = data.sortOrder;

    return prisma.machineEvent.update({
      where: { id: eventId },
      data: payload,
      include: { source: true },
    });
  }

  async deleteEvent(machineId: string, eventId: string): Promise<void> {
    await prisma.machineEvent.delete({
      where: { id: eventId },
    });
  }

  // Images
  async findImageById(machineId: string, imageId: string): Promise<any | null> {
    return prisma.machineImage.findFirst({
      where: { id: imageId, machineId },
    });
  }

  async createImage(
    machineId: string,
    data: {
      path: string;
      alt: string;
      label: MediaLabel;
      credit: string;
      sourceUrl?: string | null;
      width: number;
      height: number;
      isCover?: boolean;
      sortOrder?: number;
    }
  ): Promise<any> {
    if (data.isCover) {
      await prisma.machineImage.updateMany({
        where: { machineId, isCover: true },
        data: { isCover: false },
      });
    }

    return prisma.machineImage.create({
      data: {
        machineId,
        path: data.path,
        alt: data.alt,
        label: data.label,
        credit: data.credit,
        sourceUrl: data.sourceUrl ?? null,
        width: data.width,
        height: data.height,
        isCover: data.isCover ?? false,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async updateImage(
    machineId: string,
    imageId: string,
    data: Partial<{
      path: string;
      alt: string;
      label: MediaLabel;
      credit: string;
      sourceUrl: string | null;
      width: number;
      height: number;
      isCover: boolean;
      sortOrder: number;
    }>
  ): Promise<any> {
    if (data.isCover) {
      await prisma.machineImage.updateMany({
        where: { machineId, isCover: true },
        data: { isCover: false },
      });
    }

    const payload: Record<string, any> = {};
    if (data.path !== undefined) payload.path = data.path;
    if (data.alt !== undefined) payload.alt = data.alt;
    if (data.label !== undefined) payload.label = data.label;
    if (data.credit !== undefined) payload.credit = data.credit;
    if (data.sourceUrl !== undefined) payload.sourceUrl = data.sourceUrl;
    if (data.width !== undefined) payload.width = data.width;
    if (data.height !== undefined) payload.height = data.height;
    if (data.isCover !== undefined) payload.isCover = data.isCover;
    if (data.sortOrder !== undefined) payload.sortOrder = data.sortOrder;

    return prisma.machineImage.update({
      where: { id: imageId },
      data: payload,
    });
  }

  async deleteImage(machineId: string, imageId: string): Promise<void> {
    await prisma.machineImage.delete({
      where: { id: imageId },
    });
  }
}

export const machineRepository = new MachineRepository();
