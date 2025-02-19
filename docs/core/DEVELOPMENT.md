# AiXchange Development Guide

## Development Environment Setup

### Prerequisites
- Node.js (v18.17 or later)
- Docker and Docker Compose
- Git
- PostgreSQL client (for local development)
- pnpm (recommended package manager)

### Local Setup

There are two ways to set up the development environment: with Docker (recommended for production-like environment) or without Docker (faster for local development).

#### Option 1: Docker Setup (Full Environment)

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd aixchange
   ```

2. **Environment Configuration**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Configure environment variables for Docker setup
   # Required variables:
   # - POSTGRES_USER
   # - POSTGRES_PASSWORD
   # - POSTGRES_DB
   # - DATABASE_URL (postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB})
   # - NEXTAUTH_SECRET
   # - NEXTAUTH_URL
   ```

3. **Start Docker Environment**
   ```bash
   docker-compose up
   ```

#### Option 2: Local Setup (Without Docker)

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd aixchange
   ```

2. **Install Dependencies**
   ```bash
   # Install pnpm if not already installed
   npm install -g pnpm

   # Install project dependencies
   pnpm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy example environment file
   cp .env.example .env.local
   
   # For local development without PostgreSQL, you can use SQLite
   # Set these variables in .env.local:
   # DATABASE_URL="file:./dev.db"
   # NEXTAUTH_SECRET="your-secret-key"
   # NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma Client
   pnpm prisma generate

   # Create SQLite database and run migrations
   pnpm prisma migrate dev

   # Seed the database (optional)
   pnpm prisma db seed
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

## Project Structure

```
aixchange/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # ShadcN UI components
│   ├── features/         # Feature-specific components
│   └── shared/           # Shared components
├── lib/                   # Utility functions
│   ├── utils/            # Helper functions
│   └── hooks/            # Custom React hooks
├── styles/               # Global styles
│   └── globals.css       # Tailwind imports
├── public/               # Static assets
├── prisma/               # Database schema
├── tests/                # Test files
├── docker/               # Docker configs
└── docs/                 # Documentation
```

## Development Workflow

### 1. Code Standards
- Use TypeScript for type safety
- Follow Next.js best practices
- Implement accessible components
- Write unit tests
- Use ESLint and Prettier

### 2. Styling Guidelines
- Use Tailwind CSS utility classes
- Follow component-first organization
- Maintain consistent spacing
- Use design tokens
- Support dark mode

### 3. Component Development
- Use ShadcN UI components
- Create reusable components
- Implement responsive design
- Ensure accessibility
- Document props and usage

### 4. Git Workflow
- Branch naming: `feature/`, `fix/`, `docs/`
- Commit message format: `type(scope): message`
- Create pull requests
- Require code review
- Follow conventional commits

### 5. Testing
```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Run specific test file
pnpm test -- path/to/test
```

## Solution Management

### Creating Solutions
- Solutions can be created through the web interface
- Required fields: title, description
- Optional: tags for categorization
- Version control is automatically managed
- Resources can be attached to solutions

### Solution Features
- Version tracking (1.0.0 format)
- Resource management
- Review system
- Audit logging
- Tag-based categorization

### API Endpoints
```bash
# Create solution
POST /api/solutions

# Get solutions
GET /api/solutions
GET /api/solutions?published=true
GET /api/solutions?author={authorId}
GET /api/solutions?tag={tagName}

# Update solution
PUT /api/solutions/{id}

# Delete solution
DELETE /api/solutions/{id}
```

## Working with Metadata Fields

### Understanding the Dual Field Pattern
- **Core Fields**: Direct database columns (id, title, etc.)
- **Metadata Fields**: Flexible JSON data for extended properties
- Benefits: Schema flexibility without migrations
- Trade-offs: Additional complexity in data access

### Best Practices for Field Access

#### Reading Metadata Fields
```typescript
// Type-safe metadata access
const metadata = solution.metadata as Record<string, any>;
const category = metadata.category || 'Other';
const provider = metadata.provider || 'Unknown';

// Using with destructuring
const {
  category = 'Other',
  provider = 'Unknown',
  tokenCost = 0
} = solution.metadata as Record<string, any>;
```

