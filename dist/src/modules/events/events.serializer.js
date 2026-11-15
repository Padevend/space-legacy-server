export class EventsSerializer {
    formatDate(date) {
        if (!date)
            return null;
        return date.toISOString().split('T')[0] ?? null;
    }
    formatTime(time) {
        if (!time)
            return null;
        const iso = time.toISOString();
        return iso.split('T')[1]?.slice(0, 8) ?? null;
    }
    serializeEvent(event) {
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
    serializeEventDetail(event) {
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
                equipment: event.equipment.map((e) => ({
                    equipmentId: e.equipmentId,
                    name: e.equipment?.name ?? '',
                    slug: e.equipment?.slug ?? '',
                    roleInEvent: e.roleInEvent ?? null,
                    description: e.description ?? null,
                })),
            }),
            ...(event.locations !== undefined && {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                locations: event.locations.map((loc) => ({
                    locationId: loc.locationId,
                    name: loc.location?.name ?? '',
                    locationRole: loc.locationRole ?? null,
                })),
            }),
            ...(event.people !== undefined && {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                people: event.people.map((p) => ({
                    personId: p.personId,
                    fullName: p.person?.fullName ?? '',
                    roleInEvent: p.roleInEvent ?? null,
                })),
            }),
            ...(event.sources !== undefined && {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sources: event.sources.map((s) => ({
                    sourceId: s.sourceId,
                    title: s.source?.title ?? '',
                    url: s.source?.url ?? '',
                    claimDescription: s.claimDescription ?? null,
                })),
            }),
        };
    }
}
export const eventsSerializer = new EventsSerializer();
