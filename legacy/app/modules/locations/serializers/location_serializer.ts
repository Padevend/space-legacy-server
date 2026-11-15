import type { LocationModel } from '../models/location.js';
import type { LocationDto } from '../validators/location.js';
import type { EquipmentLocationModel } from '../models/equipment_location.js';

export class LocationSerializer {
  serializeLocation(entity: LocationModel): LocationDto {
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

  serializeLocationList(entities: LocationModel[]): LocationDto[] {
    return entities.map((e) => this.serializeLocation(e));
  }

  serializeEquipmentLocation(link: EquipmentLocationModel) {
    return {
      equipmentLocationId: link.equipmentLocationId,
      equipmentId: link.equipmentId,
      locationId: link.locationId,
      name: link.location?.name ?? '',
      latitude:
        link.location?.latitude !== null && link.location?.latitude !== undefined
          ? Number(link.location.latitude)
          : null,
      longitude:
        link.location?.longitude !== null && link.location?.longitude !== undefined
          ? Number(link.location.longitude)
          : null,
      startDate: link.startDate
        ? typeof link.startDate === 'string'
          ? link.startDate
          : link.startDate.toISOString().split('T')[0]
        : null,
      endDate: link.endDate
        ? typeof link.endDate === 'string'
          ? link.endDate
          : link.endDate.toISOString().split('T')[0]
        : null,
      locationPrecision: link.locationPrecision,
    };
  }
}

export const locationSerializer = new LocationSerializer();
