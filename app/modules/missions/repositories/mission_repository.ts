import { prisma } from '#infrastructure/database/prisma_client';
import type { MissionModel } from '../models/mission.js';
import type { MissionEquipmentModel } from '../models/mission_equipment.js';
import type { MissionStatus } from '#shared/enums';

export interface MissionListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  missionStatus?: MissionStatus | undefined;
  agency?: string | undefined;
  orderByField: 'name' | 'createdAt' | 'updatedAt';
  orderDirection: 'asc' | 'desc';
}

export class MissionRepository {
  private mapMission(row: any): MissionModel {
    return {
      missionId: row.missionId,
      name: row.name,
      slug: row.slug,
      description: row.description,
      agency: row.agency,
      missionStatus: row.missionStatus,
      equipment: row.equipment?.map((e: any) => ({
        missionId: e.missionId,
        equipmentId: e.equipmentId,
        name: e.equipment?.name ?? '',
        slug: e.equipment?.slug ?? '',
        missionRole: e.missionRole ?? e.role ?? '',
        participationDescription: e.participationDescription ?? null,
      })),
      sources: row.sources?.map((s: any) => ({
        sourceId: s.sourceId,
        title: s.source?.title ?? '',
        url: s.source?.url ?? '',
        claimDescription: s.claimDescription ?? null,
      })),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async findMany(params: MissionListParams): Promise<MissionModel[]> {
    const where: any = {};
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.missionStatus) {
      where.missionStatus = params.missionStatus;
    }
    if (params.agency) {
      where.agency = { contains: params.agency, mode: 'insensitive' };
    }

    const rows = await prisma.mission.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.orderByField]: params.orderDirection },
    });
    return rows.map((r) => this.mapMission(r));
  }

  async count(params: Partial<MissionListParams>): Promise<number> {
    const where: any = {};
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.missionStatus) {
      where.missionStatus = params.missionStatus;
    }
    if (params.agency) {
      where.agency = { contains: params.agency, mode: 'insensitive' };
    }
    return prisma.mission.count({ where });
  }

  async findByIdOrSlug(
    idOrSlug: string,
    includes?: { equipment?: boolean; sources?: boolean }
  ): Promise<MissionModel | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const where = isUuid ? { missionId: idOrSlug } : { slug: idOrSlug };

    const row = await prisma.mission.findUnique({
      where,
      include: {
        ...(includes?.equipment && {
          equipment: {
            take: 50,
            include: {
              equipment: {
                select: { equipmentId: true, name: true, slug: true },
              },
            },
          },
        }),
        ...(includes?.sources && {
          sources: {
            take: 50,
            include: {
              source: {
                select: { sourceId: true, title: true, url: true },
              },
            },
          },
        }),
      },
    });
    return row ? this.mapMission(row) : null;
  }

  async findBySlug(slug: string): Promise<MissionModel | null> {
    const row = await prisma.mission.findUnique({ where: { slug } });
    return row ? this.mapMission(row) : null;
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string | null | undefined;
    agency?: string | null | undefined;
    missionStatus?: MissionStatus | undefined;
  }): Promise<MissionModel> {
    const row = await prisma.mission.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        agency: data.agency ?? null,
        missionStatus: data.missionStatus ?? 'UNKNOWN',
      },
    });
    return this.mapMission(row);
  }

  async update(
    missionId: string,
    data: {
      name?: string | undefined;
      slug?: string | undefined;
      description?: string | null | undefined;
      agency?: string | null | undefined;
      missionStatus?: MissionStatus | undefined;
    }
  ): Promise<MissionModel> {
    const row = await prisma.mission.update({
      where: { missionId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.agency !== undefined && { agency: data.agency }),
        ...(data.missionStatus && { missionStatus: data.missionStatus }),
      },
    });
    return this.mapMission(row);
  }

  async delete(missionId: string): Promise<MissionModel> {
    const row = await prisma.mission.delete({ where: { missionId } });
    return this.mapMission(row);
  }

  // MissionEquipment
  async linkEquipment(
    missionId: string,
    equipmentId: string,
    missionRole: string,
    participationDescription?: string | null
  ): Promise<MissionEquipmentModel> {
    const row = await prisma.missionEquipment.upsert({
      where: { missionId_equipmentId: { missionId, equipmentId } },
      update: {
        missionRole,
        ...(participationDescription !== undefined && { participationDescription }),
      },
      create: {
        missionId,
        equipmentId,
        missionRole,
        participationDescription: participationDescription ?? null,
      },
    });
    return {
      missionId: row.missionId,
      equipmentId: row.equipmentId,
      missionRole: row.missionRole,
      role: row.missionRole,
      participationDescription: row.participationDescription,
    };
  }

  async unlinkEquipment(missionId: string, equipmentId: string): Promise<void> {
    await prisma.missionEquipment.delete({
      where: { missionId_equipmentId: { missionId, equipmentId } },
    });
  }
}

export const missionRepository = new MissionRepository();
