import { PersonRepository, personRepository } from '../repositories/person_repository.js';
import type { PersonModel } from '../models/person.js';
import { AppException } from '#exceptions/app_exception';
import type { ListPeopleQueryDto, CreatePersonRequestDto, UpdatePersonRequestDto } from '../validators/person.js';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class PersonService {
  constructor(private readonly repo: PersonRepository = personRepository) {}

  async list(query: ListPeopleQueryDto): Promise<PaginatedResult<PersonModel>> {
    const page = query.page;
    const pageSize = query.pageSize;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      this.repo.findMany({
        skip,
        take: pageSize,
        search: query.search,
        affiliation: query.affiliation,
        orderByField: query.sort,
        orderDirection: query.order,
      }),
      this.repo.count({
        search: query.search,
        affiliation: query.affiliation,
      }),
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getById(personId: string): Promise<PersonModel> {
    const item = await this.repo.findById(personId);
    if (!item) {
      throw AppException.notFound('Person', `Person with ID '${personId}' not found.`);
    }
    return item;
  }

  async create(dto: CreatePersonRequestDto): Promise<PersonModel> {
    return this.repo.create({
      fullName: dto.fullName,
      biography: dto.biography,
      affiliation: dto.affiliation,
    });
  }

  async update(personId: string, dto: UpdatePersonRequestDto): Promise<PersonModel> {
    await this.getById(personId);

    return this.repo.update(personId, {
      fullName: dto.fullName,
      biography: dto.biography,
      affiliation: dto.affiliation,
    });
  }

  async delete(personId: string): Promise<PersonModel> {
    await this.getById(personId);
    return this.repo.delete(personId);
  }
}

export const personService = new PersonService();
