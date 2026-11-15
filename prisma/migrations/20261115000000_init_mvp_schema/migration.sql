-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AccountRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "MachineKind" AS ENUM ('LANDER', 'ROVER', 'HELICOPTER', 'LANDING_CRAFT_STAGE', 'INSTRUMENT', 'ORBITER', 'OTHER');

-- CreateEnum
CREATE TYPE "MachineState" AS ENUM ('STILL_ACTIVE', 'STOPPED_ANSWERING', 'JOB_FINISHED', 'LEFT_ON_PURPOSE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "MediaLabel" AS ENUM ('REAL_PHOTO', 'RECONSTRUCTION', 'AI_ILLUSTRATION', 'DATA_CHART');

-- CreateEnum
CREATE TYPE "ContentOrigin" AS ENUM ('AUTHORED', 'GENERATED');

-- CreateEnum
CREATE TYPE "GenerationKind" AS ENUM ('VIDEO', 'ARTICLE');

-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QuizLevel" AS ENUM ('EXPLORER', 'EXPERT');

-- CreateEnum
CREATE TYPE "BadgeRule" AS ENUM ('QUIZ_COMPLETED_COUNT', 'PERFECT_SCORE_COUNT', 'BODY_ALL_QUIZZES');

-- CreateEnum
CREATE TYPE "IngestionStatus" AS ENUM ('RECEIVED', 'VALIDATED', 'REJECTED', 'COMMITTED', 'FAILED');

-- CreateTable
CREATE TABLE "visitors" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "visitorId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "role" "AccountRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "visitorId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "celestial_bodies" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "imagePath" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "celestial_bodies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machines" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "bodyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "MachineKind" NOT NULL,
    "state" "MachineState" NOT NULL,
    "stateSince" TEXT,
    "launchYear" INTEGER,
    "arrivalYear" INTEGER,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "missionPurpose" TEXT NOT NULL,
    "howItWorked" TEXT NOT NULL,
    "discoveries" TEXT NOT NULL,
    "currentStatusNote" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "machines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machine_sources" (
    "id" UUID NOT NULL,
    "machineId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "machine_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machine_facts" (
    "id" UUID NOT NULL,
    "machineId" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "sourceId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "machine_facts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machine_events" (
    "id" UUID NOT NULL,
    "machineId" UUID NOT NULL,
    "dateLabel" TEXT NOT NULL,
    "dateIso" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sourceId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "machine_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machine_images" (
    "id" UUID NOT NULL,
    "machineId" UUID NOT NULL,
    "path" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "label" "MediaLabel" NOT NULL,
    "credit" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "machine_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logbook_entries" (
    "id" UUID NOT NULL,
    "machineId" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "articleMarkdown" TEXT,
    "articleOrigin" "ContentOrigin",
    "videoUrl" TEXT,
    "videoOrigin" "ContentOrigin",
    "videoDurationSec" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logbook_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generation_jobs" (
    "id" UUID NOT NULL,
    "logbookEntryId" UUID NOT NULL,
    "kind" "GenerationKind" NOT NULL,
    "status" "GenerationStatus" NOT NULL DEFAULT 'QUEUED',
    "externalJobId" TEXT,
    "requestedById" UUID,
    "requestPayload" JSONB NOT NULL,
    "resultText" TEXT,
    "resultUrl" TEXT,
    "errorCode" TEXT,
    "errorMessage" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generation_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" "QuizLevel" NOT NULL,
    "bodyId" UUID,
    "machineId" UUID,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" UUID NOT NULL,
    "quizId" UUID NOT NULL,
    "prompt" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_options" (
    "id" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "quiz_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" UUID NOT NULL,
    "visitorId" UUID NOT NULL,
    "quizId" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_answers" (
    "id" UUID NOT NULL,
    "attemptId" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "optionId" UUID NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "quiz_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconKey" TEXT NOT NULL,
    "rule" "BadgeRule" NOT NULL,
    "threshold" INTEGER NOT NULL DEFAULT 1,
    "bodyId" UUID,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_badges" (
    "visitorId" UUID NOT NULL,
    "badgeId" UUID NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_badges_pkey" PRIMARY KEY ("visitorId","badgeId")
);

-- CreateTable
CREATE TABLE "ingestion_batches" (
    "id" UUID NOT NULL,
    "requestedById" UUID,
    "filename" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "status" "IngestionStatus" NOT NULL DEFAULT 'RECEIVED',
    "rejectCode" TEXT,
    "rejectReason" TEXT,
    "report" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "ingestion_batches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visitors_lastSeenAt_idx" ON "visitors"("lastSeenAt");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_visitorId_key" ON "accounts"("visitorId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_tokenHash_key" ON "sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "sessions_visitorId_idx" ON "sessions"("visitorId");

-- CreateIndex
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "celestial_bodies_slug_key" ON "celestial_bodies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "machines_slug_key" ON "machines"("slug");

-- CreateIndex
CREATE INDEX "machines_bodyId_isPublished_idx" ON "machines"("bodyId", "isPublished");

-- CreateIndex
CREATE INDEX "machines_kind_idx" ON "machines"("kind");

-- CreateIndex
CREATE INDEX "machines_state_idx" ON "machines"("state");

-- CreateIndex
CREATE INDEX "machines_arrivalYear_idx" ON "machines"("arrivalYear");

-- CreateIndex
CREATE UNIQUE INDEX "machine_sources_machineId_url_key" ON "machine_sources"("machineId", "url");

-- CreateIndex
CREATE INDEX "machine_facts_machineId_sortOrder_idx" ON "machine_facts"("machineId", "sortOrder");

-- CreateIndex
CREATE INDEX "machine_events_machineId_sortOrder_idx" ON "machine_events"("machineId", "sortOrder");

-- CreateIndex
CREATE INDEX "machine_images_machineId_sortOrder_idx" ON "machine_images"("machineId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "logbook_entries_machineId_slug_key" ON "logbook_entries"("machineId", "slug");

-- CreateIndex
CREATE INDEX "generation_jobs_status_updatedAt_idx" ON "generation_jobs"("status", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_slug_key" ON "quizzes"("slug");

-- CreateIndex
CREATE INDEX "quiz_attempts_visitorId_quizId_idx" ON "quiz_attempts"("visitorId", "quizId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_answers_attemptId_questionId_key" ON "quiz_answers"("attemptId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "badges_slug_key" ON "badges"("slug");

-- CreateIndex
CREATE INDEX "ingestion_batches_createdAt_idx" ON "ingestion_batches"("createdAt");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_bodyId_fkey" FOREIGN KEY ("bodyId") REFERENCES "celestial_bodies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machine_sources" ADD CONSTRAINT "machine_sources_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machine_facts" ADD CONSTRAINT "machine_facts_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machine_facts" ADD CONSTRAINT "machine_facts_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "machine_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machine_events" ADD CONSTRAINT "machine_events_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machine_events" ADD CONSTRAINT "machine_events_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "machine_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "machine_images" ADD CONSTRAINT "machine_images_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logbook_entries" ADD CONSTRAINT "logbook_entries_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generation_jobs" ADD CONSTRAINT "generation_jobs_logbookEntryId_fkey" FOREIGN KEY ("logbookEntryId") REFERENCES "logbook_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_bodyId_fkey" FOREIGN KEY ("bodyId") REFERENCES "celestial_bodies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "quiz_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "quiz_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badges" ADD CONSTRAINT "badges_bodyId_fkey" FOREIGN KEY ("bodyId") REFERENCES "celestial_bodies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_badges" ADD CONSTRAINT "visitor_badges_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_badges" ADD CONSTRAINT "visitor_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

