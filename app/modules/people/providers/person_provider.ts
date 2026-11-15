import { container } from '#infrastructure/container/container';
import { PersonRepository } from '../repositories/person_repository.js';
import { PersonService } from '../services/person_service.js';
import { PersonSerializer } from '../serializers/person_serializer.js';
import { PersonPolicy } from '../policies/person_policy.js';
import { PersonController } from '../controllers/person_controller.js';
import { AdminPersonController } from '../controllers/admin_person_controller.js';

export class PersonProvider {
  register(): void {
    const mod = container.forModule('people');

    mod.singleton(PersonRepository, () => new PersonRepository());
    mod.singleton(PersonSerializer, () => new PersonSerializer());
    mod.singleton(PersonPolicy, () => new PersonPolicy());
    mod.singleton(PersonService, () => new PersonService(mod.make(PersonRepository)));

    mod.bind(PersonController, () => new PersonController(mod.make(PersonService), mod.make(PersonSerializer)));
    mod.bind(
      AdminPersonController,
      () => new AdminPersonController(mod.make(PersonService), mod.make(PersonSerializer))
    );
  }
}

export const personProvider = new PersonProvider();
