import { GenerationRepository, generationRepository } from '../repositories/generation_repository.js';
import { PythonGenerationService, pythonGenerationService } from './python_generation_service.js';
import type { GenerationJobDto, SubmitGenerationInput } from '../models/generation_job.js';
import type { GenerationKind, GenerationStatus } from '#shared/enums';
import { AppException } from '#exceptions/app_exception';

export class GenerationService {
  private repo: GenerationRepository;
  private client: PythonGenerationService;

  constructor(repo?: GenerationRepository, client?: PythonGenerationService) {
    this.repo = repo ?? generationRepository;
    this.client = client ?? pythonGenerationService;
  }

  setClient(client: PythonGenerationService) {
    this.client = client;
  }

  async submitJob(
    input: SubmitGenerationInput,
    requestedById?: string | null,
    options?: { simulateFailure?: boolean; simulateUntrustedHost?: boolean }
  ): Promise<GenerationJobDto> {
    // 1. Verify that target logbook entry exists (N4 isolation query)
    const entryExists = await this.repo.checkLogbookEntryExists(input.logbookEntryId);
    if (!entryExists) {
      throw AppException.notFound('LogbookEntry', `LogbookEntry '${input.logbookEntryId}' does not exist.`);
    }

    const requestPayload: Record<string, any> = {
      logbookEntryId: input.logbookEntryId,
      kind: input.kind,
      prompt: input.prompt ?? null,
      title: input.title ?? null,
      parameters: input.parameters ?? {},
    };

    // 2. Persist initial queued job in DB
    let job = await this.repo.create({
      logbookEntryId: input.logbookEntryId,
      kind: input.kind,
      requestedById: requestedById ?? null,
      requestPayload,
      status: 'QUEUED',
    });

    // 3. Submit to external Python microservice
    try {
      const submitRes = await this.client.submitJob(
        input.kind,
        {
          jobId: job.id,
          logbookEntryId: input.logbookEntryId,
          title: input.title,
          prompt: input.prompt,
          parameters: input.parameters,
        },
        options
      );

      // External service returns 202 with external jobId and initial or immediate status
      job = await this.repo.update(job.id, {
        externalJobId: submitRes.jobId,
        status: submitRes.status === 'SUCCEEDED' ? 'SUCCEEDED' : 'RUNNING',
        startedAt: new Date(),
        attempts: 1,
      });

      // If already resolved immediately (e.g. mock or synchronous worker), fetch and store result
      if (submitRes.status === 'SUCCEEDED' || submitRes.status === 'FAILED') {
        const statusRes = await this.client.getJobStatus(submitRes.jobId);
        job = await this.applyExternalStatus(job.id, statusRes);
      }
    } catch (err: any) {
      // Record failure if submission itself threw an error
      const errorCode = err instanceof AppException ? err.code : 'SUBMISSION_FAILED';
      const errorMessage = err?.message || 'Failed to submit generation job to external service.';

      job = await this.repo.update(job.id, {
        status: 'FAILED',
        errorCode,
        errorMessage,
        finishedAt: new Date(),
        attempts: 1,
      });

      throw err;
    }

    return job;
  }

  async getJobById(id: string): Promise<GenerationJobDto> {
    const job = await this.repo.findById(id);
    if (!job) {
      throw AppException.notFound('GenerationJob', `GenerationJob '${id}' not found.`);
    }
    return job;
  }

  async listJobs(query: {
    status?: GenerationStatus;
    kind?: GenerationKind;
    logbookEntryId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ jobs: GenerationJobDto[]; total: number }> {
    return this.repo.findAll(query);
  }

  async pollJob(id: string): Promise<GenerationJobDto> {
    const job = await this.getJobById(id);

    // If job is already terminal, no need to query external service
    if (job.status === 'SUCCEEDED' || job.status === 'FAILED' || job.status === 'CANCELLED') {
      return job;
    }

    if (!job.externalJobId) {
      return job;
    }

    const statusRes = await this.client.getJobStatus(job.externalJobId);
    return this.applyExternalStatus(job.id, statusRes);
  }

  async cancelJob(id: string): Promise<GenerationJobDto> {
    const job = await this.getJobById(id);

    if (job.status === 'SUCCEEDED' || job.status === 'FAILED' || job.status === 'CANCELLED') {
      return job;
    }

    if (job.externalJobId) {
      try {
        await this.client.cancelJob(job.externalJobId);
      } catch {
        // Continue cancellation locally even if remote service fails
      }
    }

    return this.repo.update(job.id, {
      status: 'CANCELLED',
      finishedAt: new Date(),
    });
  }

  private async applyExternalStatus(
    jobId: string,
    remote: {
      status: GenerationStatus;
      resultText?: string | null | undefined;
      resultUrl?: string | null | undefined;
      errorCode?: string | null | undefined;
      errorMessage?: string | null | undefined;
    }
  ): Promise<GenerationJobDto> {
    const updatePayload: {
      status: GenerationStatus;
      resultText?: string | null;
      resultUrl?: string | null;
      errorCode?: string | null;
      errorMessage?: string | null;
      finishedAt?: Date | null;
    } = {
      status: remote.status,
    };

    if (remote.status === 'SUCCEEDED') {
      updatePayload.resultText = remote.resultText ?? null;
      updatePayload.resultUrl = remote.resultUrl ?? null;
      updatePayload.finishedAt = new Date();
    } else if (remote.status === 'FAILED') {
      updatePayload.errorCode = remote.errorCode ?? 'GENERATION_FAILED';
      updatePayload.errorMessage = remote.errorMessage ?? 'Generation job failed on external service.';
      updatePayload.finishedAt = new Date();
    } else if (remote.status === 'CANCELLED') {
      updatePayload.finishedAt = new Date();
    }

    const updated = await this.repo.update(jobId, updatePayload);

    // If succeeded, propagate result to the associated LogbookEntry
    if (remote.status === 'SUCCEEDED') {
      await this.repo.updateLogbookEntryWithResult(updated.logbookEntryId, {
        articleMarkdown: remote.resultText ?? null,
        videoUrl: remote.resultUrl ?? null,
      });
    }

    return updated;
  }
}

export const generationService = new GenerationService();
