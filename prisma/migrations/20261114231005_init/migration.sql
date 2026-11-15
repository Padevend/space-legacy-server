-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'PARTIALLY_COMPLETED', 'FAILED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('SPACECRAFT', 'LANDER', 'ROVER', 'ORBITER', 'MODULE', 'STAGE', 'SCIENTIFIC_INSTRUMENT', 'COMPONENT', 'ARTIFACT', 'OTHER');

-- CreateEnum
CREATE TYPE "OperationalStatus" AS ENUM ('OPERATIONAL', 'INACTIVE', 'MISSION_ENDED', 'FAILED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "PhysicalStatus" AS ENUM ('LEFT_ON_SURFACE', 'IN_ORBIT', 'RETURNED_TO_EARTH', 'DESTROYED', 'LOST', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('LAUNCH', 'LANDING', 'FLYBY', 'ORBIT_INSERTION', 'DEPLOYMENT', 'ACTIVATION', 'SCIENTIFIC_DISCOVERY', 'COMMUNICATION', 'LAST_SIGNAL', 'MISSION_END', 'OTHER');

-- CreateEnum
CREATE TYPE "DatePrecision" AS ENUM ('EXACT', 'ESTIMATED', 'YEAR_ONLY', 'MONTH_ONLY', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "CelestialBodyType" AS ENUM ('STAR', 'PLANET', 'MOON', 'ASTEROID', 'DWARF_PLANET', 'COMET', 'OTHER');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('LAUNCH_SITE', 'LANDING_SITE', 'SURFACE_LOCATION', 'ORBIT', 'SPACE_REGION', 'FACILITY', 'OTHER');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('OFFICIAL_DOCUMENT', 'SCIENTIFIC_PAPER', 'NASA_WEBPAGE', 'DATASET', 'BOOK', 'ARTICLE', 'VIDEO', 'OTHER');

-- CreateEnum
CREATE TYPE "StoryType" AS ENUM ('LEGACY_STORY', 'BEHIND_THE_TECHNOLOGY', 'FINAL_CHAPTER', 'SPACE_FACT');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'MODEL_3D', 'DOCUMENT', 'ANIMATION', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaProvenance" AS ENUM ('NASA_ARCHIVE', '3D_RECONSTRUCTION', 'AI_GENERATED_ILLUSTRATION', 'DATA_VISUALIZATION', 'OTHER');

-- CreateEnum
CREATE TYPE "DownloadStatus" AS ENUM ('AVAILABLE', 'PENDING', 'FAILED', 'EXTERNAL_ONLY');

-- CreateEnum
CREATE TYPE "MeasurementType" AS ENUM ('MASS', 'DISTANCE', 'DURATION', 'TEMPERATURE', 'FREQUENCY', 'SPEED', 'FORCE', 'PRESSURE', 'POWER', 'VOLTAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "IngestionStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "missions" (
    "missionId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "agency" TEXT,
    "missionStatus" "MissionStatus" NOT NULL DEFAULT 'UNKNOWN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("missionId")
);

-- CreateTable
CREATE TABLE "equipments" (
    "equipmentId" UUID NOT NULL,
    "parentEquipmentId" UUID,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "equipmentType" "EquipmentType" NOT NULL,
    "manufacturer" TEXT,
    "operationalStatus" "OperationalStatus" NOT NULL DEFAULT 'UNKNOWN',
    "physicalStatus" "PhysicalStatus" NOT NULL DEFAULT 'UNKNOWN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipments_pkey" PRIMARY KEY ("equipmentId")
);

-- CreateTable
CREATE TABLE "events" (
    "eventId" UUID NOT NULL,
    "missionId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventType" "EventType" NOT NULL,
    "eventDate" DATE,
    "eventTime" TIME(0),
    "timeStandard" TEXT,
    "datePrecision" "DatePrecision" NOT NULL DEFAULT 'UNKNOWN',
    "isEstimated" BOOLEAN NOT NULL DEFAULT false,
    "sequenceOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "celestial_bodies" (
    "celestialBodyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "bodyType" "CelestialBodyType" NOT NULL,
    "description" TEXT,

    CONSTRAINT "celestial_bodies_pkey" PRIMARY KEY ("celestialBodyId")
);

-- CreateTable
CREATE TABLE "locations" (
    "locationId" UUID NOT NULL,
    "celestialBodyId" UUID,
    "name" TEXT NOT NULL,
    "locationType" "LocationType" NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "altitude" DECIMAL(14,4),
    "referenceSystem" TEXT,
    "description" TEXT,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("locationId")
);

-- CreateTable
CREATE TABLE "people" (
    "personId" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "biography" TEXT,
    "affiliation" TEXT,

    CONSTRAINT "people_pkey" PRIMARY KEY ("personId")
);

-- CreateTable
CREATE TABLE "archives" (
    "archiveId" UUID NOT NULL,
    "externalId" TEXT NOT NULL,
    "archiveTitle" TEXT NOT NULL,
    "archiveProvider" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "rawContent" JSONB NOT NULL,
    "retrievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archiveVersion" TEXT,
    "contentHash" TEXT,

    CONSTRAINT "archives_pkey" PRIMARY KEY ("archiveId")
);

-- CreateTable
CREATE TABLE "sources" (
    "sourceId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "author" TEXT,
    "publicationDate" DATE,
    "sourceType" "SourceType" NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("sourceId")
);

-- CreateTable
CREATE TABLE "stories" (
    "storyId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "hook" TEXT,
    "content" TEXT NOT NULL,
    "storyType" "StoryType" NOT NULL,
    "durationSeconds" INTEGER,
    "language" TEXT NOT NULL DEFAULT 'en',
    "publicationStatus" "PublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("storyId")
);

-- CreateTable
CREATE TABLE "media" (
    "mediaId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "caption" TEXT,
    "credit" TEXT,
    "creditUrl" TEXT,
    "provenanceType" "MediaProvenance" NOT NULL,
    "altText" TEXT,
    "downloadStatus" "DownloadStatus" NOT NULL DEFAULT 'EXTERNAL_ONLY',

    CONSTRAINT "media_pkey" PRIMARY KEY ("mediaId")
);

-- CreateTable
CREATE TABLE "measurements" (
    "measurementId" UUID NOT NULL,
    "equipmentId" UUID,
    "eventId" UUID,
    "name" TEXT NOT NULL,
    "value" DECIMAL(24,8) NOT NULL,
    "unit" TEXT NOT NULL,
    "measurementType" "MeasurementType" NOT NULL,
    "context" TEXT NOT NULL,
    "measurementDate" TIMESTAMP(3),
    "isApproximate" BOOLEAN NOT NULL DEFAULT false,
    "uncertainty" DECIMAL(24,8),

    CONSTRAINT "measurements_pkey" PRIMARY KEY ("measurementId")
);

-- CreateTable
CREATE TABLE "mission_equipments" (
    "missionId" UUID NOT NULL,
    "equipmentId" UUID NOT NULL,
    "missionRole" TEXT NOT NULL,
    "participationDescription" TEXT,

    CONSTRAINT "mission_equipments_pkey" PRIMARY KEY ("missionId","equipmentId")
);

-- CreateTable
CREATE TABLE "mission_people" (
    "missionId" UUID NOT NULL,
    "personId" UUID NOT NULL,
    "roleInMission" TEXT NOT NULL,

    CONSTRAINT "mission_people_pkey" PRIMARY KEY ("missionId","personId")
);

-- CreateTable
CREATE TABLE "mission_sources" (
    "missionId" UUID NOT NULL,
    "sourceId" UUID NOT NULL,
    "claimDescription" TEXT,

    CONSTRAINT "mission_sources_pkey" PRIMARY KEY ("missionId","sourceId")
);

-- CreateTable
CREATE TABLE "archive_missions" (
    "archiveId" UUID NOT NULL,
    "missionId" UUID NOT NULL,
    "sectionName" TEXT,

    CONSTRAINT "archive_missions_pkey" PRIMARY KEY ("archiveId","missionId")
);

-- CreateTable
CREATE TABLE "event_equipments" (
    "eventId" UUID NOT NULL,
    "equipmentId" UUID NOT NULL,
    "roleInEvent" TEXT,
    "description" TEXT,

    CONSTRAINT "event_equipments_pkey" PRIMARY KEY ("eventId","equipmentId")
);

-- CreateTable
CREATE TABLE "equipment_locations" (
    "equipmentLocationId" UUID NOT NULL,
    "equipmentId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "startDate" DATE,
    "endDate" DATE,
    "locationPrecision" "DatePrecision" NOT NULL DEFAULT 'UNKNOWN',

    CONSTRAINT "equipment_locations_pkey" PRIMARY KEY ("equipmentLocationId")
);

-- CreateTable
CREATE TABLE "equipment_people" (
    "equipmentId" UUID NOT NULL,
    "personId" UUID NOT NULL,
    "roleInEquipment" TEXT NOT NULL,

    CONSTRAINT "equipment_people_pkey" PRIMARY KEY ("equipmentId","personId")
);

-- CreateTable
CREATE TABLE "equipment_sources" (
    "equipmentId" UUID NOT NULL,
    "sourceId" UUID NOT NULL,
    "claimDescription" TEXT,

    CONSTRAINT "equipment_sources_pkey" PRIMARY KEY ("equipmentId","sourceId")
);

-- CreateTable
CREATE TABLE "archive_equipments" (
    "archiveId" UUID NOT NULL,
    "equipmentId" UUID NOT NULL,
    "sectionName" TEXT,
    "extractedReference" TEXT,

    CONSTRAINT "archive_equipments_pkey" PRIMARY KEY ("archiveId","equipmentId")
);

-- CreateTable
CREATE TABLE "event_locations" (
    "eventId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "locationRole" TEXT,
    "sequenceOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "event_locations_pkey" PRIMARY KEY ("eventId","locationId")
);

-- CreateTable
CREATE TABLE "event_people" (
    "eventId" UUID NOT NULL,
    "personId" UUID NOT NULL,
    "roleInEvent" TEXT NOT NULL,

    CONSTRAINT "event_people_pkey" PRIMARY KEY ("eventId","personId")
);

-- CreateTable
CREATE TABLE "event_sources" (
    "eventId" UUID NOT NULL,
    "sourceId" UUID NOT NULL,
    "claimDescription" TEXT,

    CONSTRAINT "event_sources_pkey" PRIMARY KEY ("eventId","sourceId")
);

-- CreateTable
CREATE TABLE "archive_events" (
    "archiveId" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "sectionName" TEXT,
    "extractedReference" TEXT,

    CONSTRAINT "archive_events_pkey" PRIMARY KEY ("archiveId","eventId")
);

-- CreateTable
CREATE TABLE "archive_sources" (
    "archiveId" UUID NOT NULL,
    "sourceId" UUID NOT NULL,
    "referenceContext" TEXT,

    CONSTRAINT "archive_sources_pkey" PRIMARY KEY ("archiveId","sourceId")
);

-- CreateTable
CREATE TABLE "story_missions" (
    "storyId" UUID NOT NULL,
    "missionId" UUID NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "story_missions_pkey" PRIMARY KEY ("storyId","missionId")
);

-- CreateTable
CREATE TABLE "story_equipments" (
    "storyId" UUID NOT NULL,
    "equipmentId" UUID NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "narrativeRole" TEXT,

    CONSTRAINT "story_equipments_pkey" PRIMARY KEY ("storyId","equipmentId")
);

-- CreateTable
CREATE TABLE "story_events" (
    "storyId" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "story_events_pkey" PRIMARY KEY ("storyId","eventId")
);

-- CreateTable
CREATE TABLE "story_media" (
    "storyId" UUID NOT NULL,
    "mediaId" UUID NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "captionOverride" TEXT,

    CONSTRAINT "story_media_pkey" PRIMARY KEY ("storyId","mediaId")
);

-- CreateTable
CREATE TABLE "story_sources" (
    "storyId" UUID NOT NULL,
    "sourceId" UUID NOT NULL,
    "claimDescription" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "story_sources_pkey" PRIMARY KEY ("storyId","sourceId")
);

-- CreateTable
CREATE TABLE "equipment_media" (
    "equipmentId" UUID NOT NULL,
    "mediaId" UUID NOT NULL,
    "representationType" TEXT,

    CONSTRAINT "equipment_media_pkey" PRIMARY KEY ("equipmentId","mediaId")
);

-- CreateTable
CREATE TABLE "measurement_sources" (
    "measurementId" UUID NOT NULL,
    "sourceId" UUID NOT NULL,
    "claimDescription" TEXT,

    CONSTRAINT "measurement_sources_pkey" PRIMARY KEY ("measurementId","sourceId")
);

-- CreateTable
CREATE TABLE "users" (
    "userId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'EDITOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "refreshTokenId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "familyId" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "replacedById" UUID,
    "userAgentHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("refreshTokenId")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "auditLogId" UUID NOT NULL,
    "actorId" UUID,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "requestId" TEXT,
    "diffSummary" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("auditLogId")
);

-- CreateTable
CREATE TABLE "ingestion_runs" (
    "ingestionRunId" UUID NOT NULL,
    "status" "IngestionStatus" NOT NULL DEFAULT 'PENDING',
    "countsSummary" JSONB,
    "errorSummary" TEXT,
    "dryRun" BOOLEAN NOT NULL DEFAULT false,
    "contentHash" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingestion_runs_pkey" PRIMARY KEY ("ingestionRunId")
);

-- CreateIndex
CREATE UNIQUE INDEX "missions_slug_key" ON "missions"("slug");

-- CreateIndex
CREATE INDEX "missions_name_idx" ON "missions"("name");

-- CreateIndex
CREATE INDEX "missions_missionStatus_idx" ON "missions"("missionStatus");

-- CreateIndex
CREATE UNIQUE INDEX "equipments_slug_key" ON "equipments"("slug");

-- CreateIndex
CREATE INDEX "equipments_name_idx" ON "equipments"("name");

-- CreateIndex
CREATE INDEX "equipments_equipmentType_idx" ON "equipments"("equipmentType");

-- CreateIndex
CREATE INDEX "equipments_parentEquipmentId_idx" ON "equipments"("parentEquipmentId");

-- CreateIndex
CREATE INDEX "equipments_operationalStatus_idx" ON "equipments"("operationalStatus");

-- CreateIndex
CREATE INDEX "equipments_physicalStatus_idx" ON "equipments"("physicalStatus");

-- CreateIndex
CREATE INDEX "events_missionId_idx" ON "events"("missionId");

-- CreateIndex
CREATE INDEX "events_eventDate_idx" ON "events"("eventDate");

-- CreateIndex
CREATE INDEX "events_eventType_idx" ON "events"("eventType");

-- CreateIndex
CREATE INDEX "events_sequenceOrder_idx" ON "events"("sequenceOrder");

-- CreateIndex
CREATE UNIQUE INDEX "celestial_bodies_name_key" ON "celestial_bodies"("name");

-- CreateIndex
CREATE INDEX "locations_celestialBodyId_idx" ON "locations"("celestialBodyId");

-- CreateIndex
CREATE INDEX "locations_name_idx" ON "locations"("name");

-- CreateIndex
CREATE INDEX "people_fullName_idx" ON "people"("fullName");

-- CreateIndex
CREATE INDEX "archives_archiveProvider_idx" ON "archives"("archiveProvider");

-- CreateIndex
CREATE INDEX "archives_contentHash_idx" ON "archives"("contentHash");

-- CreateIndex
CREATE UNIQUE INDEX "archives_archiveProvider_externalId_key" ON "archives"("archiveProvider", "externalId");

-- CreateIndex
CREATE INDEX "sources_sourceType_idx" ON "sources"("sourceType");

-- CreateIndex
CREATE INDEX "sources_publisher_idx" ON "sources"("publisher");

-- CreateIndex
CREATE UNIQUE INDEX "sources_url_key" ON "sources"("url");

-- CreateIndex
CREATE UNIQUE INDEX "stories_slug_key" ON "stories"("slug");

-- CreateIndex
CREATE INDEX "stories_storyType_idx" ON "stories"("storyType");

-- CreateIndex
CREATE INDEX "stories_publicationStatus_idx" ON "stories"("publicationStatus");

-- CreateIndex
CREATE INDEX "stories_language_idx" ON "stories"("language");

-- CreateIndex
CREATE INDEX "media_mediaType_idx" ON "media"("mediaType");

-- CreateIndex
CREATE INDEX "media_provenanceType_idx" ON "media"("provenanceType");

-- CreateIndex
CREATE INDEX "measurements_equipmentId_idx" ON "measurements"("equipmentId");

-- CreateIndex
CREATE INDEX "measurements_eventId_idx" ON "measurements"("eventId");

-- CreateIndex
CREATE INDEX "measurements_measurementType_idx" ON "measurements"("measurementType");

-- CreateIndex
CREATE INDEX "measurements_measurementDate_idx" ON "measurements"("measurementDate");

-- CreateIndex
CREATE INDEX "mission_equipments_equipmentId_idx" ON "mission_equipments"("equipmentId");

-- CreateIndex
CREATE INDEX "mission_people_personId_idx" ON "mission_people"("personId");

-- CreateIndex
CREATE INDEX "mission_sources_sourceId_idx" ON "mission_sources"("sourceId");

-- CreateIndex
CREATE INDEX "archive_missions_missionId_idx" ON "archive_missions"("missionId");

-- CreateIndex
CREATE INDEX "event_equipments_equipmentId_idx" ON "event_equipments"("equipmentId");

-- CreateIndex
CREATE INDEX "equipment_locations_locationId_idx" ON "equipment_locations"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_locations_equipmentId_locationId_startDate_key" ON "equipment_locations"("equipmentId", "locationId", "startDate");

-- CreateIndex
CREATE INDEX "equipment_people_personId_idx" ON "equipment_people"("personId");

-- CreateIndex
CREATE INDEX "equipment_sources_sourceId_idx" ON "equipment_sources"("sourceId");

-- CreateIndex
CREATE INDEX "archive_equipments_equipmentId_idx" ON "archive_equipments"("equipmentId");

-- CreateIndex
CREATE INDEX "event_locations_locationId_idx" ON "event_locations"("locationId");

-- CreateIndex
CREATE INDEX "event_people_personId_idx" ON "event_people"("personId");

-- CreateIndex
CREATE INDEX "event_sources_sourceId_idx" ON "event_sources"("sourceId");

-- CreateIndex
CREATE INDEX "archive_events_eventId_idx" ON "archive_events"("eventId");

-- CreateIndex
CREATE INDEX "archive_sources_sourceId_idx" ON "archive_sources"("sourceId");

-- CreateIndex
CREATE INDEX "story_missions_missionId_idx" ON "story_missions"("missionId");

-- CreateIndex
CREATE INDEX "story_equipments_equipmentId_idx" ON "story_equipments"("equipmentId");

-- CreateIndex
CREATE INDEX "story_events_eventId_idx" ON "story_events"("eventId");

-- CreateIndex
CREATE INDEX "story_media_mediaId_idx" ON "story_media"("mediaId");

-- CreateIndex
CREATE INDEX "story_sources_sourceId_idx" ON "story_sources"("sourceId");

-- CreateIndex
CREATE INDEX "equipment_media_mediaId_idx" ON "equipment_media"("mediaId");

-- CreateIndex
CREATE INDEX "measurement_sources_sourceId_idx" ON "measurement_sources"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_familyId_idx" ON "refresh_tokens"("familyId");

-- CreateIndex
CREATE INDEX "audit_logs_actorId_idx" ON "audit_logs"("actorId");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "ingestion_runs_status_idx" ON "ingestion_runs"("status");

-- CreateIndex
CREATE INDEX "ingestion_runs_createdAt_idx" ON "ingestion_runs"("createdAt");

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_parentEquipmentId_fkey" FOREIGN KEY ("parentEquipmentId") REFERENCES "equipments"("equipmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("missionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_celestialBodyId_fkey" FOREIGN KEY ("celestialBodyId") REFERENCES "celestial_bodies"("celestialBodyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("equipmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_equipments" ADD CONSTRAINT "mission_equipments_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("missionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_equipments" ADD CONSTRAINT "mission_equipments_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("equipmentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_people" ADD CONSTRAINT "mission_people_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("missionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_people" ADD CONSTRAINT "mission_people_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("personId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_sources" ADD CONSTRAINT "mission_sources_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("missionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_sources" ADD CONSTRAINT "mission_sources_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("sourceId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archive_missions" ADD CONSTRAINT "archive_missions_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "archives"("archiveId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archive_missions" ADD CONSTRAINT "archive_missions_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("missionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_equipments" ADD CONSTRAINT "event_equipments_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_equipments" ADD CONSTRAINT "event_equipments_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("equipmentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_locations" ADD CONSTRAINT "equipment_locations_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("equipmentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_locations" ADD CONSTRAINT "equipment_locations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("locationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_people" ADD CONSTRAINT "equipment_people_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("equipmentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_people" ADD CONSTRAINT "equipment_people_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("personId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_sources" ADD CONSTRAINT "equipment_sources_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("equipmentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_sources" ADD CONSTRAINT "equipment_sources_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("sourceId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archive_equipments" ADD CONSTRAINT "archive_equipments_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "archives"("archiveId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archive_equipments" ADD CONSTRAINT "archive_equipments_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("equipmentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_locations" ADD CONSTRAINT "event_locations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_locations" ADD CONSTRAINT "event_locations_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("locationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_people" ADD CONSTRAINT "event_people_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_people" ADD CONSTRAINT "event_people_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("personId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_sources" ADD CONSTRAINT "event_sources_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_sources" ADD CONSTRAINT "event_sources_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("sourceId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archive_events" ADD CONSTRAINT "archive_events_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "archives"("archiveId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archive_events" ADD CONSTRAINT "archive_events_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archive_sources" ADD CONSTRAINT "archive_sources_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "archives"("archiveId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archive_sources" ADD CONSTRAINT "archive_sources_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("sourceId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_missions" ADD CONSTRAINT "story_missions_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("storyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_missions" ADD CONSTRAINT "story_missions_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("missionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_equipments" ADD CONSTRAINT "story_equipments_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("storyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_equipments" ADD CONSTRAINT "story_equipments_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("equipmentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_events" ADD CONSTRAINT "story_events_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("storyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_events" ADD CONSTRAINT "story_events_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_media" ADD CONSTRAINT "story_media_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("storyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_media" ADD CONSTRAINT "story_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("mediaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_sources" ADD CONSTRAINT "story_sources_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("storyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_sources" ADD CONSTRAINT "story_sources_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("sourceId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_media" ADD CONSTRAINT "equipment_media_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "equipments"("equipmentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_media" ADD CONSTRAINT "equipment_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("mediaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurement_sources" ADD CONSTRAINT "measurement_sources_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "measurements"("measurementId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurement_sources" ADD CONSTRAINT "measurement_sources_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "sources"("sourceId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
