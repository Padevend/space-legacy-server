import { prisma } from '../../core/database/prisma.js';
import type { Mission, MissionStatus, Prisma } from '@prisma/client';

export interface MissionListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  missionStatus?: MissionStatus | undefined;
  agency?: string | undefined;
  orderByField: 'name' | 'createdAt' | 'updatedAt';
  orderDirection: 'asc' | 'desc';
}

export class MissionsRepository {
  private buildWhere(params: Partial<MissionListParams>): Prisma.MissionWhereInput {
    const where: Prisma.MissionWhereInput = {};

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

    return where;
  }

  async findMany(params: MissionListParams): Promise<Mission[]> {
    const where = this.buildWhere(params);

    return prisma.mission.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.orderByField]: params.orderDirection,
      },
    });
  }

  async count(params: Partial<MissionListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return prisma.mission.count({ where });
  }

  async findById(missionId: string): Promise<Mission | null> {
    return prisma.mission.findUnique({
      where: { missionId },
    });
  }

  async findBySlug(slug: string): Promise<Mission | null> {
    return prisma.mission.findUnique({
      where: { slug },
    });
  }

  async findByIdOrSlugWithIncludes(
    idOrSlug: string,
    isUuid: boolean,
    includes: { equipment?: boolean; people?: boolean; sources?: boolean }
  ) {
    const where: Prisma.MissionWhereUniqueInput = isUuid ? { missionId: idOrSlug } : { slug: idOrSlug };

    return prisma.mission.findUnique({
      where,
      include: {
        ...(includes.equipment && {
          equipment: {
            take: 50,
            include: {
              equipment: {
                select: {
                  equipmentId: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        }),
        ...(includes.people && {
          people: {
            take: 50,
            include: {
              person: {
                select: {
                  personId: true,
                  fullName: true,
                },
              },
            },
          },
        }),
        ...(includes.sources && {
          sources: {
            take: 50,
            include: {
              source: {
                select: {
                  sourceId: true,
                  title: true,
                  url: true,
                },
              },
            },
          },
        }),
      },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string | null | undefined;
    agency?: string | null | undefined;
    missionStatus?: MissionStatus | undefined;
  }): Promise<Mission> {
    return prisma.mission.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        agency: data.agency ?? null,
        missionStatus: data.missionStatus ?? 'UNKNOWN',
      },
    });
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
  ): Promise<Mission> {
    return prisma.mission.update({
      where: { missionId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.agency !== undefined && { agency: data.agency }),
        ...(data.missionStatus !== undefined && { missionStatus: data.missionStatus }),
      },
    });
  }

  async delete(missionId: string): Promise<Mission> {
    return prisma.mission.delete({
      where: { missionId },
    });
  }

  // Relations
  async linkPerson(missionId: string, personId: string, roleInMission: string) {
    return prisma.missionPerson.upsert({
      where: {
        missionId_personId: { missionId, personId },
      },
      update: { roleInMission },
      create: { missionId, personId, roleInMission },
    });
  }

  async unlinkPerson(missionId: string, personId: string) {
    return prisma.missionPerson.delete({
      where: {
        missionId_personId: { missionId, personId },
      },
    });
  }

  async linkSource(missionId: string, sourceId: string, claimDescription?: string | null) {
    return prisma.missionSource.upsert({
      where: {
        missionId_sourceId: { missionId, sourceId },
      },
      update: { claimDescription: claimDescription ?? null },
      create: { missionId, sourceId, claimDescription: claimDescription ?? null },
    });
  }

  async unlinkSource(missionId: string, sourceId: string) {
    return prisma.missionSource.delete({
      where: {
        missionId_sourceId: { missionId, sourceId },
      },
    });
  }

  async linkEquipment(
    missionId: string,
    equipmentId: string,
    missionRole: string,
    participationDescription?: string | null
  ) {
    return prisma.missionEquipment.upsert({
      where: {
        missionId_equipmentId: { missionId, equipmentId },
      },
      update: {
        missionRole,
        participationDescription: participationDescription ?? null,
      },
      create: {
        missionId,
        equipmentId,
        missionRole,
        participationDescription: participationDescription ?? null,
      },
    });
  }

  async unlinkEquipment(missionId: string, equipmentId: string) {
    return prisma.missionEquipment.delete({
      where: {
        missionId_equipmentId: { missionId, equipmentId },
      },
    });
  }

  async createAuditLog(data: {
    actorId?: string | undefined;
    action: string;
    entity: string;
    entityId: string;
    requestId?: string | undefined;
    diffSummary?: Prisma.InputJsonValue | undefined;
  }): Promise<void> {
    await prisma.auditLog.create({
      data: {
        actorId: data.actorId ?? null,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        requestId: data.requestId ?? null,
        ...(data.diffSummary !== undefined && { diffSummary: data.diffSummary }),
      },
    });
  }
}

export const missionsRepository = new MissionsRepository();
