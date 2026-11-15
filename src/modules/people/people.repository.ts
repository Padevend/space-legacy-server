import { prisma } from '../../core/database/prisma.js';
import type { Person, Prisma } from '@prisma/client';

export interface PersonListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  affiliation?: string | undefined;
  orderByField: 'fullName' | 'affiliation';
  orderDirection: 'asc' | 'desc';
}

export class PeopleRepository {
  private buildWhere(params: Partial<PersonListParams>): Prisma.PersonWhereInput {
    const where: Prisma.PersonWhereInput = {};

    if (params.search) {
      where.fullName = {
        contains: params.search,
        mode: 'insensitive',
      };
    }

    if (params.affiliation) {
      where.affiliation = {
        contains: params.affiliation,
        mode: 'insensitive',
      };
    }

    return where;
  }

  async findMany(params: PersonListParams): Promise<Person[]> {
    const where = this.buildWhere(params);

    return prisma.person.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: {
        [params.orderByField]: params.orderDirection,
      },
    });
  }

  async count(params: Partial<PersonListParams>): Promise<number> {
    const where = this.buildWhere(params);
    return prisma.person.count({ where });
  }

  async findById(personId: string): Promise<Person | null> {
    return prisma.person.findUnique({
      where: { personId },
    });
  }

  async create(data: {
    fullName: string;
    biography?: string | null | undefined;
    affiliation?: string | null | undefined;
  }): Promise<Person> {
    return prisma.person.create({
      data: {
        fullName: data.fullName,
        biography: data.biography ?? null,
        affiliation: data.affiliation ?? null,
      },
    });
  }

  async update(
    personId: string,
    data: {
      fullName?: string | undefined;
      biography?: string | null | undefined;
      affiliation?: string | null | undefined;
    }
  ): Promise<Person> {
    return prisma.person.update({
      where: { personId },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.biography !== undefined && { biography: data.biography }),
        ...(data.affiliation !== undefined && { affiliation: data.affiliation }),
      },
    });
  }

  async delete(personId: string): Promise<Person> {
    return prisma.person.delete({
      where: { personId },
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

export const peopleRepository = new PeopleRepository();
