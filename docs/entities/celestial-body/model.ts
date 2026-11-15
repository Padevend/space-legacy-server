export const CELESTIAL_BODY_TYPES = [
  'STAR',
  'PLANET',
  'MOON',
  'ASTEROID',
  'DWARF_PLANET',
  'COMET',
  'OTHER',
] as const;

export type CelestialBodyType = (typeof CELESTIAL_BODY_TYPES)[number];

export interface CelestialBody {
  celestialBodyId: string;
  name: string;
  bodyType: CelestialBodyType;
  description: string | null;
}
