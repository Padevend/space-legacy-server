import { prismaClient, type ExtendedPrismaClient } from '#infrastructure/database/prisma_client';
import type { CatalogFeedModel, CatalogDestinationModel, CatalogEquipmentDetailModel } from '../models/catalog.js';

export class CatalogRepository {
  constructor(private readonly prisma: ExtendedPrismaClient = prismaClient) {}

  async getFeed(): Promise<CatalogFeedModel> {
    const [stories, events, equipment] = await Promise.all([
      this.prisma.story.findMany({
        where: { publicationStatus: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        select: {
          storyId: true,
          title: true,
          slug: true,
          hook: true,
          publishedAt: true,
        },
      }),
      this.prisma.event.findMany({
        orderBy: { eventDate: 'desc' },
        take: 5,
        select: {
          eventId: true,
          title: true,
          eventType: true,
          eventDate: true,
        },
      }),
      this.prisma.equipment.findMany({
        take: 5,
        orderBy: { name: 'asc' },
        select: {
          equipmentId: true,
          name: true,
          slug: true,
          equipmentType: true,
          operationalStatus: true,
        },
      }),
    ]);

    return {
      featuredStories: stories,
      recentEvents: events,
      highlightEquipment: equipment,
    };
  }

  async getDestinations(): Promise<CatalogDestinationModel[]> {
    const bodies = await this.prisma.celestialBody.findMany({
      include: {
        locations: {
          include: {
            equipments: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return bodies.map((b) => {
      const equipSet = new Set<string>();
      for (const loc of b.locations) {
        for (const eq of loc.equipments) {
          equipSet.add(eq.equipmentId);
        }
      }

      return {
        celestialBodyId: b.celestialBodyId,
        name: b.name,
        slug: b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        bodyType: b.bodyType,
        equipmentCount: equipSet.size,
        missionCount: 0,
      };
    });
  }

  async getEquipmentDetail(idOrSlug: string): Promise<CatalogEquipmentDetailModel | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);

    const equip = await this.prisma.equipment.findUnique({
      where: isUuid ? { equipmentId: idOrSlug } : { slug: idOrSlug },
      include: {
        missions: {
          include: {
            mission: true,
          },
        },
        locations: {
          include: {
            location: {
              include: {
                celestialBody: true,
              },
            },
          },
        },
        events: {
          include: {
            event: true,
          },
        },
        media: {
          include: {
            media: true,
          },
        },
      },
    });

    if (!equip) return null;

    return {
      equipmentId: equip.equipmentId,
      name: equip.name,
      slug: equip.slug,
      description: equip.description,
      equipmentType: equip.equipmentType,
      operationalStatus: equip.operationalStatus,
      physicalStatus: equip.physicalStatus,
      manufacturer: equip.manufacturer,
      missions: equip.missions.map((m) => ({
        missionId: m.mission.missionId,
        name: m.mission.name,
        slug: m.mission.slug,
        role: m.missionRole,
      })),
      locations: equip.locations.map((l) => ({
        locationId: l.location.locationId,
        name: l.location.name,
        latitude: l.location.latitude ? Number(l.location.latitude) : null,
        longitude: l.location.longitude ? Number(l.location.longitude) : null,
        celestialBody: l.location.celestialBody?.name ?? '',
      })),
      events: equip.events.map((e) => ({
        eventId: e.event.eventId,
        title: e.event.title,
        eventType: e.event.eventType,
        eventDate: e.event.eventDate,
      })),
      media: equip.media.map((m) => ({
        mediaId: m.media.mediaId,
        title: m.media.title,
        url: m.media.url,
        thumbnailUrl: m.media.thumbnailUrl,
        provenanceType: m.media.provenanceType,
        requiresAiLabel: m.media.provenanceType === 'AI_GENERATED_ILLUSTRATION',
      })),
    };
  }
}

export const catalogRepository = new CatalogRepository();
