export interface LogbookMachineContext {
  id: string;
  slug: string;
  name: string;
}

export interface LogbookEntrySummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  articleOrigin: string | null;
  videoUrl: string | null;
  videoOrigin: string | null;
  videoDurationSec: number | null;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  machine: LogbookMachineContext;
}

export interface LogbookEntryDetail extends LogbookEntrySummary {
  articleMarkdown: string | null;
}
