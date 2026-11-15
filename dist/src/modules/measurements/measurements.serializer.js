export class MeasurementsSerializer {
    serializeMeasurement(measurement) {
        return {
            measurementId: measurement.measurementId,
            equipmentId: measurement.equipmentId ?? null,
            eventId: measurement.eventId ?? null,
            name: measurement.name,
            value: measurement.value.toString(),
            unit: measurement.unit,
            measurementType: measurement.measurementType,
            context: measurement.context,
            measurementDate: measurement.measurementDate ? measurement.measurementDate.toISOString() : null,
            isApproximate: measurement.isApproximate,
            uncertainty: measurement.uncertainty ? measurement.uncertainty.toString() : null,
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serializeMeasurementDetail(measurement) {
        const base = this.serializeMeasurement(measurement);
        return {
            ...base,
            ...(measurement.equipment !== undefined && {
                equipment: measurement.equipment
                    ? {
                        equipmentId: measurement.equipment.equipmentId,
                        name: measurement.equipment.name,
                        slug: measurement.equipment.slug,
                    }
                    : null,
            }),
            ...(measurement.event !== undefined && {
                event: measurement.event
                    ? {
                        eventId: measurement.event.eventId,
                        title: measurement.event.title,
                    }
                    : null,
            }),
            ...(measurement.sources !== undefined && {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sources: measurement.sources.map((s) => ({
                    sourceId: s.sourceId,
                    title: s.source?.title ?? '',
                    url: s.source?.url ?? '',
                    claimDescription: s.claimDescription ?? null,
                })),
            }),
        };
    }
}
export const measurementsSerializer = new MeasurementsSerializer();
