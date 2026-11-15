import { CatalogRepository, catalogRepository } from '../repositories/catalog_repository.js';
import type { CatalogFeedModel, CatalogDestinationModel, CatalogEquipmentDetailModel } from '../models/catalog.js';
import { AppException } from '#exceptions/app_exception';

export class CatalogService {
  constructor(private readonly repo: CatalogRepository = catalogRepository) {}

  async getFeed(): Promise<CatalogFeedModel> {
    return this.repo.getFeed();
  }

  async getDestinations(): Promise<CatalogDestinationModel[]> {
    return this.repo.getDestinations();
  }

  async getEquipmentDetail(idOrSlug: string): Promise<CatalogEquipmentDetailModel> {
    const item = await this.repo.getEquipmentDetail(idOrSlug);
    if (!item) {
      throw AppException.notFound('Equipment', `Equipment '${idOrSlug}' not found.`);
    }
    return item;
  }
}

export const catalogService = new CatalogService();
