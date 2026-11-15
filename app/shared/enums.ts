export const MissionStatus = {
  PLANNED: 'PLANNED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  PARTIALLY_COMPLETED: 'PARTIALLY_COMPLETED',
  FAILED: 'FAILED',
  UNKNOWN: 'UNKNOWN',
} as const;
export type MissionStatus = (typeof MissionStatus)[keyof typeof MissionStatus];

export const EquipmentType = {
  SPACECRAFT: 'SPACECRAFT',
  LANDER: 'LANDER',
  ROVER: 'ROVER',
  ORBITER: 'ORBITER',
  MODULE: 'MODULE',
  STAGE: 'STAGE',
  SCIENTIFIC_INSTRUMENT: 'SCIENTIFIC_INSTRUMENT',
  COMPONENT: 'COMPONENT',
  ARTIFACT: 'ARTIFACT',
  OTHER: 'OTHER',
} as const;
export type EquipmentType = (typeof EquipmentType)[keyof typeof EquipmentType];

export const OperationalStatus = {
  OPERATIONAL: 'OPERATIONAL',
  INACTIVE: 'INACTIVE',
  MISSION_ENDED: 'MISSION_ENDED',
  FAILED: 'FAILED',
  UNKNOWN: 'UNKNOWN',
} as const;
export type OperationalStatus = (typeof OperationalStatus)[keyof typeof OperationalStatus];

export const PhysicalStatus = {
  LEFT_ON_SURFACE: 'LEFT_ON_SURFACE',
  IN_ORBIT: 'IN_ORBIT',
  RETURNED_TO_EARTH: 'RETURNED_TO_EARTH',
  DESTROYED: 'DESTROYED',
  LOST: 'LOST',
  UNKNOWN: 'UNKNOWN',
} as const;
export type PhysicalStatus = (typeof PhysicalStatus)[keyof typeof PhysicalStatus];

export const EventType = {
  LAUNCH: 'LAUNCH',
  LANDING: 'LANDING',
  FLYBY: 'FLYBY',
  ORBIT_INSERTION: 'ORBIT_INSERTION',
  DEPLOYMENT: 'DEPLOYMENT',
  ACTIVATION: 'ACTIVATION',
  SCIENTIFIC_DISCOVERY: 'SCIENTIFIC_DISCOVERY',
  COMMUNICATION: 'COMMUNICATION',
  LAST_SIGNAL: 'LAST_SIGNAL',
  MISSION_END: 'MISSION_END',
  OTHER: 'OTHER',
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];

export const DatePrecision = {
  EXACT: 'EXACT',
  ESTIMATED: 'ESTIMATED',
  YEAR_ONLY: 'YEAR_ONLY',
  MONTH_ONLY: 'MONTH_ONLY',
  UNKNOWN: 'UNKNOWN',
} as const;
export type DatePrecision = (typeof DatePrecision)[keyof typeof DatePrecision];

export const CelestialBodyType = {
  STAR: 'STAR',
  PLANET: 'PLANET',
  MOON: 'MOON',
  ASTEROID: 'ASTEROID',
  DWARF_PLANET: 'DWARF_PLANET',
  COMET: 'COMET',
  OTHER: 'OTHER',
} as const;
export type CelestialBodyType = (typeof CelestialBodyType)[keyof typeof CelestialBodyType];

export const LocationType = {
  LAUNCH_SITE: 'LAUNCH_SITE',
  LANDING_SITE: 'LANDING_SITE',
  SURFACE_LOCATION: 'SURFACE_LOCATION',
  ORBIT: 'ORBIT',
  SPACE_REGION: 'SPACE_REGION',
  FACILITY: 'FACILITY',
  OTHER: 'OTHER',
} as const;
export type LocationType = (typeof LocationType)[keyof typeof LocationType];

export const SourceType = {
  OFFICIAL_DOCUMENT: 'OFFICIAL_DOCUMENT',
  SCIENTIFIC_PAPER: 'SCIENTIFIC_PAPER',
  NASA_WEBPAGE: 'NASA_WEBPAGE',
  DATASET: 'DATASET',
  BOOK: 'BOOK',
  ARTICLE: 'ARTICLE',
  VIDEO: 'VIDEO',
  OTHER: 'OTHER',
} as const;
export type SourceType = (typeof SourceType)[keyof typeof SourceType];

export const StoryType = {
  LEGACY_STORY: 'LEGACY_STORY',
  BEHIND_THE_TECHNOLOGY: 'BEHIND_THE_TECHNOLOGY',
  FINAL_CHAPTER: 'FINAL_CHAPTER',
  SPACE_FACT: 'SPACE_FACT',
} as const;
export type StoryType = (typeof StoryType)[keyof typeof StoryType];

export const PublicationStatus = {
  DRAFT: 'DRAFT',
  REVIEW: 'REVIEW',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;
export type PublicationStatus = (typeof PublicationStatus)[keyof typeof PublicationStatus];

export const MediaType = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  MODEL_3D: 'MODEL_3D',
  DOCUMENT: 'DOCUMENT',
  ANIMATION: 'ANIMATION',
  OTHER: 'OTHER',
} as const;
export type MediaType = (typeof MediaType)[keyof typeof MediaType];

export const MediaProvenance = {
  NASA_ARCHIVE: 'NASA_ARCHIVE',
  RECONSTRUCTION_3D: 'RECONSTRUCTION_3D',
  AI_GENERATED_ILLUSTRATION: 'AI_GENERATED_ILLUSTRATION',
  DATA_VISUALIZATION: 'DATA_VISUALIZATION',
  OTHER: 'OTHER',
} as const;
export type MediaProvenance = (typeof MediaProvenance)[keyof typeof MediaProvenance];

export const DownloadStatus = {
  AVAILABLE: 'AVAILABLE',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  EXTERNAL_ONLY: 'EXTERNAL_ONLY',
} as const;
export type DownloadStatus = (typeof DownloadStatus)[keyof typeof DownloadStatus];

export const MeasurementType = {
  MASS: 'MASS',
  DISTANCE: 'DISTANCE',
  DURATION: 'DURATION',
  TEMPERATURE: 'TEMPERATURE',
  FREQUENCY: 'FREQUENCY',
  SPEED: 'SPEED',
  FORCE: 'FORCE',
  PRESSURE: 'PRESSURE',
  POWER: 'POWER',
  VOLTAGE: 'VOLTAGE',
  OTHER: 'OTHER',
} as const;
export type MeasurementType = (typeof MeasurementType)[keyof typeof MeasurementType];

export const UserRole = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const IngestionStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;
export type IngestionStatus = (typeof IngestionStatus)[keyof typeof IngestionStatus];
