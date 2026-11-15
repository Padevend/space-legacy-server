import type { PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from '#infrastructure/database/prisma_client';
import type { LogbookMachineContext } from '../models/logbook_entry.js';

export class LogbookRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient ?? defaultPrisma;
  }

  /**
   * Check if a published machine exists with the specified slug.
   * Uses $queryRaw to respect module ownership isolation.
   */
  async findPublishedMachineBySlug(machineSlug: string): Promise<LogbookMachineContext | null> {
    const rows = await this.prisma.$queryRaw<Array<{ id: string; slug: string; name: string }>>`
      SELECT id, slug, name
      FROM machines
      WHERE slug = ${machineSlug} AND "isPublished" = true
      LIMIT 1
    `;

    return rows[0] ?? null;
  }

  /**
   * Find all published logbook entries for a given machine slug.
   */
  async findPublishedEntriesByMachineSlug(machineSlug: string) {
    return this.prisma.logbookEntry.findMany({
      where: {
        isPublished: true,
        machine: {
          slug: machineSlug,
          isPublished: true,
        },
      },
      include: {
        machine: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Find a specific published logbook entry by machine slug and entry slug.
   */
  async findPublishedEntryByMachineAndSlug(machineSlug: string, entrySlug: string) {
    return this.prisma.logbookEntry.findFirst({
      where: {
        slug: entrySlug,
        isPublished: true,
        machine: {
          slug: machineSlug,
          isPublished: true,
        },
      },
      include: {
        machine: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    });
  }

  // Admin Methods
  async findAllAdmin(params: {
    machineId?: string | undefined;
    isPublished?: boolean | undefined;
    q?: string | undefined;
    page: number;
    limit: number;
  }) {
    const where: any = {};
    if (params.machineId) where.machineId = params.machineId;
    if (params.isPublished !== undefined) where.isPublished = params.isPublished;
    if (params.q) {
      where.OR = [
        { title: { contains: params.q, mode: 'insensitive' } },
        { summary: { contains: params.q, mode: 'insensitive' } },
      ];
    }

    const [total, rows] = await Promise.all([
      this.prisma.logbookEntry.count({ where }),
      this.prisma.logbookEntry.findMany({
        where,
        include: {
          machine: {
            select: { id: true, slug: true, name: true },
          },
        },
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
    ]);

    return {
      items: rows,
      total,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(total / params.limit) || 1,
    };
  }

  async findById(id: string) {
    return this.prisma.logbookEntry.findUnique({
      where: { id },
      include: {
        machine: {
          select: { id: true, slug: true, name: true },
        },
      },
    });
  }

  async create(data: any) {
    return this.prisma.logbookEntry.create({
      data,
      include: {
        machine: {
          select: { id: true, slug: true, name: true },
        },
      },
    });
  }

  async update(id: string, data: any) {
    const payload: Record<string, any> = {};
    const fields = [
      'machineId',
      'slug',
      'title',
      'summary',
      'articleMarkdown',
      'articleOrigin',
      'videoUrl',
      'videoOrigin',
      'videoDurationSec',
      'isPublished',
      'publishedAt',
    ];

    for (const f of fields) {
      if (data[f] !== undefined) {
        payload[f] = data[f];
      }
    }

    return this.prisma.logbookEntry.update({
      where: { id },
      data: payload,
      include: {
        machine: {
          select: { id: true, slug: true, name: true },
        },
      },
    });
  }

  async delete(id: string) {
    await this.prisma.logbookEntry.delete({
      where: { id },
    });
  }
}

export const logbookRepository = new LogbookRepository();
