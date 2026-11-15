export const LOCATION_TYPES = [
  'LAUNCH_SITE',
  'LANDING_SITE',
  'SURFACE_LOCATION',
  'ORBIT',
  'SPACE_REGION',
  'FACILITY',
  'OTHER',
] as const;

export type LocationType = (typeof LOCATION_TYPES)[number];

export interface Location {
  locationId: string;
  celestialBodyId: string | null;
  name: string;
  locationType: LocationType;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  referenceSystem: string | null;
  description: string | null;
}
