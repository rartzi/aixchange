# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Solution edit functionality in admin interface
  - Added dedicated EditSolutionDialog component
  - Fixed form validation and error handling
  - Improved PATCH endpoint data processing
  - Added proper loading states and user feedback
  - Fixed status conversion and required fields handling

### Added
- New EditSolutionDialog component for better solution management
- Enhanced error handling in solution updates
- Loading states and user feedback in admin interface
- Improved form validation for solution editing

### Changed
- Separated solution creation and editing logic
- Updated PATCH endpoint to handle solution updates more robustly
- Improved error responses in API endpoints

## [1.0.0] - 2024-02-24

### Added
- Initial release
- Basic solution management functionality
- Admin interface for solutions
- Solution creation and listing
- Bulk import/export capabilities