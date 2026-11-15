import type { Location } from '@prisma/client';
import type { LocationDto } from './locations.schemas.js';

export class LocationsSerializer {
  serializeLocation(entity: Location): LocationDto {
    return {
      locationId: entity.locationId,
      celestialBodyId: entity.celestialBodyId,
      name: entity.name,
      locationType: entity.locationType,
      latitude: entity.latitude !== null ? Number(entity.latitude) : null,
      longitude: entity.longitude !== null ? Number(entity.longitude) : null,
      altitude: entity.altitude !== null ? Number(entity.altitude) : null,
      referenceSystem: entity.referenceSystem,
      description: entity.description,
    };
  }

  serializeLocationList(entities: Location[]): LocationDto[] {
    return entities.map((e) => this.serializeLocation(e));
  }
}

export const locationsSerializer = new LocationsSerializer();
