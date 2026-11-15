export class CatalogPolicy {
  canView(): boolean {
    return true;
  }
}

export const catalogPolicy = new CatalogPolicy();
