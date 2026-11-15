import { container } from '#infrastructure/container/container';
import { CatalogRepository } from '../repositories/catalog_repository.js';
import { CatalogService } from '../services/catalog_service.js';
import { CatalogSerializer } from '../serializers/catalog_serializer.js';
import { CatalogPolicy } from '../policies/catalog_policy.js';
import { CatalogController } from '../controllers/catalog_controller.js';

export class CatalogProvider {
  register(): void {
    const mod = container.forModule('catalog');

    mod.singleton(CatalogRepository, () => new CatalogRepository());
    mod.singleton(CatalogSerializer, () => new CatalogSerializer());
    mod.singleton(CatalogPolicy, () => new CatalogPolicy());
    mod.singleton(CatalogService, () => new CatalogService(mod.make(CatalogRepository)));

    mod.bind(CatalogController, () => new CatalogController(mod.make(CatalogService), mod.make(CatalogSerializer)));
  }
}

export const catalogProvider = new CatalogProvider();
