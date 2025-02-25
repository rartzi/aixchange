# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Events system implementation
  - Full CRUD operations for events
  - DALL-E integration for automatic event image generation
  - Bulk import/export functionality for events
  - Advanced filtering and sorting in admin interface
  - Event status management system
  - Event participation tracking
- AdminEventDialog component with image generation capabilities
- Event editing functionality in admin interface
- Enhanced generate-image API to support both solutions and events
- New external images API endpoint for serving event and solution images

### Fixed
- Admin events page functionality restored
  - Re-implemented selective edit, delete, and settings features
  - Fixed event table with sorting and filtering
  - Restored bulk actions (status updates, delete)
  - Fixed AdminEventDialog with complete form fields
  - Improved image handling with proper defaults
  - Enhanced TypeScript type safety
  - Added missing bulk-delete API endpoint
- Image handling in event forms and bulk import
  - Removed default image when creating new events
  - Fixed image preview behavior
  - Added proper image URL transformation
  - Corrected image path handling for generated images
  - Added external images API endpoint for serving images
  - Fixed bulk import image resolution
- Community stats reporting
  - Fixed incorrect stats on /aixcelerate page
  - Added proper counting of events, solutions, and users
- Solution edit functionality in admin interface
  - Added dedicated EditSolutionDialog component
  - Fixed form validation and error handling
  - Improved PATCH endpoint data processing
  - Added proper loading states and user feedback
  - Fixed status conversion and required fields handling
- Image display in solution and event forms
  - Fixed path configuration in external-images API
  - Aligned upload and serving paths using environment variables
  - Restored image display functionality across all components

### Added
- New EditSolutionDialog component for better solution management
- Enhanced error handling in solution updates
- Loading states and user feedback in admin interface
- Improved form validation for solution editing

### Changed
- Separated solution creation and editing logic
- Updated PATCH endpoint to handle solution updates more robustly
- Improved error responses in API endpoints
- Enhanced generate-image API to handle multiple content types
- Added new image serving system through external-images API
- Updated external-images API to use environment configuration

## [1.0.0] - 2024-02-24

### Added
- Initial release
- Basic solution management functionality
- Admin interface for solutions
- Solution creation and listing
- Bulk import/export capabilities