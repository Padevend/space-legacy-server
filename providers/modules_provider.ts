import { healthProvider } from '#modules/health/providers/health_provider';
import { authProvider } from '#modules/auth/providers/auth_provider';
import { celestialBodyProvider } from '#modules/celestial_bodies/providers/celestial_body_provider';
import { locationProvider } from '#modules/locations/providers/location_provider';
import { sourceProvider } from '#modules/sources/providers/source_provider';
import { missionProvider } from '#modules/missions/providers/mission_provider';
import { equipmentProvider } from '#modules/equipment/providers/equipment_provider';
import { eventProvider } from '#modules/events/providers/event_provider';
import { storyProvider } from '#modules/stories/providers/story_provider';
import { ingestionProvider } from '#modules/ingestion/providers/ingestion_provider';
import { dashboardProvider } from '#modules/dashboard/providers/dashboard_provider';

export class ModulesProvider {
  register(): void {
    healthProvider.register();
    authProvider.register();
    celestialBodyProvider.register();
    locationProvider.register();
    sourceProvider.register();
    missionProvider.register();
    equipmentProvider.register();
    eventProvider.register();
    storyProvider.register();
    ingestionProvider.register();
    dashboardProvider.register();
  }
}

export const modulesProvider = new ModulesProvider();
