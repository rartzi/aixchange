# Architecture Overview

## System Components

### Frontend Architecture
- Next.js 14 with App Router
- React Server Components
- Client-side Components for interactive features
- TailwindCSS for styling
- Shadcn/ui for component library

### Backend Architecture
- Next.js API Routes
- Prisma ORM
- PostgreSQL Database
- NextAuth.js for authentication

## Key Features

### Authentication & Authorization
- Role-based access control (User, Admin, Moderator)
- Protected API routes and pages
- Session management with NextAuth.js

### Admin Interface
- Centralized management dashboard
- Bulk operations support for efficient management
  - Bulk status updates for solutions
  - Status filtering and management
- Dark mode support with proper contrast
- Responsive design for all screen sizes

### Solution Management
- CRUD operations for solutions
- Bulk operations support
- Status management (Active, Pending, Inactive)
- Image handling and storage
- Voting system
- Review system

### User Management
- User role management
- Account status control
- Activity tracking

## API Structure

### Admin API Endpoints
- `/api/admin/solutions`
  - GET: List all solutions
  - POST: Create new solution
- `/api/admin/solutions/[id]`
  - GET: Get solution details
  - PATCH: Update solution
  - DELETE: Delete solution
- `/api/admin/solutions/bulk-update`
  - POST: Update multiple solutions
- `/api/admin/users`
  - GET: List all users
  - POST: Create new user
- `/api/admin/users/[id]`
  - GET: Get user details
  - PATCH: Update user
  - DELETE: Delete user

### Public API Endpoints
- `/api/solutions`
  - GET: List public solutions
  - POST: Submit new solution
- `/api/solutions/[id]`
  - GET: Get solution details
  - PATCH: Update solution (owner only)
  - DELETE: Delete solution (owner only)

## Database Schema

### Solution
```prisma
model Solution {
  id            String         @id @default(cuid())
  title         String
  description   String
  status        SolutionStatus @default(PENDING)
  authorId      String
  category      String
  provider      String
  launchUrl     String
  sourceCodeUrl String?
  imageUrl      String?
  tokenCost     Int           @default(0)
  rating        Float         @default(0)
  upvotes       Int           @default(0)
  downvotes     Int           @default(0)
  totalVotes    Int           @default(0)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  author        User          @relation(fields: [authorId], references: [id])
  reviews       Review[]
}
```

### User
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  role          UserRole  @default(USER)
  solutions     Solution[]
  reviews       Review[]
}
```

## Frontend Component Structure

### Admin Components
- Layout components
  - AdminLayout: Base layout for admin pages
  - AdminNav: Navigation component
- Feature components
  - Solutions management
    - SolutionsGrid: Main solutions table
    - AdminSolutionDialog: Edit/create dialog
    - BulkSolutionSubmission: Bulk import component
  - User management
    - UsersTable: User management table
    - UserDialog: Edit/create dialog

### UI Components
- Base components (from shadcn/ui)
  - Button
  - Input
  - Select
  - Dialog
  - Table
  - Checkbox
- Custom components
  - ImageSelector
  - StatusBadge
  - FilterSidebar

## Styling Architecture
- TailwindCSS for utility-first styling
- Dark mode support
  - Proper contrast ratios
  - Consistent color palette
  - Accessible text colors
- Component-specific styles
- Global styles in globals.css

## Security Considerations
- Role-based access control
- API route protection
- Input validation
- XSS prevention
- CSRF protection
- Rate limiting

## Performance Optimizations
- Server components for static content
- Client components for interactive features
- Image optimization
- Lazy loading
- Pagination
- Caching strategies

## Future Considerations
- Enhanced bulk operations
- Advanced filtering
- Export functionality
- Analytics dashboard
- Activity logging
- Audit trail
