import { container } from '#infrastructure/container/container';
import { EventsRepository } from '../repositories/events_repository.js';
import { EventService } from '../services/event_service.js';
import { EventSerializer } from '../serializers/event_serializer.js';
import { EventPolicy } from '../policies/event_policy.js';
import { EventController } from '../controllers/event_controller.js';
import { AdminEventController } from '../controllers/admin_event_controller.js';

export class EventProvider {
  register(): void {
    const mod = container.forModule('events');

    mod.singleton(EventsRepository, () => new EventsRepository());
    mod.singleton(EventSerializer, () => new EventSerializer());
    mod.singleton(EventPolicy, () => new EventPolicy());
    mod.singleton(EventService, () => new EventService(mod.make(EventsRepository)));

    mod.bind(EventController, () => new EventController(mod.make(EventService), mod.make(EventSerializer)));
    mod.bind(AdminEventController, () => new AdminEventController(mod.make(EventService), mod.make(EventSerializer)));
  }
}

export const eventProvider = new EventProvider();
