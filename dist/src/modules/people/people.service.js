import { peopleRepository } from './people.repository.js';
import { AppException } from '../../core/exceptions/AppException.js';
export class PeopleService {
    repo;
    constructor(repo = peopleRepository) {
        this.repo = repo;
    }
    async list(query) {
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
    async getById(id) {
        const person = await this.repo.findById(id);
        if (!person) {
            throw AppException.notFound('Person', `Person with ID '${id}' not found.`);
        }
        return person;
    }
    async create(dto, context) {
        const created = await this.repo.create({
            fullName: dto.fullName,
            biography: dto.biography,
            affiliation: dto.affiliation,
        });
        await this.repo.createAuditLog({
            actorId: context.actorId,
            action: 'PERSON_CREATED',
            entity: 'Person',
            entityId: created.personId,
            requestId: context.requestId,
            diffSummary: { fullName: created.fullName, affiliation: created.affiliation },
        });
        return created;
    }
    async update(id, dto, context) {
        await this.getById(id);
        const updated = await this.repo.update(id, {
            fullName: dto.fullName,
            biography: dto.biography,
            affiliation: dto.affiliation,
        });
        await this.repo.createAuditLog({
            actorId: context.actorId,
            action: 'PERSON_UPDATED',
            entity: 'Person',
            entityId: updated.personId,
            requestId: context.requestId,
            diffSummary: { fullName: updated.fullName, affiliation: updated.affiliation },
        });
        return updated;
    }
    async delete(id, context) {
        const person = await this.getById(id);
        await this.repo.delete(id);
        await this.repo.createAuditLog({
            actorId: context.actorId,
            action: 'PERSON_DELETED',
            entity: 'Person',
            entityId: id,
            requestId: context.requestId,
            diffSummary: { deletedFullName: person.fullName },
        });
    }
}
export const peopleService = new PeopleService();
