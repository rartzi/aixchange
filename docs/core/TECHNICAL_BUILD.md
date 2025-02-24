# Technical Build Documentation

## Architecture Overview

### Frontend
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Component-based architecture
- Server and client components

### Backend
- Next.js API routes
- Prisma ORM
- PostgreSQL database
- Authentication with NextAuth.js

## Database Schema

### Solution Model
```prisma
model Solution {
  id          String   @id @default(cuid())
  title       String
  description String
  categories  String[]
  tags        String[]
  implementation String
  usage       String
  requirements String
  version     String
  author      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  metadata    Json
}
```

### Event Model
```prisma
model Event {
  id          String   @id @default(cuid())
  title       String
  description String
  startDate   DateTime
  endDate     DateTime
  rules       String
  prizes      Json
  status      String
  categories  String[]
  tags        String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  metadata    Json
}
```

## API Routes

### Event Routes

#### GET /api/events
- List all events with filtering options
- Public access with pagination
- Optional category and status filters

#### POST /api/admin/events
- Create new event
- Admin-only access
- Request body:
  ```typescript
  {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    rules: string;
    prizes: {
      [key: string]: any;
    };
    categories: string[];
    tags: string[];
  }
  ```

#### POST /api/admin/events/bulk-submission
- Bulk event import endpoint
- Admin-only access
- JSON data validation
- Progress tracking
- Response format:
  ```typescript
  {
    success: boolean;
    message: string;
    data?: {
      events: Event[];
      importedCount: number;
      failedCount: number;
    };
    error?: {
      code: string;
      message: string;
      details?: Array<{
        index: number;
        error: string;
      }>;
    };
  }
  ```

#### POST /api/generate-image
- DALL-E image generation endpoint
- Request body:
  ```typescript
  {
    prompt: string;
  }
  ```
- Response format:
  ```typescript
  {
    success: boolean;
    imagePath?: string;
    error?: {
      code: string;
      message: string;
    };
  }
  ```
- Saves generated images to external-images directory
- Requires valid OpenAI API key

### Admin Routes

#### POST /api/admin/solutions/import
- Bulk solution import endpoint
- Admin-only access with authentication checks
- JSON data validation using Zod schema
- Support for multiple solution types (marketplace/playground)
- Progress tracking for large imports
- Response format:
  ```typescript
  {
    success: boolean;
    message: string;
    data?: {
      solutions: Solution[];
      importedCount: number;
      failedCount: number;
    };
    error?: {
      code: string;
      message: string;
      details?: Array<{
        index: number;
        error: string;
      }>;
    };
  }
  ```

#### POST /api/admin/solutions/bulk-delete
- Bulk solution deletion endpoint
- Admin-only access with authentication checks
- Request body:
  ```typescript
  {
    solutionIds: string[];
  }
  ```
- Response format:
  ```typescript
  {
    success: boolean;
    message: string;
    data?: {
      deletedCount: number;
    };
    error?: {
      code: string;
      message: string;
    };
  }
  ```
- Includes audit logging
- Handles dependent resource cleanup

## Components

### AiXcelerate Components
- EngagementMetrics
  - Display community engagement statistics
  - Real-time metrics updates
  - Responsive design
- EventsCarousel
  - Featured events display
  - Auto-scrolling capability
  - Event preview cards
- Hero
  - Main messaging section
  - Call-to-action buttons
  - Dynamic content areas
- CommunityStats
  - Community growth metrics
  - Visual data representation
  - Real-time updates
- CommunityHub
  - Community interaction features
  - Event participation tracking
  - User engagement tools

### Admin Components
- AdminEventDialog
  - Event creation/editing interface
  - Form validation
  - Date range selection
  - Prize configuration
  - Category management
- AdminNav
  - Navigation between admin sections
  - Access control integration
  - Active state management
- BulkImport
  - JSON file upload handling
  - Progress tracking for large imports
  - Validation feedback with error details
  - Success/error notifications with dark mode support
  - Support for multiple solution types
  - Audit logging integration
  - Test data templates for development

- SolutionManagement
  - Bulk deletion interface
  - Selection management
  - Confirmation dialogs
  - Error handling
  - Success notifications
  - Dark mode support
  - Audit logging integration

### UI Components
- Button variants
- Card components
- Navigation components
- Theme components

## Authentication

### NextAuth.js Configuration
- Role-based access control
- Protected routes
- Admin privileges
- Session management

## Theme System

### Implementation
- CSS custom properties
- Dark/light mode support
- localStorage persistence
- RGB color values
- Transition handling

## Build Process

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Database Management
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Reset database
npm run prisma:reset
```

## Testing

### Jest Configuration
- Unit tests
- Component tests
- API route tests

### Test Commands
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## Deployment

### Requirements
- Node.js 18+
- PostgreSQL 13+
- Environment variables configured

### Environment Variables
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
OPENAI_API_KEY=  # Required for image generation
NEXTAUTH_URL=
```

## Security Measures
- Input validation
- File upload restrictions
- Admin route protection
- CSRF protection
- Rate limiting
- Secure headers