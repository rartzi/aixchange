# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
- Updated color system to use RGB values
- Improved button hover states
- Enhanced text contrast in both themes
- Refactored navigation for better theme support

### Fixed
- Theme persistence during page navigation
- Color opacity support in Tailwind
- Button hover transitions
- Card hover animations

## [0.1.0] - 2024-02-16

### Added
- Initial project setup
- Next.js 14 with App Router
- Tailwind CSS configuration
- Basic page structure
- Authentication system
- Database integration