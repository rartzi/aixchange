# AiXchange Development Guide

## Development Environment Setup

### Prerequisites
- Node.js (v18.17 or later)
- Docker and Docker Compose
- Git
- PostgreSQL client (for local development)
- pnpm (recommended package manager)

### Local Setup

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
   
   # Required variables:
   # - DATABASE_URL
   # - NEXTAUTH_SECRET
   # - NEXTAUTH_URL
   # - API_KEY (if needed)
   ```

4. **Development Server**
   ```bash
   # Start the development server
   pnpm dev

   # Or with Docker
   docker-compose up
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

### Prisma Commands
```bash
# Generate Prisma client
pnpm prisma generate

# Create migration
pnpm prisma migrate dev

# Apply migrations
pnpm prisma migrate deploy

# Reset database
pnpm prisma reset
```

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