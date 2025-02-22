# Event System Migration Schema

## Overview
This schema extends the existing solution marketplace with event capabilities while ensuring zero disruption to current functionality.

## Migration Approach

### 1. Add Context to Solution Model
```prisma
// Minimal changes to Solution model
model Solution {
  // All existing fields remain unchanged
  id            String         @id @default(cuid())
  title         String
  description   String
  version       String         @default("1.0.0")
  isPublished   Boolean        @default(false)
  authorId      String
  tags          String[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  publishedAt   DateTime?
  metadata      Json?
  category      String
  imageUrl      String?
  launchUrl     String
  provider      String
  rating        Float          @default(0)
  sourceCodeUrl String?
  status        SolutionStatus @default(PENDING)
  tokenCost     Int            @default(0)
  downvotes     Int            @default(0)
  totalVotes    Int            @default(0)
  upvotes       Int            @default(0)
  
  // New optional fields for event context
  eventId       String?        // Optional reference to event
  event         Event?         @relation(fields: [eventId], references: [id])
  
  // Existing relations
  resources     Resource[]
  reviews       Review[]
  author        User           @relation(fields: [authorId], references: [id])

  // All existing indexes remain unchanged
  @@index([category])
  @@index([provider])
  @@index([status])
  @@index([tokenCost])
  @@index([rating])
  @@index([authorId])
  @@index([isPublished])
  @@index([createdAt])
  @@index([isPublished, category])
  @@index([isPublished, provider])
  @@index([isPublished, status])
}

// SolutionStatus enum remains unchanged
enum SolutionStatus {
  ACTIVE
  PENDING
  INACTIVE
}

### 2. New Event Models
model Event {
  id              String       @id @default(cuid())
  title           String
  description     String
  shortDescription String      // For cards and previews
  startDate       DateTime
  endDate         DateTime
  status          EventStatus  @default(UPCOMING)
  type            EventType    @default(HACKATHON)
  imageUrl        String?      // Event banner/logo
  bannerUrl       String?      // Full-width hero image
  prizes          Json?        // Array of prize descriptions
  rules           String       // Event rules and guidelines
  maxParticipants Int?        // Optional participant limit
  isPublic        Boolean      @default(true)
  isPromoted      Boolean      @default(false) // Featured on AIXcelerate
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  createdById     String
  
  // Relations
  createdBy       User         @relation("EventCreator", fields: [createdById], references: [id])
  participants    EventParticipant[]
  solutions       Solution[]   // Solutions submitted to this event
  votingPhase     VotingPhase?

  @@index([status])
  @@index([startDate])
  @@index([endDate])
  @@index([createdById])
}

enum EventStatus {
  DRAFT
  UPCOMING
  ACTIVE
  VOTING
  COMPLETED
  ARCHIVED
}

enum EventType {
  HACKATHON
  CHALLENGE
  COMPETITION
  WORKSHOP
}

model EventParticipant {
  id              String    @id @default(cuid())
  userId          String
  eventId         String
  role            ParticipantRole @default(PARTICIPANT)
  joinedAt        DateTime @default(now())
  
  // Relations
  user            User      @relation(fields: [userId], references: [id])
  event           Event     @relation(fields: [eventId], references: [id])
  
  @@unique([userId, eventId])
  @@index([userId])
  @@index([eventId])
}

enum ParticipantRole {
  PARTICIPANT
  MENTOR
  JUDGE
  ORGANIZER
}

// Add to User model
model User {
  // All existing fields and relations remain unchanged
  createdEvents    Event[]          @relation("EventCreator")
  participatedEvents EventParticipant[]
}
```

## Migration Steps

1. Create New Tables
```sql
-- Create event-related tables without modifying existing ones
CREATE TABLE events ...
CREATE TABLE event_participants ...
```

2. Add Optional Event Reference to Solutions
```sql
-- Add nullable event_id to solutions
ALTER TABLE solutions 
ADD COLUMN event_id TEXT REFERENCES events(id);

-- Add index for event lookups
CREATE INDEX solutions_event_id_idx ON solutions(event_id);
```

## Key Points

1. Backward Compatibility
   - No changes to existing solution functionality
   - All current marketplace features remain unchanged
   - New event features are purely additive

2. Solution Integration
   - Solutions can optionally be associated with events
   - Existing solution lifecycle (PENDING, ACTIVE, etc.) remains the same
   - No changes to existing solution queries or operations

3. Event Features
   - Complete event management system
   - Participant tracking
   - Event-specific solution context

4. Data Integrity
   - Foreign key constraints ensure data consistency
   - Indexes optimize common queries
   - Maintains existing security model

This approach ensures zero disruption to existing marketplace functionality while enabling new event capabilities.