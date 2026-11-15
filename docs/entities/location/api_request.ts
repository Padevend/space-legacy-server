import type { LocationType } from './model.js';

export interface ListLocationsQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  celestialBodyId?: string;
  locationType?: LocationType;
  sort?: 'name' | 'locationType';
  order?: 'asc' | 'desc';
}

export interface CreateLocationBody {
  celestialBodyId?: string | null;
  name: string;
  locationType: LocationType;
  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
  referenceSystem?: string | null;
  description?: string | null;
}

export interface UpdateLocationBody {
  celestialBodyId?: string | null;
  name?: string;
  locationType?: LocationType;
  latitude?: number | null;
  longitude?: number | null;
  altitude?: number | null;
  referenceSystem?: string | null;
  description?: string | null;
}

export interface LocationIdParams {
  id: string; // UUID v4
}
