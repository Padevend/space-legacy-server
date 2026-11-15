import type { SourceType } from '#shared/enums';

export interface SourceModel {
  sourceId: string;
  title: string;
  url: string;
  publisher: string;
  author: string | null;
  publicationDate: Date | null;
  sourceType: SourceType;
  accessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
