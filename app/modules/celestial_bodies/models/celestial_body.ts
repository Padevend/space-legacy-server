export interface CelestialBodyModel {
  id: string;
  slug: string;
  name: string;
  summary: string;
  imagePath: string | null;
  sortOrder: number;
  isPublished: boolean;
}
