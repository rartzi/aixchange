# Changelog

## [0.2.0] - 2024-02-16
### Added
- Authentication system with NextAuth.js
  - User registration with email/password
  - Secure password hashing with bcrypt
  - JWT-based session management
  - Role-based access control
- Protected dashboard
  - User-specific welcome page
  - Basic dashboard layout
  - Auth-aware routing
- Database integration
  - PostgreSQL setup with custom port
  - Prisma ORM configuration
  - User model with role support

### Changed
- Updated project structure for auth routes
- Enhanced middleware for protected routes
- Improved error handling in API routes

### Security
- Implemented password hashing
- Added input validation with Zod
- Set up proper database permissions
- Protected routes with session checks

## [0.1.0] - 2024-02-16
### Added
- Initial project setup
  - Next.js 14 with App Router
  - Tailwind CSS integration
  - Basic UI components
  - Project structure
- Development infrastructure
  - Jest testing setup
  - Component documentation
  - Basic project structure