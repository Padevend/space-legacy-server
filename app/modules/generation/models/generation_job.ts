import type { GenerationKind, GenerationStatus } from '#shared/enums';

export interface GenerationJobDto {
  id: string;
  logbookEntryId: string;
  kind: GenerationKind;
  status: GenerationStatus;
  externalJobId: string | null;
  requestedById: string | null;
  requestPayload: Record<string, any>;
  resultText: string | null;
  resultUrl: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  attempts: number;
  createdAt: Date;
  startedAt: Date | null;
  finishedAt: Date | null;
  updatedAt: Date;
}

export interface SubmitGenerationInput {
  logbookEntryId: string;
  kind: GenerationKind;
  prompt?: string | undefined;
  title?: string | undefined;
  parameters?: Record<string, any> | undefined;
  simulateFailure?: boolean | undefined;
}

export interface ExternalJobResult {
  jobId: string;
  kind?: string | undefined;
  status: GenerationStatus;
  resultUrl?: string | null | undefined;
  resultText?: string | null | undefined;
  errorCode?: string | null | undefined;
  errorMessage?: string | null | undefined;
}

export interface IGenerationClient {
  submitJob(
    kind: GenerationKind,
    payload: Record<string, any>,
    options?: { simulateFailure?: boolean; simulateUntrustedHost?: boolean }
  ): Promise<{ jobId: string; status: GenerationStatus }>;
  getJobStatus(jobId: string): Promise<ExternalJobResult>;
  cancelJob(jobId: string): Promise<ExternalJobResult>;
}
