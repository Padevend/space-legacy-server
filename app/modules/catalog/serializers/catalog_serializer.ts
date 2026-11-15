import type { CatalogFeedModel, CatalogDestinationModel, CatalogEquipmentDetailModel } from '../models/catalog.js';
import type { CatalogFeedDto, CatalogDestinationDto, CatalogEquipmentDetailDto } from '../validators/catalog.js';

export class CatalogSerializer {
  serializeFeed(feed: CatalogFeedModel): CatalogFeedDto {
    return {
      featuredStories: feed.featuredStories.map((s) => ({
        storyId: s.storyId,
        title: s.title,
        slug: s.slug,
        hook: s.hook,
        publishedAt: s.publishedAt ? s.publishedAt.toISOString() : null,
      })),
      recentEvents: feed.recentEvents.map((e) => ({
        eventId: e.eventId,
        title: e.title,
        eventType: e.eventType,
        eventDate: e.eventDate ? (e.eventDate.toISOString().split('T')[0] ?? null) : null,
      })),
      highlightEquipment: feed.highlightEquipment.map((eq) => ({
        equipmentId: eq.equipmentId,
        name: eq.name,
        slug: eq.slug,
        equipmentType: eq.equipmentType,
        operationalStatus: eq.operationalStatus,
      })),
    };
  }

  serializeDestination(dest: CatalogDestinationModel): CatalogDestinationDto {
    return {
      celestialBodyId: dest.celestialBodyId,
      name: dest.name,
      slug: dest.slug,
      bodyType: dest.bodyType,
      equipmentCount: dest.equipmentCount,
      missionCount: dest.missionCount,
    };
  }

  serializeEquipmentDetail(detail: CatalogEquipmentDetailModel): CatalogEquipmentDetailDto {
    return {
      equipmentId: detail.equipmentId,
      name: detail.name,
      slug: detail.slug,
      description: detail.description,
      equipmentType: detail.equipmentType,
      operationalStatus: detail.operationalStatus,
      physicalStatus: detail.physicalStatus,
      manufacturer: detail.manufacturer,
      missions: detail.missions,
      locations: detail.locations,
      events: detail.events.map((e) => ({
        eventId: e.eventId,
        title: e.title,
        eventType: e.eventType,
        eventDate: e.eventDate ? (e.eventDate.toISOString().split('T')[0] ?? null) : null,
      })),
      media: detail.media,
    };
  }
}

export const catalogSerializer = new CatalogSerializer();
