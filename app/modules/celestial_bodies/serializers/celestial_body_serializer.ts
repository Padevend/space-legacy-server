import type { CelestialBodyModel } from '../models/celestial_body.js';
import type { CelestialBodyDto } from '../validators/celestial_body.js';

export class CelestialBodySerializer {
  serializeCelestialBody(entity: CelestialBodyModel): CelestialBodyDto {
    return {
      celestialBodyId: entity.celestialBodyId,
      name: entity.name,
      bodyType: entity.bodyType,
      description: entity.description,
    };
  }

  serializeCelestialBodyList(entities: CelestialBodyModel[]): CelestialBodyDto[] {
    return entities.map((e) => this.serializeCelestialBody(e));
  }
}

export const celestialBodySerializer = new CelestialBodySerializer();
