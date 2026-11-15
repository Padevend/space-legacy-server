import type { PersonModel } from '../models/person.js';
import type { PersonDto } from '../validators/person.js';

export class PersonSerializer {
  serializePerson(entity: PersonModel): PersonDto {
    return {
      personId: entity.personId,
      fullName: entity.fullName,
      biography: entity.biography,
      affiliation: entity.affiliation,
    };
  }

  serializePersonList(entities: PersonModel[]): PersonDto[] {
    return entities.map((e) => this.serializePerson(e));
  }
}

export const personSerializer = new PersonSerializer();
