import type { SourceType } from './model.js';

export interface ListSourcesQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sourceType?: SourceType;
  publisher?: string;
  sort?: 'title' | 'publicationDate' | 'accessedAt';
  order?: 'asc' | 'desc';
}

export interface CreateSourceBody {
  title: string;
  url: string;
  publisher: string;
  author?: string | null;
  /** Format: YYYY-MM-DD */
  publicationDate?: string | null;
  sourceType: SourceType;
}

export interface UpdateSourceBody {
  title?: string;
  url?: string;
  publisher?: string;
  author?: string | null;
  /** Format: YYYY-MM-DD */
  publicationDate?: string | null;
  sourceType?: SourceType;
}

export interface SourceIdParams {
  id: string; // UUID v4
}
