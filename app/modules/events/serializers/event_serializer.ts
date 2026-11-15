import type { EventModel } from '../models/event.js';
import type { EventDto, EventDetailDto } from '../validators/event.js';
import type { EventEquipmentModel } from '../models/event_equipment.js';
import type { EventLocationModel } from '../models/event_location.js';

export class EventSerializer {
  private formatDate(date: Date | null): string | null {
    if (!date) return null;
    return date.toISOString().split('T')[0] ?? null;
  }

  private formatTime(time: Date | null): string | null {
    if (!time) return null;
    const iso = time.toISOString();
    return iso.split('T')[1]?.slice(0, 8) ?? null;
  }

  serializeEvent(event: EventModel): EventDto {
    return {
      eventId: event.eventId,
      missionId: event.missionId,
      title: event.title,
      description: event.description ?? null,
      eventType: event.eventType,
      eventDate: this.formatDate(event.eventDate),
      eventTime: this.formatTime(event.eventTime),
      timeStandard: event.timeStandard ?? null,
      datePrecision: event.datePrecision,
      isEstimated: event.isEstimated,
      sequenceOrder: event.sequenceOrder,
      createdAt: event.createdAt.toISOString(),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serializeEventDetail(event: any): EventDetailDto {
    const base = this.serializeEvent(event);

    return {
      ...base,
      ...(event.mission !== undefined && {
        mission: event.mission
          ? {
              missionId: event.mission.missionId,
              name: event.mission.name,
              slug: event.mission.slug,
            }
          : undefined,
      }),
      ...(event.equipment !== undefined && {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        equipment: event.equipment.map((e: any) => ({
          equipmentId: e.equipmentId,
          name: e.equipment?.name ?? '',
          slug: e.equipment?.slug ?? '',
          roleInEvent: e.roleInEvent ?? null,
          description: e.description ?? null,
        })),
      }),
      ...(event.locations !== undefined && {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        locations: event.locations.map((loc: any) => ({
          locationId: loc.locationId,
          name: loc.location?.name ?? '',
          locationRole: loc.locationRole ?? null,
        })),
      }),
      ...(event.sources !== undefined && {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sources: event.sources.map((s: any) => ({
          sourceId: s.sourceId,
          title: s.source?.title ?? '',
          url: s.source?.url ?? '',
          claimDescription: s.claimDescription ?? null,
        })),
      }),
    };
  }

  serializeEventEquipment(link: EventEquipmentModel) {
    return {
      eventId: link.eventId,
      equipmentId: link.equipmentId,
      roleInEvent: link.roleInEvent,
      description: link.description,
    };
  }

  serializeEventLocation(link: EventLocationModel) {
    return {
      eventId: link.eventId,
      locationId: link.locationId,
      locationRole: link.locationRole,
    };
  }
}

export const eventSerializer = new EventSerializer();
