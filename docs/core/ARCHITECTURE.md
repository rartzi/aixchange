# System Architecture

## Overview
This document outlines the technical architecture and implementation plan for (AI)Xplore, including system design, deployment strategies, and technical decisions.

## 1. System Components

### 1.1 Core Architecture
- **Frontend Layer**
  - Next.js 14 with App Router
  - TailwindCSS for styling
  - React Server Components
  - Client-side interactivity

- **Backend Layer**
  - Node.js/Express API
  - GraphQL endpoints
  - WebSocket support
  - Rate limiting

- **Data Layer**
  - PostgreSQL for core data
  - Redis for caching
  - Elasticsearch for search

- **Media Layer**
  - External images storage
  - Read-only volume mounting
  - CDN integration for production
  - Configurable image paths
  - See [Image Guidelines](./IMAGE_GUIDELINES.md) for details

- **Authentication**
  - NextAuth.js with JWT strategy
  - Session duration: 30 days
  - Session refresh: 24 hours
  - Audit logging for all auth events
  - Role-based access control (RBAC)
  - User types:
    - Admin (admin@aixchange.ai)
    - Anonymous (system account)
  - Security features:
    - Password hashing (bcrypt)
    - CSRF protection
    - Return-to-page functionality

### 1.2 Microservices Architecture
- **Solution Management Service**
  - Solution CRUD operations
  - Version control integration
  - Resource management
  - Deployment orchestration
  - Image management and validation

- **Analytics Service**
  - Usage tracking
  - Performance monitoring
  - User behavior analysis
  - Reporting engine

- **Event Management Service**
  - Hackathon organization
  - Event scheduling
  - Submission handling
  - Voting system

- **Rating & Review Service**
  - Multi-dimensional ratings
  - Review management
  - Feedback aggregation
  - Trend analysis

## 2. Infrastructure Design

### 2.1 Deployment Architecture
- **Container Orchestration**
  - Kubernetes-based deployment
  - Docker containerization
  - Service mesh integration
  - Auto-scaling capabilities
  - External volume management for images

- **Cloud Infrastructure**
  - Provider-agnostic design
  - Multi-region support
  - Load balancing
  - CDN integration
  - Shared storage for images

### 2.2 Security Architecture
- **Authentication & Authorization**
  - Zero-trust security model
  - Role-based access control
  - API authentication
  - Session management
  - **Development Note**: Authentication temporarily disabled
    - Development-only configuration
    - Not for production use
    - Re-enable security before deployment

- **Data Security**
  - Encryption at rest
  - Secure communication
  - Audit logging
  - Compliance monitoring
  - Read-only access to external media

### 2.3 Monitoring & Observability
- **Monitoring Stack**
  - Prometheus metrics
  - Grafana dashboards
  - ELK logging stack
  - Alert management

- **Performance Monitoring**
  - Real-time metrics
  - Performance tracking
  - Resource utilization
  - Error tracking
  - Image serving metrics

## 3. Development Environment

### 3.1 Local Development
```bash
# Repository setup
git clone https://github.com/org/(ai)xplore.git
cd (ai)xplore

# Environment configuration
cp .env.example .env
# Configure environment variables

# Create external images directory
mkdir -p external-images/solutions external-images/profiles

# Development servers
npm run dev
```

### 3.2 Docker Development
```yaml
version: '3'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - ./external-images:/external-images:ro

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development

  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=dev
      - POSTGRES_PASSWORD=dev
      - POSTGRES_DB=(ai)xplore_dev
```

## 4. Testing Architecture

### 4.1 Testing Strategy
- **Unit Testing**
  - Component testing
  - Service testing
  - Utility testing

- **Integration Testing**
  - API testing
  - Service integration
  - Database integration
  - Image serving validation

- **End-to-End Testing**
  - User flow testing
  - Performance testing
  - Security testing
  - Media access testing

### 4.2 Quality Assurance
- Minimum 80% code coverage
- Automated testing pipeline
- Performance benchmarks
- Security scanning
- Image validation checks

## 5. Deployment Strategy

