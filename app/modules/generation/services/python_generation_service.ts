import { generationConfig } from '#config/generation';
import type { GenerationKind, GenerationStatus } from '#shared/enums';
import type { ExternalJobResult, IGenerationClient } from '../models/generation_job.js';
import { AppException } from '#exceptions/app_exception';

export class PythonGenerationService implements IGenerationClient {
  private baseUrl: string;
  private apiKey: string;
  private timeoutMs: number;
  private retryCount: number;

  constructor(options?: { baseUrl?: string; apiKey?: string; timeoutMs?: number; retryCount?: number }) {
    this.baseUrl = options?.baseUrl ?? generationConfig.serviceUrl;
    this.apiKey = options?.apiKey ?? generationConfig.apiKey;
    this.timeoutMs = options?.timeoutMs ?? generationConfig.timeoutMs;
    this.retryCount = options?.retryCount ?? generationConfig.retryCount;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  async submitJob(
    kind: GenerationKind,
    payload: Record<string, any>,
    options?: { simulateFailure?: boolean; simulateUntrustedHost?: boolean }
  ): Promise<{ jobId: string; status: GenerationStatus }> {
    const url = `${this.baseUrl}/jobs`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
    };

    if (options?.simulateFailure) {
      headers['x-simulate-failure'] = 'true';
    }
    if (options?.simulateUntrustedHost) {
      headers['x-simulate-untrusted-host'] = 'true';
    }

    const body = JSON.stringify({
      kind,
      ...payload,
      simulateFailure: options?.simulateFailure,
    });

    const res = await this.fetchWithRetry(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new AppException({
        code: 'SERVICE_UNAVAILABLE',
        message: `External generation service rejected job submission (HTTP ${res.status}): ${errText}`,
        status: 503,
      });
    }

    const data = (await res.json()) as { jobId: string; status: GenerationStatus };
    return {
      jobId: data.jobId,
      status: data.status,
    };
  }

  async getJobStatus(jobId: string): Promise<ExternalJobResult> {
    const url = `${this.baseUrl}/jobs/${encodeURIComponent(jobId)}`;
    const res = await this.fetchWithRetry(url, {
      method: 'GET',
      headers: {
        'x-api-key': this.apiKey,
      },
    });

    if (res.status === 404) {
      throw AppException.notFound('GenerationJob', `Job '${jobId}' was not found on generation service.`);
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new AppException({
        code: 'SERVICE_UNAVAILABLE',
        message: `External generation service status check failed (HTTP ${res.status}): ${errText}`,
        status: 503,
      });
    }

    const data = (await res.json()) as ExternalJobResult;

    // Validate resultUrl host if present
    if (data.resultUrl) {
      this.assertAllowedResultHost(data.resultUrl);
    }

    return data;
  }

  async cancelJob(jobId: string): Promise<ExternalJobResult> {
    const url = `${this.baseUrl}/jobs/${encodeURIComponent(jobId)}/cancel`;
    const res = await this.fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
      },
    });

    if (res.status === 404) {
      throw AppException.notFound('GenerationJob', `Job '${jobId}' was not found on generation service.`);
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new AppException({
        code: 'SERVICE_UNAVAILABLE',
        message: `External generation service cancel failed (HTTP ${res.status}): ${errText}`,
        status: 503,
      });
    }

    return (await res.json()) as ExternalJobResult;
  }

  assertAllowedResultHost(url: string): void {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw AppException.badRequest(`Generated result URL '${url}' is not a valid URL.`);
    }

    const hostname = parsed.hostname.toLowerCase();
    const isAllowed = generationConfig.allowedResultHosts.some(
      (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)
    );

    if (!isAllowed) {
      throw new AppException({
        code: 'VALIDATION_ERROR',
        message: `Generated result URL host '${hostname}' is not in allowed hosts: ${generationConfig.allowedResultHosts.join(', ')}`,
        status: 422,
      });
    }
  }

  private async fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
    let lastError: any = null;
    let delayMs = 150;

    for (let attempt = 0; attempt <= this.retryCount; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

        const res = await fetch(url, {
          ...init,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        // Don't retry client errors (4xx)
        if (res.status < 500) {
          return res;
        }

        lastError = new Error(`Server returned HTTP ${res.status}`);
      } catch (err: any) {
        lastError = err;
      }

      if (attempt < this.retryCount) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2;
      }
    }

    throw new AppException({
      code: 'SERVICE_UNAVAILABLE',
      message: `Failed to connect to external generation service after ${this.retryCount + 1} attempts: ${lastError?.message || 'Timeout'}`,
      status: 503,
    });
  }
}

export const pythonGenerationService = new PythonGenerationService();
