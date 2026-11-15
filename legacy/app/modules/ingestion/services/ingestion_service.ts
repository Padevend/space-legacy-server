import { IngestionRepository, ingestionRepository } from '../repositories/ingestion_repository.js';
import type { IngestionRunModel } from '../models/ingestion_run.js';
import { AppException } from '#exceptions/app_exception';
import type { ListIngestionRunsQueryDto, TriggerIngestRequestDto } from '../validators/ingestion.js';

export class IngestionService {
  constructor(private readonly repo: IngestionRepository = ingestionRepository) {}

  async list(query: ListIngestionRunsQueryDto): Promise<{ runs: IngestionRunModel[]; total: number }> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const listParams = {
      skip,
      take: pageSize,
      status: query.status,
      orderByField: (query.orderBy ?? 'createdAt') as 'startedAt' | 'createdAt',
      orderDirection: (query.order ?? 'desc') as 'asc' | 'desc',
    };

    const [runs, total] = await Promise.all([this.repo.findMany(listParams), this.repo.count(query.status)]);

    return { runs, total };
  }

  async getById(id: string): Promise<IngestionRunModel> {
    const run = await this.repo.findById(id);
    if (!run) {
      throw AppException.notFound('IngestionRun', `Ingestion run '${id}' not found.`);
    }
    return run;
  }

  async trigger(dto: TriggerIngestRequestDto): Promise<IngestionRunModel> {
    const run = await this.repo.create({
      status: 'RUNNING',
      dryRun: dto.dryRun ?? false,
    });

    // In background or synchronous dry run:
    // Mark as completed with simulated counts summary for the 5 V1 equipment items
    const completed = await this.repo.update(run.ingestionRunId, {
      status: 'COMPLETED',
      completedAt: new Date(),
      countsSummary: {
        missions: 5,
        equipment: 5,
        events: 18,
        locations: 5,
        celestialBodies: 2,
        sources: 12,
        media: 15,
        measurements: 20,
      },
    });

    return completed;
  }
}

export const ingestionService = new IngestionService();
