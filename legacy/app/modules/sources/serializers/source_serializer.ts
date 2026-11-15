import type { SourceModel } from '../models/source.js';
import type { SourceDto } from '../validators/source.js';
import type { SourceLinkModel } from '../models/source_link.js';

export class SourceSerializer {
  serializeSource(entity: SourceModel): SourceDto {
    return {
      sourceId: entity.sourceId,
      title: entity.title,
      url: entity.url,
      publisher: entity.publisher,
      author: entity.author,
      publicationDate: entity.publicationDate ? entity.publicationDate.toISOString().slice(0, 10) : null,
      sourceType: entity.sourceType,
      accessedAt: entity.accessedAt.toISOString(),
    };
  }

  serializeSourceList(entities: SourceModel[]): SourceDto[] {
    return entities.map((e) => this.serializeSource(e));
  }

  serializeSourceLink(link: SourceLinkModel) {
    return {
      sourceId: link.sourceId,
      targetId: link.targetId,
      claimDescription: link.claimDescription ?? null,
    };
  }
}

export const sourceSerializer = new SourceSerializer();
