import { prisma } from '#infrastructure/database/prisma_client';
import type { PersonModel } from '../models/person.js';

export interface PersonListParams {
  skip: number;
  take: number;
  search?: string | undefined;
  affiliation?: string | undefined;
  orderByField: 'fullName' | 'affiliation';
  orderDirection: 'asc' | 'desc';
}

export class PersonRepository {
  private mapPerson(row: any): PersonModel {
    return {
      personId: row.personId,
      fullName: row.fullName,
      biography: row.biography,
      affiliation: row.affiliation,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async findMany(params: PersonListParams): Promise<PersonModel[]> {
    const where: any = {};
    if (params.search) {
      where.fullName = { contains: params.search, mode: 'insensitive' };
    }
    if (params.affiliation) {
      where.affiliation = { contains: params.affiliation, mode: 'insensitive' };
    }

    const rows = await prisma.person.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { [params.orderByField]: params.orderDirection },
    });
    return rows.map((r) => this.mapPerson(r));
  }

  async count(params: Partial<PersonListParams>): Promise<number> {
    const where: any = {};
    if (params.search) {
      where.fullName = { contains: params.search, mode: 'insensitive' };
    }
    if (params.affiliation) {
      where.affiliation = { contains: params.affiliation, mode: 'insensitive' };
    }
    return prisma.person.count({ where });
  }

  async findById(personId: string): Promise<PersonModel | null> {
    const row = await prisma.person.findUnique({
      where: { personId },
    });
    return row ? this.mapPerson(row) : null;
  }

  async create(data: {
    fullName: string;
    biography?: string | null | undefined;
    affiliation?: string | null | undefined;
  }): Promise<PersonModel> {
    const row = await prisma.person.create({
      data: {
        fullName: data.fullName,
        biography: data.biography ?? null,
        affiliation: data.affiliation ?? null,
      },
    });
    return this.mapPerson(row);
  }

  async update(
    personId: string,
    data: {
      fullName?: string | undefined;
      biography?: string | null | undefined;
      affiliation?: string | null | undefined;
    }
  ): Promise<PersonModel> {
    const row = await prisma.person.update({
      where: { personId },
      data: {
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.biography !== undefined && { biography: data.biography }),
        ...(data.affiliation !== undefined && { affiliation: data.affiliation }),
      },
    });
    return this.mapPerson(row);
  }

  async delete(personId: string): Promise<PersonModel> {
    const row = await prisma.person.delete({
      where: { personId },
    });
    return this.mapPerson(row);
  }
}

export const personRepository = new PersonRepository();
