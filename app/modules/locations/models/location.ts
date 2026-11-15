import type { LocationType } from '#shared/enums';

export interface LocationModel {
  locationId: string;
  celestialBodyId: string | null;
  name: string;
  locationType: LocationType;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  referenceSystem: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
