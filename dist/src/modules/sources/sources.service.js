import { sourcesRepository } from './sources.repository.js';
import { AppException } from '../../core/exceptions/AppException.js';
export class SourcesService {
    repo;
    constructor(repo = sourcesRepository) {
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
                sourceType: query.sourceType,
                publisher: query.publisher,
                orderByField: query.sort,
                orderDirection: query.order,
            }),
            this.repo.count({
                search: query.search,
                sourceType: query.sourceType,
                publisher: query.publisher,
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
        const source = await this.repo.findById(id);
        if (!source) {
            throw AppException.notFound('Source', `Source with ID '${id}' not found.`);
        }
        return source;
    }
    async create(dto, context) {
        const existing = await this.repo.findByUrl(dto.url);
        if (existing) {
            throw AppException.conflict(`Source with URL '${dto.url}' already exists.`);
        }
        const publicationDate = dto.publicationDate ? new Date(dto.publicationDate) : null;
        const created = await this.repo.create({
            title: dto.title,
            url: dto.url,
            publisher: dto.publisher,
            sourceType: dto.sourceType,
            author: dto.author,
            publicationDate,
        });
        await this.repo.createAuditLog({
            actorId: context.actorId,
            action: 'SOURCE_CREATED',
            entity: 'Source',
            entityId: created.sourceId,
            requestId: context.requestId,
            diffSummary: { title: created.title, url: created.url },
        });
        return created;
    }
    async update(id, dto, context) {
        await this.getById(id);
        if (dto.url) {
            const existing = await this.repo.findByUrl(dto.url);
            if (existing && existing.sourceId !== id) {
                throw AppException.conflict(`Source with URL '${dto.url}' already exists.`);
            }
        }
        const publicationDate = dto.publicationDate !== undefined
            ? dto.publicationDate !== null
                ? new Date(dto.publicationDate)
                : null
            : undefined;
        const updated = await this.repo.update(id, {
            title: dto.title,
            url: dto.url,
            publisher: dto.publisher,
            sourceType: dto.sourceType,
            author: dto.author,
            publicationDate,
        });
        await this.repo.createAuditLog({
            actorId: context.actorId,
            action: 'SOURCE_UPDATED',
            entity: 'Source',
            entityId: updated.sourceId,
            requestId: context.requestId,
            diffSummary: { title: updated.title, url: updated.url },
        });
        return updated;
    }
    async delete(id, context) {
        const source = await this.getById(id);
        await this.repo.delete(id);
        await this.repo.createAuditLog({
            actorId: context.actorId,
            action: 'SOURCE_DELETED',
            entity: 'Source',
            entityId: id,
            requestId: context.requestId,
            diffSummary: { deletedTitle: source.title },
        });
    }
}
export const sourcesService = new SourcesService();
