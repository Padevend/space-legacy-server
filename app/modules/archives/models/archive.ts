export interface ArchiveModel {
  archiveId: string;
  externalId: string;
  archiveTitle: string;
  archiveProvider: string;
  originalUrl: string;
  rawContent: Record<string, unknown> | unknown[];
  retrievedAt: Date;
  archiveVersion: string | null;
  contentHash: string | null;
}