### 5.1 CI/CD Pipeline
1. Code push triggers build
2. Automated testing
3. Security scanning
4. Staging deployment
5. Integration testing
6. Production deployment
7. Health checks
8. Monitoring setup
9. Image storage verification

### 5.2 Environment Management
```bash
# Production configuration
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret-key
EXTERNAL_IMAGES_PATH=/external-images
NEXT_PUBLIC_EXTERNAL_IMAGES_URL=http://localhost:3000/external-images
```

## 6. Scalability & Performance

### 6.1 Scaling Strategy
- Horizontal scaling
- Database replication
- Cache distribution
- Load balancing
- CDN for images

### 6.2 Performance Optimization
- Code optimization
- Cache strategies
- Database indexing
- CDN utilization
- Image optimization

## 7. Disaster Recovery

### 7.1 Backup Strategy
- Regular database backups
- Configuration backups
- Code repository mirrors
- Recovery procedures
- Image storage backups

### 7.2 High Availability
- Multi-region deployment
- Failover mechanisms
- Data replication
- Service redundancy
- Redundant image storage

## 8. Schema Design Patterns

### 8.1 Dual Field Approach
- **Direct Fields + Metadata Pattern**
  - Core fields directly on models (id, created/updated timestamps)
  - Extended fields in metadata JSON column
  - Enables schema flexibility while maintaining type safety
  - Example from Solution model:
    ```prisma
    model Solution {
      id          String    @id
      title       String
      description String
      imageUrl    String?   // External image reference
      // Core fields as direct columns
      createdAt   DateTime  @default(now())
      updatedAt   DateTime  @updatedAt
      // Extended fields in metadata
      metadata    Json?
    }
    ```

### 8.2 API Layer Transformation
- **Request Processing**
  - Incoming data validated against Zod schemas
  - Core fields mapped directly
  - Extended fields consolidated into metadata
  
- **Response Processing**
  - Metadata fields extracted and flattened
  - Transformed into consistent API response shape
  - Example transformation:
    ```typescript
    // Internal DB structure
    {
      id: "123",
      title: "Solution",
      imageUrl: "/external-images/solutions/image.jpg",
      metadata: {
        category: "AI",
        provider: "OpenAI"
      }
    }
    // API response
    {
      id: "123",
      title: "Solution",
      imageUrl: "/external-images/solutions/image.jpg",
      category: "AI",
      provider: "OpenAI"
    }
    ```

### 8.3 Benefits and Trade-offs
- **Benefits**
  - Schema flexibility without migrations
  - Type safety for core fields
  - Easy addition of new fields
  - Efficient querying of core fields
  
- **Trade-offs**
  - Complexity in API layer
  - Potential performance impact on metadata queries
  - Need for careful metadata field documentation
  - Additional validation complexity

## Technical Decisions Log

### Authentication
- **Decision**: Use NextAuth.js with JWT and database session tracking
- **Rationale**: Provides secure authentication with audit capabilities
- **Current Status**: Fully implemented with role-based access
- **Features**:
  - JWT-based sessions with 30-day duration
  - Database audit logging for all auth events
  - Role-based access control (Admin/User)
  - Return-to-page functionality
- **Impact**: Secure, trackable user authentication with proper session management

### Database
- **Decision**: PostgreSQL + Redis
- **Rationale**: Strong ACID compliance, good caching
- **Alternatives Considered**: MongoDB, MySQL
- **Impact**: Reliable data storage, efficient caching

### Frontend Framework
- **Decision**: Next.js 14
- **Rationale**: Strong SSR, good DX, React integration
- **Alternatives Considered**: Remix, SvelteKit
- **Impact**: Improved performance, better SEO

### Media Storage
- **Decision**: External images with read-only mounting
- **Rationale**: Efficient image serving without container bloat
- **Alternatives Considered**: S3, embedded storage
- **Impact**: Better resource utilization, simplified image management

## References
- [Development Guide](./DEVELOPMENT.md)
- [Product Documentation](./PRODUCT.md)
- [Governance Documentation](./GOVERNANCE.md)
- [Vision Document](./VISION.md)
- [Image Guidelines](./IMAGE_GUIDELINES.md)
