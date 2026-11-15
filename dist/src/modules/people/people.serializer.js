export class PeopleSerializer {
    serializePerson(entity) {
        return {
            personId: entity.personId,
            fullName: entity.fullName,
            biography: entity.biography,
            affiliation: entity.affiliation,
        };
    }
    serializePersonList(entities) {
        return entities.map((e) => this.serializePerson(e));
    }
}
export const peopleSerializer = new PeopleSerializer();
