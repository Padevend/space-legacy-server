export const SOURCE_TYPES = [
  'OFFICIAL_DOCUMENT',
  'SCIENTIFIC_PAPER',
  'NASA_WEBPAGE',
  'DATASET',
  'BOOK',
  'ARTICLE',
  'VIDEO',
  'OTHER',
] as const;

export type SourceType = (typeof SOURCE_TYPES)[number];

export interface Source {
  sourceId: string;
  title: string;
  url: string;
  publisher: string;
  author: string | null;
  publicationDate: string | null; // YYYY-MM-DD
  sourceType: SourceType;
  accessedAt: string; // ISO 8601 UTC
}
