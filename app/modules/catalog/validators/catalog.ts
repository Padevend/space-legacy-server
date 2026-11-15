import { z } from 'zod';

export const catalogFeedSchema = z.object({
  featuredStories: z.array(
    z.object({
      storyId: z.string().uuid(),
      title: z.string(),
      slug: z.string(),
      hook: z.string().nullable(),
      publishedAt: z.string().datetime().nullable(),
    })
  ),
  recentEvents: z.array(
    z.object({
      eventId: z.string().uuid(),
      title: z.string(),
      eventType: z.string(),
      eventDate: z.string().nullable(),
    })
  ),
  highlightEquipment: z.array(
    z.object({
      equipmentId: z.string().uuid(),
      name: z.string(),
      slug: z.string(),
      equipmentType: z.string(),
      operationalStatus: z.string(),
    })
  ),
});

export type CatalogFeedDto = z.infer<typeof catalogFeedSchema>;

export const catalogDestinationSchema = z.object({
  celestialBodyId: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  bodyType: z.string(),
  equipmentCount: z.number().int(),
  missionCount: z.number().int(),
});

export type CatalogDestinationDto = z.infer<typeof catalogDestinationSchema>;

export const catalogEquipmentDetailSchema = z.object({
  equipmentId: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  equipmentType: z.string(),
  operationalStatus: z.string(),
  physicalStatus: z.string(),
  manufacturer: z.string().nullable(),
  missions: z.array(
    z.object({
      missionId: z.string().uuid(),
      name: z.string(),
      slug: z.string(),
      role: z.string().nullable(),
    })
  ),
  locations: z.array(
    z.object({
      locationId: z.string().uuid(),
      name: z.string(),
      latitude: z.number().nullable(),
      longitude: z.number().nullable(),
      celestialBody: z.string(),
    })
  ),
  events: z.array(
    z.object({
      eventId: z.string().uuid(),
      title: z.string(),
      eventType: z.string(),
      eventDate: z.string().nullable(),
    })
  ),
  media: z.array(
    z.object({
      mediaId: z.string().uuid(),
      title: z.string(),
      url: z.string(),
      thumbnailUrl: z.string().nullable(),
      provenanceType: z.string(),
      requiresAiLabel: z.boolean(),
    })
  ),
});

export type CatalogEquipmentDetailDto = z.infer<typeof catalogEquipmentDetailSchema>;
