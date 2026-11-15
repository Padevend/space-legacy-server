import type { Router } from '#infrastructure/http/router';

export function registerArchivesPublicRoutes(_router: Router): void {
  // Strictly internal/admin: no public endpoints exist for raw scraped archives
}
