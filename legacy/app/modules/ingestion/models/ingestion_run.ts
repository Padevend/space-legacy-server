import type { IngestionStatus } from '#shared/enums';

export interface IngestionRunModel {
  ingestionRunId: string;
  status: IngestionStatus;
  countsSummary: Record<string, number> | null;
  errorSummary: string | null;
  dryRun: boolean;
  contentHash: string | null;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
