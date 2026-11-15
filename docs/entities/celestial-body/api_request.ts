import type { CelestialBodyType } from './model.js';

export interface ListCelestialBodiesQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  bodyType?: CelestialBodyType;
  sort?: 'name' | 'bodyType';
  order?: 'asc' | 'desc';
}

export interface CreateCelestialBodyBody {
  name: string;
  bodyType: CelestialBodyType;
  description?: string;
}

export interface UpdateCelestialBodyBody {
  name?: string;
  bodyType?: CelestialBodyType;
  description?: string | null;
}

export interface CelestialBodyIdParams {
  id: string; // UUID v4
}
