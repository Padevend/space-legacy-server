import type { IngestionRunModel } from '../models/ingestion_run.js';
import type { IngestionRunDto } from '../validators/ingestion.js';

export class IngestionSerializer {
  serializeIngestionRun(run: IngestionRunModel): IngestionRunDto {
    return {
      ingestionRunId: run.ingestionRunId,
      status: run.status,
      countsSummary: run.countsSummary ?? null,
      errorSummary: run.errorSummary ?? null,
      dryRun: run.dryRun,
      contentHash: run.contentHash ?? null,
      startedAt: run.startedAt.toISOString(),
      completedAt: run.completedAt ? run.completedAt.toISOString() : null,
      createdAt: run.createdAt.toISOString(),
      updatedAt: run.updatedAt.toISOString(),
    };
  }
}

export const ingestionSerializer = new IngestionSerializer();
