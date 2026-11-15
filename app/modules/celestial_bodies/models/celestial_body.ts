import type { CelestialBodyType } from '#shared/enums';

export interface CelestialBodyModel {
  celestialBodyId: string;
  name: string;
  bodyType: CelestialBodyType;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