#### Writing Metadata Fields
```typescript
// Creating/updating metadata
await prisma.solution.create({
  data: {
    title: "Solution Title",
    description: "Description",
    metadata: {
      category: "AI",
      provider: "OpenAI",
      tokenCost: 100
    } as Prisma.JsonObject
  }
});
```

#### Querying Metadata Fields
```typescript
// Filter by metadata field
const solutions = await prisma.solution.findMany({
  where: {
    metadata: {
      path: ['category'],
      equals: 'AI'
    }
  }
});
```

### Migration Path for New Features

1. **Adding New Fields**
   - Start by adding to metadata JSON
   - Monitor field usage and stability
   - Consider migration to direct column if:
     - Field becomes core functionality
     - Frequent querying is needed
     - Type safety is critical

2. **Field Migration Process**
   ```typescript
   // 1. Add new direct column
   // In schema.prisma:
   model Solution {
     newField String?
     metadata Json?
   }

   // 2. Migration script
   const solutions = await prisma.solution.findMany();
   for (const solution of solutions) {
     const metadata = solution.metadata as Record<string, any>;
     await prisma.solution.update({
       where: { id: solution.id },
       data: {
         newField: metadata.fieldToMigrate,
         metadata: {
           ...metadata,
           fieldToMigrate: undefined
         }
       }
     });
   }
   ```

### Type Safety with Metadata
```typescript
// Define metadata interface
interface SolutionMetadata {
  category?: string;
  provider?: string;
  tokenCost?: number;
}

// Type-safe metadata access
const metadata = solution.metadata as SolutionMetadata;
const category = metadata.category;  // TypeScript knows this is string | undefined
```

## Docker Development

### Services Configuration
```yaml
version: '3'
services:
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next

  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

## Development Commands

```bash
# Start development server
pnpm dev

# Build production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Format code
pnpm format
```

## Database Management

### Database Options

#### PostgreSQL (Docker Setup)
- Used in production and Docker development environment
- Provides full feature set and production-like environment
- Requires Docker and container setup
- Connection via DATABASE_URL="postgresql://user:pass@db:5432/dbname"

#### SQLite (Local Development)
- Lightweight, file-based database
- Perfect for local development without Docker
- No additional setup required
- Connection via DATABASE_URL="file:./dev.db"
- Some PostgreSQL-specific features may not be available

### Prisma Commands

For both setups:
```bash
# Generate Prisma client (required for both setups)
pnpm prisma generate
```

For PostgreSQL (Docker):
```bash
# Apply migrations in Docker
pnpm prisma migrate deploy

# Push schema changes
pnpm prisma db push

# Open Prisma Studio (requires port forwarding)
pnpm prisma studio
```

For SQLite (Local):
```bash
# Create and apply migrations
pnpm prisma migrate dev

# Seed the database
pnpm prisma db seed

# Reset database
pnpm prisma reset

# Open Prisma Studio (works directly)
pnpm prisma studio
```

### Switching Between Databases
To switch between PostgreSQL and SQLite:
1. Update DATABASE_URL in your .env file
2. Run `pnpm prisma generate` to update the client
3. Run appropriate migration command for your setup
4. (Optional) Seed the database if needed

## Monitoring & Debugging

### Local Development
- Next.js development server: `http://localhost:3000`
- API routes: `http://localhost:3000/api/*`
- Database: `localhost:5432`

### Development Tools
- React Developer Tools
- Next.js DevTools
- Prisma Studio
- Tailwind CSS IntelliSense

## Deployment

### Vercel Deployment
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push
4. Monitor build and deployment

### Manual Deployment
1. Build application
2. Run database migrations
3. Start production server
4. Monitor health checks

## Common Issues & Solutions

### Next.js
- Clear `.next` cache
- Update dependencies
- Check TypeScript errors
- Verify environment variables

### Database
- Check connection string
- Verify migrations
- Reset database if needed
- Use Prisma Studio for debugging

### Docker
- Rebuild containers
- Check logs
- Verify environment
- Clear Docker cache

## Additional Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ShadcN UI Documentation](https://ui.shadcn.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Architecture Overview](./ARCHITECTURE.md)
- [API Documentation](../api/README.md)