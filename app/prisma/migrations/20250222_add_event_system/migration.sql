-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'UPCOMING', 'ACTIVE', 'VOTING', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('HACKATHON', 'CHALLENGE', 'COMPETITION', 'WORKSHOP');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('PARTICIPANT', 'MENTOR', 'JUDGE', 'ORGANIZER');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "type" "EventType" NOT NULL DEFAULT 'HACKATHON',
    "imageUrl" TEXT,
    "bannerUrl" TEXT,
    "prizes" JSONB,
    "rules" TEXT NOT NULL,
    "maxParticipants" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isPromoted" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "participantCount" INTEGER NOT NULL DEFAULT 0,
    "submissionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventParticipant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "role" "ParticipantRole" NOT NULL DEFAULT 'PARTICIPANT',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventParticipant_pkey" PRIMARY KEY ("id")
);

-- AddEventReferenceToSolutions
ALTER TABLE "Solution" ADD COLUMN "eventId" TEXT;

-- CreateIndexes
CREATE INDEX "Event_status_idx" ON "Event"("status");
CREATE INDEX "Event_startDate_idx" ON "Event"("startDate");
CREATE INDEX "Event_endDate_idx" ON "Event"("endDate");
CREATE INDEX "Event_createdById_idx" ON "Event"("createdById");
CREATE INDEX "EventParticipant_userId_idx" ON "EventParticipant"("userId");
CREATE INDEX "EventParticipant_eventId_idx" ON "EventParticipant"("eventId");
CREATE INDEX "Solution_eventId_idx" ON "Solution"("eventId");

-- CreateUniqueConstraints
CREATE UNIQUE INDEX "EventParticipant_userId_eventId_key" ON "EventParticipant"("userId", "eventId");

-- AddForeignKeyConstraints
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;