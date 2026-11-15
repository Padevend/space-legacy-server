export class CelestialBodiesSerializer {
    serializeCelestialBody(entity) {
        return {
            celestialBodyId: entity.celestialBodyId,
            name: entity.name,
            bodyType: entity.bodyType,
            description: entity.description,
        };
    }
    serializeCelestialBodyList(entities) {
        return entities.map((e) => this.serializeCelestialBody(e));
    }
}
export const celestialBodiesSerializer = new CelestialBodiesSerializer();
