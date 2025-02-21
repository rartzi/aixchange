# Changelog

## [Unreleased]
### Added
- Placeholder pages for upcoming features:
  - Experiment platform
  - Events
  - Blog
  - Documentation
  - Support center
  - About page
  - Contact form
  - Privacy policy
- Reusable PlaceholderPage component for consistent "coming soon" pages
- New deployment option `preserve-seed` to deploy with database seeding
- Reusable PlaceholderPage component for consistent "coming soon" pages

### Fixed
- Image generation and storage issues:
  - Added external-images API route for serving generated images
  - Fixed file permissions in Docker containers
  - Improved volume mount configurations
  - Added proper error handling and logging
- Docker deployment improvements:
  - Made project name configurable
  - Added container health checks
  - Fixed volume permissions

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- DALL-E image generation for solutions
  - Automated image generation API endpoint
  - Integration with solution creation form
  - Secure file storage for generated images
  - Loading states and error handling
- Dynamic stats on landing page
  - Real-time community member count
  - Live AI solutions count
  - Loading states for stats
  - Stats API endpoint
- Landing page implementation
  - Hero section with clear value proposition
  - How it Works section with step-by-step guide
  - Features section showcasing platform capabilities
  - Stats section with key metrics
  - CTA sections for user engagement
  - Footer with comprehensive navigation
- Solutions marketplace search and filter functionality
  - Full-text search across titles, descriptions, and tags
  - Category-based filtering (ML, NLP, CV)
  - Sorting options (recent, rating, popular)
  - Loading states and error handling
  - Empty state feedback
- Solution import functionality for admin users
  - Import API endpoint with validation
  - Admin UI for solution imports
  - Solution schema updates
  - Database migrations for solution metadata
- Theme system with light/dark mode support
  - CSS custom properties for theme colors
  - Theme persistence using localStorage
  - Smooth transitions between themes
  - RGB color values for opacity support
- Reusable button components with theme support
  - Primary button style
  - Secondary button style
  - Outline button style
- Card hover effects with theme-aware styling
- Gradient utilities for backgrounds and text
- Theme toggle button in navigation
- Shared Navbar component
- Cross-page theme consistency

### Changed
- Updated landing page stats display
  - Removed static Partners and Support stats
  - Added dynamic data fetching
  - Improved grid layout for stats section
- Updated terminology for consistency
  - Changed "Create Solution" to "Submit Solution"
  - Changed "Bulk Import" to "Bulk Submission"
  - Updated related UI elements and documentation
  - Renamed components to match new terminology
  - Updated all button text and messages
- Enhanced solution status display
  - Added status indicator with color coding
  - Prepared for future lifecycle management
  - Improved visibility of solution state
- Improved Docker configuration
  - Added proper volume for uploads
  - Fixed permissions for node user
  - Added Next.js cache volume
  - Prepared for cloud storage migration
- Enhanced solution filtering with metadata support
- Improved search performance with debouncing
- Updated solution cards with metadata display
- Improved solutions grid loading
  - Switched from pagination to full data loading
  - Enhanced filter performance with client-side filtering
  - Updated tag system to use complete solution set
  - Improved user experience with immediate filtering
- Updated color system to use RGB values
- Improved button hover states
- Enhanced text contrast in both themes
- Refactored navigation for better theme support
- Enhanced solution schema with additional metadata fields

### Fixed
- Solution author attribution
  - Added customizable author name input
  - Default to current user's name
  - Improved anonymous user handling
- Solution image display
  - Fixed image URL format to properly serve through API route
  - Added '/api' prefix to external image URLs
  - Improved image loading reliability
- Dark mode form input visibility
  - Added proper background and text colors to all form inputs
  - Improved contrast in dark mode for better readability
- Optional GitHub repository URL submission
  - Modified schema to accept empty strings
  - Removed mandatory URL validation
- Solutions grid infinite scroll
  - Replaced "Load More" button with automatic loading
  - Added intersection observer for better UX
  - Improved loading state feedback
- Theme persistence during page navigation
- Color opacity support in Tailwind
- Button hover transitions
- Card hover animations
- Solution submission workflow
  - Fixed file upload handling in API route
  - Improved type safety and error handling
  - Enhanced form validation and feedback
  - Added proper metadata handling
  - Fixed audit logging
  - Organized file uploads by year/month
  - Added proper file permissions (755 for dirs, 644 for files)
  - Added configurable upload storage with Docker user
- Solution card display
  - Standardized image sizing (128x128)
  - Added proper border and styling
  - Improved image loading optimization
  - Implemented vertical metadata layout with labels
  - Added consistent min-heights for all sections
  - Made description and tags sections uniform
  - Fixed spacing and alignment throughout
- Form improvements
  - Updated submit button text for clarity
  - Enhanced loading state feedback

### Added
- Persistent storage for solution uploads
  - Docker volume for image storage
  - Year/month based organization
  - Configurable upload directory

## [0.1.0] - 2024-02-16

### Added
- Initial project setup
- Next.js 14 with App Router
- Tailwind CSS configuration
- Basic page structure
- Authentication system
- Database integration