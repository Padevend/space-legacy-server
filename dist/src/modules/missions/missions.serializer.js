export class MissionsSerializer {
    serializeMission(mission) {
        return {
            missionId: mission.missionId,
            name: mission.name,
            slug: mission.slug,
            description: mission.description ?? null,
            agency: mission.agency ?? null,
            missionStatus: mission.missionStatus,
            createdAt: mission.createdAt.toISOString(),
            updatedAt: mission.updatedAt.toISOString(),
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serializeMissionDetail(mission) {
        const base = this.serializeMission(mission);
        return {
            ...base,
            ...(mission.equipment !== undefined && {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                equipment: mission.equipment.map((e) => ({
                    equipmentId: e.equipmentId,
                    name: e.equipment?.name ?? '',
                    slug: e.equipment?.slug ?? '',
                    missionRole: e.missionRole,
                    participationDescription: e.participationDescription ?? null,
                })),
            }),
            ...(mission.people !== undefined && {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                people: mission.people.map((p) => ({
                    personId: p.personId,
                    fullName: p.person?.fullName ?? '',
                    roleInMission: p.roleInMission,
                })),
            }),
            ...(mission.sources !== undefined && {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sources: mission.sources.map((s) => ({
                    sourceId: s.sourceId,
                    title: s.source?.title ?? '',
                    url: s.source?.url ?? '',
                    claimDescription: s.claimDescription ?? null,
                })),
            }),
        };
    }
}
export const missionsSerializer = new MissionsSerializer();
