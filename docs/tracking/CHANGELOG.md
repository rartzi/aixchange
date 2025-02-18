# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
- Updated color system to use RGB values
- Improved button hover states
- Enhanced text contrast in both themes
- Refactored navigation for better theme support
- Enhanced solution schema with additional metadata fields

### Fixed
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