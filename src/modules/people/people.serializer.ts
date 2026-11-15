import type { Person } from '@prisma/client';
import type { PersonDto } from './people.schemas.js';

export class PeopleSerializer {
  serializePerson(entity: Person): PersonDto {
    return {
      personId: entity.personId,
      fullName: entity.fullName,
      biography: entity.biography,
      affiliation: entity.affiliation,
    };
  }

  serializePersonList(entities: Person[]): PersonDto[] {
    return entities.map((e) => this.serializePerson(e));
  }
}

export const peopleSerializer = new PeopleSerializer();
