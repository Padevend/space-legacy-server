import type { CelestialBody } from '@prisma/client';
import type { CelestialBodyDto } from './celestial-bodies.schemas.js';

export class CelestialBodiesSerializer {
  serializeCelestialBody(entity: CelestialBody): CelestialBodyDto {
    return {
      celestialBodyId: entity.celestialBodyId,
      name: entity.name,
      bodyType: entity.bodyType,
      description: entity.description,
    };
  }

  serializeCelestialBodyList(entities: CelestialBody[]): CelestialBodyDto[] {
    return entities.map((e) => this.serializeCelestialBody(e));
  }
}

export const celestialBodiesSerializer = new CelestialBodiesSerializer();
