import type { Source } from '@prisma/client';
import type { SourceDto } from './sources.schemas.js';

export class SourcesSerializer {
  serializeSource(entity: Source): SourceDto {
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

  serializeSourceList(entities: Source[]): SourceDto[] {
    return entities.map((e) => this.serializeSource(e));
  }
}

export const sourcesSerializer = new SourcesSerializer();
