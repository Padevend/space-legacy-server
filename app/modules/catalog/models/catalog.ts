export interface CatalogFeedModel {
  featuredStories: Array<{
    storyId: string;
    title: string;
    slug: string;
    hook: string | null;
    publishedAt: Date | null;
  }>;
  recentEvents: Array<{
    eventId: string;
    title: string;
    eventType: string;
    eventDate: Date | null;
  }>;
  highlightEquipment: Array<{
    equipmentId: string;
    name: string;
    slug: string;
    equipmentType: string;
    operationalStatus: string;
  }>;
}

export interface CatalogDestinationModel {
  celestialBodyId: string;
  name: string;
  slug: string;
  bodyType: string;
  equipmentCount: number;
  missionCount: number;
}

export interface CatalogEquipmentDetailModel {
  equipmentId: string;
  name: string;
  slug: string;
  description: string | null;
  equipmentType: string;
  operationalStatus: string;
  physicalStatus: string;
  manufacturer: string | null;
  missions: Array<{
    missionId: string;
    name: string;
    slug: string;
    role: string | null;
  }>;
  locations: Array<{
    locationId: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
    celestialBody: string;
  }>;
  events: Array<{
    eventId: string;
    title: string;
    eventType: string;
    eventDate: Date | null;
  }>;
  media: Array<{
    mediaId: string;
    title: string;
    url: string;
    thumbnailUrl: string | null;
    provenanceType: string;
    requiresAiLabel: boolean;
  }>;
}
